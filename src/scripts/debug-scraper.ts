import axios from 'axios';
import * as cheerio from 'cheerio';

const URL  = 'https://liquipedia.net/mobilelegends/M7_World_Championship/Statistics';
const BASE = 'https://liquipedia.net';

async function debug() {
  console.log('⏳ Fetching:', URL);

  const res = await axios.get(URL, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; MLBBBot/1.0)',
      'Accept-Language': 'en-US,en;q=0.9',
    },
    timeout: 15000,
  });

  const $ = cheerio.load(res.data);

  // ── 1. Cek semua table yang ada di halaman ──────────────────────────────
  console.log('\n📋 Tables found on page:');
  $('table').each((i, el) => {
    const cls    = $(el).attr('class') || '(no class)';
    const rows   = $(el).find('tr').length;
    const sample = $(el).find('tr').eq(1).text().substring(0, 80).replace(/\s+/g, ' ').trim();
    console.log(`  [${i}] class="${cls}" | rows=${rows} | sample: "${sample}"`);
  });

  // ── 2. Cek tab/stage links ───────────────────────────────────────────────
  console.log('\n🗂  Stage links found:');
  $('a[href*="Statistics"]').each((_, el) => {
    const text = $(el).text().trim();
    const href = $(el).attr('href') || '';
    if (text) console.log(`  "${text}" → ${href}`);
  });

  // ── 3. Parse hero stats table ────────────────────────────────────────────
  console.log('\n🦸 Parsing hero stats...');

  // Liquipedia menggunakan <table> tanpa class khusus di dalam div#mw-content-text
  // Cari tabel pertama yang punya header "Hero"
  let targetTable: cheerio.Cheerio<any> | null = null;
  $('table').each((_, el) => {
    const headerText = $(el).find('th').map((_, th) => $(th).text().trim()).get().join('|');
    if (headerText.includes('Hero') && headerText.includes('Bans')) {
      targetTable = $(el);
      return false; // break
    }
  });

  if (!targetTable) {
    console.error('❌ Hero stats table NOT found!');
    console.log('\nAll <th> texts found:');
    $('th').each((i, el) => {
      const t = $(el).text().trim();
      if (t) console.log(`  [${i}] "${t}"`);
    });
    return;
  }

  console.log('✅ Target table found!\n');

  // ── 4. Parse header untuk detect kolom ──────────────────────────────────
  console.log('Header rows:');
  (targetTable as cheerio.Cheerio<any>).find('tr').slice(0, 3).each((ri, row) => {
    const cols = $(row).find('th, td').map((_, c) => $(c).text().trim().replace(/\s+/g, ' ')).get();
    console.log(`  Row[${ri}]:`, cols);
  });

  // ── 5. Parse data rows ───────────────────────────────────────────────────
  console.log('\nData rows (first 5):');
  const heroes: any[] = [];

  (targetTable as cheerio.Cheerio<any>).find('tbody tr').each((ri, row) => {
    const cells = $(row).find('td');
    if (cells.length < 10) return;

    // Kolom aktual dari Liquipedia M7 Statistics:
    // [0]  = nomor urut
    // [1]  = hero name + image
    // [2]  = picks ∑ (link angka)
    // [3]  = picks W
    // [4]  = picks L
    // [5]  = picks WR (50.00%)
    // [6]  = picks %T (66.67%)
    // [7]  = blue side ∑
    // [8]  = blue side W
    // [9]  = blue side L
    // [10] = blue side WR
    // [11] = red side ∑
    // [12] = red side W
    // [13] = red side L
    // [14] = red side WR
    // [15] = bans ∑ (link angka)
    // [16] = bans %T
    // [17] = P&B ∑
    // [18] = P&B %T
    // [19] = details (collapsible)

    const heroCell  = cells.eq(1);
    const heroName  = heroCell.find('a').last().text().trim();
    if (!heroName) return;

    const imgSrc = heroCell.find('img').attr('src') || '';
    const heroImageUrl = imgSrc
      ? (imgSrc.startsWith('http') ? imgSrc : `${BASE}${imgSrc}`)
      : '';

    const parseNum = (c: cheerio.Cheerio<any>) =>
      parseFloat((c.text().trim().replace(/[^0-9.]/g, '')) || '0') || 0;

    const hero = {
      heroName,
      heroImageUrl,
      picks:          parseNum(cells.eq(2)),
      wins:           parseNum(cells.eq(3)),
      losses:         parseNum(cells.eq(4)),
      winRate:        parseNum(cells.eq(5)),   // "50.00%" → 50
      pickRateRaw:    cells.eq(6).text().trim(), // "%T kolom"
      blueSidePicks:  parseNum(cells.eq(7)),
      blueSideWins:   parseNum(cells.eq(8)),
      redSidePicks:   parseNum(cells.eq(11)),
      redSideWins:    parseNum(cells.eq(12)),
      bans:           parseNum(cells.eq(15)),
      banRateRaw:     cells.eq(16).text().trim(),
      picksAndBans:   parseNum(cells.eq(17)),
      presenceRateRaw: cells.eq(18).text().trim(),
    };

    heroes.push(hero);
    if (ri < 5) console.log(`  [${ri}]`, JSON.stringify(hero, null, 2));
  });

  console.log(`\n✅ Total heroes parsed: ${heroes.length}`);
}

debug().catch(err => console.error('❌ Fatal error:', err.message));