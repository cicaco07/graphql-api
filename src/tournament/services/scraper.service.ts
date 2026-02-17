import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ScrapedHeroStat {
  heroName: string;
  heroSlug: string;
  heroImageUrl: string;
  picks: number;
  wins: number;
  losses: number;
  winRate: number;
  pickRate: number;
  blueSidePicks: number;
  blueSideWins: number;
  redSidePicks: number;
  redSideWins: number;
  bans: number;
  banRate: number;
  picksAndBans: number;
  presenceRate: number;
}

export interface ScrapedStage {
  name: string;
  slug: string;
  liquipediaUrl: string;
  order: number;
}

@Injectable()
export class ScraperService {
  private readonly logger = new Logger(ScraperService.name);
  private readonly BASE = 'https://liquipedia.net';
  private readonly HEADERS = {
    'User-Agent': 'Mozilla/5.0 (compatible; MLBBTournamentBot/1.0)',
    'Accept-Language': 'en-US,en;q=0.9',
    Accept: 'text/html,application/xhtml+xml',
  };

  // Helpers

  private sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }

  private toSlug(s: string) {
    return s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Ambil hanya angka/desimal dari teks cell, buang "%" dan karakter lain
  private parseNum($cell: cheerio.Cheerio<any>): number {
    // Ambil HANYA text node langsung (bukan child element) supaya
    // tidak ikut angka dari nested table "Detailed Statistics"
    const direct = $cell
      .contents()
      .filter((_, n) => n.type === 'text')
      .text()
      .trim();

    // Jika kosong, coba teks dari link/span pertama saja
    const raw = direct || $cell.find('a, span').first().text().trim();
    return parseFloat(raw.replace(/[^0-9.]/g, '')) || 0;
  }

  // ── Fetch dengan retry & rate-limit ──────────────────────────────────────

  async fetchHtml(url: string, attempt = 1): Promise<string> {
    try {
      await this.sleep(2500);
      const res = await axios.get<string>(url, {
        headers: this.HEADERS,
        timeout: 20000,
      });
      return res.data;
    } catch (err: any) {
      if (err.response?.status === 429 && attempt < 3) {
        this.logger.warn(`Rate limited, retry ${attempt}/3 in 15s...`);
        await this.sleep(15000);
        return this.fetchHtml(url, attempt + 1);
      }
      throw new Error(`Fetch failed [${url}]: ${err.message}`);
    }
  }

  // ── Temukan tabel hero stats utama ────────────────────────────────────────
  // Tabel hero stats di Liquipedia M7 punya class "wikitable table-striped sortable"
  // dan merupakan tabel terbesar (paling banyak rows) di halaman

  private findHeroTable($: cheerio.CheerioAPI): cheerio.Cheerio<any> | null {
    let found: cheerio.Cheerio<any> | null = null;
    let maxRows = 0;

    $('table.wikitable').each((_, el) => {
      const tbl = $(el);
      const rows = tbl.find('tr').length;

      // Tabel utama adalah yang paling banyak row-nya
      // dan punya header "Hero" + "Bans" + "Picks & Bans"
      const headerText = tbl
        .find('th')
        .map((_, th) => $(th).text().trim())
        .get()
        .join('|');

      const isHeroTable =
        headerText.includes('Hero') &&
        headerText.includes('Bans') &&
        headerText.includes('Picks');

      if (isHeroTable && rows > maxRows) {
        maxRows = rows;
        found = tbl;
      }
    });

    return found;
  }

  // ── Parse tabel → array ScrapedHeroStat ──────────────────────────────────

  parseHeroTable(html: string): ScrapedHeroStat[] {
    const $ = cheerio.load(html);
    const table = this.findHeroTable($);

    if (!table) {
      this.logger.warn(
        'Hero stats table not found — page structure may have changed',
      );
      return [];
    }

    const results: ScrapedHeroStat[] = [];

    // Skip 2 header rows, mulai parse dari row data
    // Setiap row data punya TD pertama berisi nomor urut (angka)
    table.find('tbody tr').each((_, row) => {
      const cells = $(row).find('td');

      // Row valid: minimal 19 kolom, dan cell[0] berisi angka (nomor urut)
      if (cells.length < 19) return;
      const rowNum = cells.eq(0).text().trim();
      if (!rowNum || isNaN(Number(rowNum))) return;

      // ── Cell[1]: Hero name & image ───────────────────────────────────────
      const heroCell = cells.eq(1);
      // Ambil link terakhir karena ada 2 link (desktop + mobile) untuk nama hero
      const heroName = heroCell.find('a').last().text().trim();
      if (!heroName) return;

      const imgSrc = heroCell.find('img').first().attr('src') || '';
      const heroImageUrl = imgSrc
        ? imgSrc.startsWith('http')
          ? imgSrc
          : `${this.BASE}${imgSrc}`
        : '';

      // ── Picks ─────────────────────────────────────────────────────────────
      // Cell[2] = total picks ∑ (nilai ada di dalam <a> tag)
      const picks = this.parseNum(cells.eq(2));
      const wins = this.parseNum(cells.eq(3));
      const losses = this.parseNum(cells.eq(4));
      const winRate = this.parseNum(cells.eq(5)); // "54.17%" → 54.17
      const pickRate = this.parseNum(cells.eq(6)); // "%T" → 52.55

      // ── Blue Side ─────────────────────────────────────────────────────────
      const blueSidePicks = this.parseNum(cells.eq(7));
      const blueSideWins = this.parseNum(cells.eq(8));
      // cells.eq(9)  = blue losses (tidak disimpan)
      // cells.eq(10) = blue WR    (tidak disimpan)

      // ── Red Side ──────────────────────────────────────────────────────────
      const redSidePicks = this.parseNum(cells.eq(11));
      const redSideWins = this.parseNum(cells.eq(12));
      // cells.eq(13) = red losses (tidak disimpan)
      // cells.eq(14) = red WR    (tidak disimpan)

      // ── Bans ──────────────────────────────────────────────────────────────
      const bans = this.parseNum(cells.eq(15));
      const banRate = this.parseNum(cells.eq(16)); // "%T" → 28.47

      // ── Picks & Bans ──────────────────────────────────────────────────────
      const picksAndBans = this.parseNum(cells.eq(17));
      const presenceRate = this.parseNum(cells.eq(18)); // "%T" → 81.02

      results.push({
        heroName,
        heroSlug: this.toSlug(heroName),
        heroImageUrl,
        picks,
        wins,
        losses,
        winRate,
        pickRate,
        blueSidePicks,
        blueSideWins,
        redSidePicks,
        redSideWins,
        bans,
        banRate,
        picksAndBans,
        presenceRate,
      });
    });

    this.logger.log(`Parsed ${results.length} heroes`);
    return results;
  }

  // ── Public: scrape hero stats dari URL ───────────────────────────────────

  async scrapeHeroStats(url: string): Promise<ScrapedHeroStat[]> {
    this.logger.log(`Scraping: ${url}`);
    const html = await this.fetchHtml(url);
    return this.parseHeroTable(html);
  }

  // ── Public: detect stages dari tournament ────────────────────────────────

  async scrapeStages(liquipediaSlug: string): Promise<ScrapedStage[]> {
    const baseUrl = `${this.BASE}/mobilelegends/${liquipediaSlug}/Statistics`;
    this.logger.log(`Detecting stages: ${baseUrl}`);

    const html = await this.fetchHtml(baseUrl);
    const $ = cheerio.load(html);
    const stages: ScrapedStage[] = [];
    let order = 0;

    // Overall selalu ada sebagai halaman utama statistics
    stages.push({
      name: 'Overall',
      slug: 'overall',
      liquipediaUrl: baseUrl,
      order: order++,
    });

    // Cari link stage lain — pattern URL: /Statistics/StageName
    // Filter ketat: harus path yang diawali slug tournament
    const stagePattern = new RegExp(`/${liquipediaSlug}/Statistics/`, 'i');
    const seen = new Set<string>(['overall']);

    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') || '';
      const text = $(el).text().trim();

      if (!text || !stagePattern.test(href)) return;
      const slug = this.toSlug(text);
      if (seen.has(slug)) return;

      seen.add(slug);
      const fullUrl = href.startsWith('http') ? href : `${this.BASE}${href}`;
      stages.push({ name: text, slug, liquipediaUrl: fullUrl, order: order++ });
    });

    this.logger.log(
      `Found ${stages.length} stage(s): ${stages.map((s) => s.name).join(', ')}`,
    );
    return stages;
  }
}
