import { Prop, Schema } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type SystemPatchNoteDocument = SystemPatchNote & Document;

@Schema({ timestamps: true })
export class SystemPatchNote {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: MongooseSchema.Types.Mixed, required: false })
  change_details: Record<string, any>;
}
