import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { AuditLog, PaginatedAuditLogs } from './entities/audit-log.entity';
import { AuditLogFilterInput } from './dto/audit-log-filter.input';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';

@Resolver(() => AuditLog)
export class AuditLogResolver {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Query(() => PaginatedAuditLogs, {
    name: 'auditLogs',
    description: 'Retrieve paginated audit logs. Requires SUPER_ADMIN role.',
  })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  async findAll(
    @Args('filter', { nullable: true, defaultValue: {} })
    filter: AuditLogFilterInput,
  ) {
    return this.auditLogService.findAll(filter);
  }
}
