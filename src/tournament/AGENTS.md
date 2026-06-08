# TOURNAMENT MODULE

Tournament data with a scrape → sync → persist pipeline. The only feature whose service layer lives under `services/` and the only one that splits GraphQL types (`types/`) from Mongoose schemas (`schemas/`) into separate folders.

## STRUCTURE
```
tournament/
├── tournament.resolver.ts
├── services/
│   ├── scraper.service.ts     # cheerio/axios HTML scraping of source site
│   ├── sync.service.ts        # orchestrates scrape→persist, writes SyncLog
│   └── tournament.service.ts  # CRUD + queries
├── schemas/                   # Mongoose: tournament, tournament-stage, hero-stats, sync-log
├── types/                     # GraphQL @ObjectType: tournament, sync-log, hero-stats
├── enum/                      # sync-status, tournament-status, tournament-tier
└── dto/                       # create / update / sync-tournament inputs
```

## WHERE TO LOOK
| Task | Location |
|------|----------|
| Change scraping selectors/source | `services/scraper.service.ts` |
| Adjust sync orchestration / logging | `services/sync.service.ts` (writes `SyncLog`) |
| Add a queryable field | add to BOTH `types/*.type.ts` (GraphQL) and `schemas/*.schema.ts` (persistence) |
| Tournament status/tier values | `enum/` |

## CONVENTIONS (differs from root)
- GraphQL types are named `*.type.ts` under `types/` (not `*.entity.ts` under `entities/`).
- Four Mongoose models registered in `tournament.module.ts`: Tournament, TournamentStage, HeroStats, SyncLog.
- `TournamentService` + `SyncService` are exported for reuse; `ScraperService` is internal.

## ANTI-PATTERNS
- Do NOT call `ScraperService` from outside this module - go through `SyncService`.
- Do NOT persist scraped data without recording a `SyncLog` entry (audit trail).
- External HTTP (axios) targets a third-party site - treat scraped HTML as untrusted; selectors break when the source changes.
