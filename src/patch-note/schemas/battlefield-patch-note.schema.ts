import { Prop, Schema } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type BattlefieldPatchNoteDocument = BattlefieldPatchNote & Document;

@Schema({ timestamps: true })
export class BattlefieldPatchNote {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: MongooseSchema.Types.Mixed, required: false })
  change_details: Record<string, any>;
}
