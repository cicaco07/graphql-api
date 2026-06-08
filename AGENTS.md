# PROJECT KNOWLEDGE BASE

**Generated:** 2026-06-08
**Commit:** 139cc11
**Branch:** master

## OVERVIEW
Code-first GraphQL API for Mobile Legends game data (heroes, skills, items, builds, tournaments). NestJS 11 + Apollo Server 4 + Mongoose 8 (MongoDB), TypeScript.

## STRUCTURE
```
src/
├── app.module.ts        # Root module: GraphQL + Mongoose + all feature modules wired here
├── main.ts              # Bootstrap: CORS + global ValidationPipe
├── schema.gql           # AUTO-GENERATED in dev (autoSchemaFile) - never hand-edit
├── auth/                # JWT auth, guards, role-based access (see auth/AGENTS.md)
├── tournament/          # Scraper + sync pipeline (see tournament/AGENTS.md)
├── hero/ skill/ item/ emblem/ build/ ...  # CRUD feature modules (uniform pattern)
├── base-stat/ skill-detail/ battle-spell/ patch-note/ navigation/
├── common/interfaces/   # Shared interfaces
├── database/seeders/    # Seeder service + per-domain seeders
└── scripts/seed.ts      # CLI seed entrypoint (npm run seed <cmd>)
```

## WHERE TO LOOK
| Task | Location |
|------|----------|
| Add a new entity/feature | `nest g resource <name>` then mirror an existing module (hero/) |
| Change GraphQL schema | Edit `*.entity.ts` (@ObjectType) - schema.gql regenerates on build |
| Protect a query/mutation | Add `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(...)` on resolver method |
| DB persistence shape | `<feature>/schemas/<feature>.schema.ts` (@Schema) |
| Seed data | `src/database/seeders/` + `src/scripts/seed.ts` |
| Tournament data scraping | `src/tournament/services/` |

## THE TWO-MODEL PATTERN (CRITICAL)
Every feature has TWO separate classes for the same concept - do not merge them:
- `entities/<x>.entity.ts` → GraphQL API type. Decorators: `@ObjectType()`, `@Field()`. Exposes `_id: string` as `@Field(() => ID)`. Relations are nullable.
- `schemas/<x>.schema.ts` → Mongoose persistence. Decorators: `@Schema()`, `@Prop()`. Extends `Document`. Relations use `ObjectId` + `ref`. Exports `SchemaFactory.createForClass(...)`.

A feature module = module + service + resolver + `entities/` + `schemas/` + `dto/` (`create-<x>.input.ts`, `update-<x>.input.ts`).

## CONVENTIONS
- Code-first GraphQL only (no .graphql SDL files written by hand).
- Imports of internal modules use absolute `src/...` paths (not relative `../../`).
- DTOs are GraphQL `@InputType()` validated by `class-validator`; global pipe has `whitelist: true` + `forbidNonWhitelisted: true` so unknown input fields are rejected.
- Resolver query names set explicitly via `{ name: 'heroes' }`; IDs typed with `{ type: () => ID }`.
- Roles: `Role.MEMBER`, `Role.SUPER_ADMIN` (see `auth/enums/role.enum.ts`).

## ANTI-PATTERNS (THIS PROJECT)
- Do NOT hand-edit `src/schema.gql` - it is regenerated from entities.
- Do NOT suppress type errors (`as any`, `@ts-ignore`); `eslint --fix` runs on lint.
- Do NOT put `@Field` decorators on schema classes or `@Prop` on entity classes - keep the two models separate.
- File upload (Multer/ServeStatic) is commented out in `app.module.ts`/`main.ts` - intentionally disabled, do not re-enable without reason.

## COMMANDS
```bash
npm run start:dev      # watch mode dev server (GraphQL playground at /graphql)
npm run build          # nest build
npm run lint           # eslint --fix
npm test               # jest unit (*.spec.ts colocated with source)
npm run test:e2e       # jest e2e (test/jest-e2e.json)
npm run seed <cmd>     # users | default | builds | clear | reset
```

## NOTES
- GraphQL playground + introspection enabled in all envs; CSRF prevention disabled only in production (`app.module.ts`).
- Mongo URI comes from `ConfigService` (.env). `ConfigModule` is global.
- JWT secret/expiry from env (`JWT_SECRET`, `JWT_EXPIRES_IN`, default 7d).
