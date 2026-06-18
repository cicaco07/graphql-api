import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class AuditLog extends Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null })
  user: mongoose.Types.ObjectId | null;

  @Prop({ required: true })
  action: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  inputData: Record<string, unknown>;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  resultData: Record<string, unknown>;

  @Prop({ required: true })
  ipAddress: string;

  @Prop({ default: true })
  success: boolean;

  @Prop({ type: String, default: null })
  errorMessage: string | null;

  createdAt: Date;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

// TTL index: auto-delete logs after 90 days
AuditLogSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 90 * 24 * 60 * 60 },
);

// Compound indexes for common queries
AuditLogSchema.index({ user: 1, createdAt: -1 });
AuditLogSchema.index({ action: 1, createdAt: -1 });
