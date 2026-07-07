import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

// Legacy schema kept for backward compatibility. New patch data should use PatchChange.
@Schema({ timestamps: true })
export class BattlefieldPatchNote {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: MongooseSchema.Types.Mixed, required: false })
  change_details: Record<string, any>;
}

export const BattlefieldPatchNoteSchema =
  SchemaFactory.createForClass(BattlefieldPatchNote);
