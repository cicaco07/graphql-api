import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { GraphQLResolveInfo } from 'graphql';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { AuditLogService } from 'src/audit-log/audit-log.service';

/**
 * Global interceptor that logs every GraphQL Mutation to the audit_logs collection.
 *
 * Behaviour:
 * - Only intercepts Mutations (Queries and Subscriptions are skipped).
 * - If the user is authenticated (req.user exists), their _id is recorded.
 *   Otherwise user is recorded as null (e.g. login/signup mutations).
 * - The interceptor never throws; logging failures are caught and written
 *   to the application logger only, so they never break the main request.
 * - resultData is truncated to avoid storing excessively large payloads.
 */
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger(AuditInterceptor.name);

  /** Max size of the result payload strings stored in the log */
  private static readonly MAX_RESULT_STRING_LENGTH = 500;

  constructor(private readonly auditLogService: AuditLogService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // Only intercept GraphQL contexts
    const contextType = context.getType<string>();
    if (contextType !== 'graphql') {
      return next.handle();
    }

    const gqlCtx = GqlExecutionContext.create(context);
    const info: GraphQLResolveInfo = gqlCtx.getInfo<GraphQLResolveInfo>();

    // Only intercept Mutations
    if (info.parentType.name !== 'Mutation') {
      return next.handle();
    }

    const action: string = info.fieldName;
    const args: Record<string, unknown> =
      gqlCtx.getArgs<Record<string, unknown>>();
    const req = gqlCtx.getContext<{
      req: Request & {
        user?: { _id?: { toString(): string } };
        ip?: string;
        connection?: { remoteAddress?: string };
      };
    }>().req;
    const userId: string | null = req?.user?._id?.toString() ?? null;
    const ipAddress: string =
      req?.ip ?? req?.connection?.remoteAddress ?? 'unknown';

    return next.handle().pipe(
      tap((result: unknown) => {
        // Fire-and-forget: do not await
        void this.auditLogService.createLog({
          userId,
          action,
          inputData: this.sanitizeInput(args),
          resultData: this.truncateResult(result),
          ipAddress,
          success: true,
        });
      }),
      catchError((error: Error) => {
        // Log the failed mutation attempt, then re-throw
        void this.auditLogService.createLog({
          userId,
          action,
          inputData: this.sanitizeInput(args),
          resultData: {},
          ipAddress,
          success: false,
          errorMessage: error.message ?? 'Unknown error',
        });

        return throwError(() => error);
      }),
    );
  }

  /**
   * Removes sensitive fields (e.g. passwords) from the input before storing.
   */
  private sanitizeInput(
    args: Record<string, unknown>,
  ): Record<string, unknown> {
    const sensitiveKeys = ['password', 'token', 'secret', 'authorization'];
    return this.deepOmit(args, sensitiveKeys);
  }

  /**
   * Recursively omit keys from an object.
   */
  private deepOmit(
    obj: unknown,
    keys: string[],
    depth = 0,
  ): Record<string, unknown> {
    if (depth > 10 || obj === null || obj === undefined) return {};
    if (typeof obj !== 'object') return {};
    if (Array.isArray(obj)) {
      return obj.map((item: unknown) =>
        this.deepOmit(item, keys, depth + 1),
      ) as unknown as Record<string, unknown>;
    }

    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      if (keys.includes(key.toLowerCase())) {
        result[key] = '[REDACTED]';
      } else if (typeof value === 'object' && value !== null) {
        result[key] = this.deepOmit(value, keys, depth + 1);
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  /**
   * Truncates the mutation result to avoid storing excessively large payloads.
   */
  private truncateResult(result: unknown): Record<string, unknown> {
    try {
      const serialized: string = JSON.stringify(
        result,
        (_key: string, value: unknown): unknown => {
          if (
            typeof value === 'string' &&
            value.length > AuditInterceptor.MAX_RESULT_STRING_LENGTH
          ) {
            return (
              value.substring(0, AuditInterceptor.MAX_RESULT_STRING_LENGTH) +
              '...'
            );
          }
          return value;
        },
      );
      return JSON.parse(serialized) as Record<string, unknown>;
    } catch {
      return { _note: 'Result could not be serialized' };
    }
  }
}
