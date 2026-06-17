import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery } from 'mongoose';
import { AuditLog } from './schemas/audit-log.schema';
import { AuditLogFilterInput } from './dto/audit-log-filter.input';

@Injectable()
export class AuditLogService {
  private readonly logger = new Logger(AuditLogService.name);

  constructor(
    @InjectModel(AuditLog.name) private auditLogModel: Model<AuditLog>,
  ) {}

  /**
   * Creates a new audit log entry. Called by the AuditInterceptor.
   * Fire-and-forget: errors are caught and logged, never thrown.
   */
  async createLog(data: {
    userId: string | null;
    action: string;
    inputData: Record<string, unknown>;
    resultData: Record<string, unknown>;
    ipAddress: string;
    success: boolean;
    errorMessage?: string;
  }): Promise<void> {
    try {
      await this.auditLogModel.create({
        user: data.userId,
        action: data.action,
        inputData: data.inputData,
        resultData: data.resultData,
        ipAddress: data.ipAddress,
        success: data.success,
        errorMessage: data.errorMessage ?? null,
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const stack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Failed to create audit log for action "${data.action}": ${message}`,
        stack,
      );
    }
  }

  /**
   * Queries audit logs with filtering and pagination.
   */
  async findAll(
    filter: AuditLogFilterInput,
  ): Promise<{ items: AuditLog[]; totalCount: number; hasNextPage: boolean }> {
    const {
      userId,
      action,
      startDate,
      endDate,
      success,
      page = 1,
      limit = 20,
    } = filter;

    const query: FilterQuery<AuditLog> = {};

    if (userId) {
      query.user = userId;
    }

    if (action) {
      query.action = { $regex: new RegExp(action, 'i') };
    }

    if (success !== undefined && success !== null) {
      query.success = success;
    }

    if (startDate || endDate) {
      const dateFilter: { $gte?: Date; $lte?: Date } = {};
      if (startDate) {
        dateFilter.$gte = new Date(startDate);
      }
      if (endDate) {
        dateFilter.$lte = new Date(endDate);
      }
      query.createdAt = dateFilter;
    }

    const skip = (page - 1) * limit;

    const [items, totalCount] = await Promise.all([
      this.auditLogModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.auditLogModel.countDocuments(query).exec(),
    ]);

    return {
      items,
      totalCount,
      hasNextPage: skip + items.length < totalCount,
    };
  }
}
