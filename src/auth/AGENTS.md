# AUTH MODULE

JWT authentication, role-based authorization, and token blacklisting (logout). Imported by feature modules that guard resolvers.

## STRUCTURE
```
auth/
├── auth.resolver.ts     # login/signup/logout mutations
├── auth.service.ts      # credential check, bcrypt, token issue
├── jwt.strategy.ts      # passport-jwt validation strategy
├── services/token.service.ts   # blacklist add/check for logout
├── guards/              # jwt-auth, roles, logout guards
├── decorators/          # @Roles(...), @CurrentUser()
├── enums/role.enum.ts   # Role.MEMBER, Role.SUPER_ADMIN
├── entities/            # user.entity, blacklisted-token.entity (GraphQL + @Schema combined here)
└── dto/                 # auth.input, auth.response
```

## WHERE TO LOOK
| Task | Location |
|------|----------|
| Guard a resolver method | `@UseGuards(JwtAuthGuard, RolesGuard)` + `@Roles(Role.X)` |
| Get current user in resolver | `@CurrentUser()` decorator |
| Add a role | `enums/role.enum.ts` |
| Change token expiry/secret | env `JWT_SECRET`, `JWT_EXPIRES_IN` (wired in `auth.module.ts`) |
| Logout / token invalidation | `guards/logout.guard.ts` + `services/token.service.ts` |

## CONVENTIONS (differs from root)
- `entities/user.entity.ts` and `blacklisted-token.entity.ts` define BOTH the GraphQL type AND the Mongoose schema in one file (each exports `XxxSchema`), unlike the two-file split used by other features.
- AuthModule `exports` the guards, strategy, and `TokenService` so other modules can import and reuse them.
- Guard order matters: `JwtAuthGuard` (authenticate) MUST precede `RolesGuard` (authorize).

## ANTI-PATTERNS
- Do NOT bypass `RolesGuard` by checking roles inside resolvers manually.
- Do NOT read JWT secret from `process.env` directly - go through `ConfigService` like `auth.module.ts`.
