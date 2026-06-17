import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuditLogService } from './audit-log.service';
import { AuditLogResolver } from './audit-log.resolver';
import { AuditLog, AuditLogSchema } from './schemas/audit-log.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: AuditLog.name, schema: AuditLogSchema },
    ]),
  ],
  providers: [AuditLogResolver, AuditLogService],
  exports: [AuditLogService],
})
export class AuditLogModule {}
