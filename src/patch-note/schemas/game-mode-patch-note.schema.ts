import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema()
export class GameModePatchNote {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: MongooseSchema.Types.Mixed, required: false })
  change_details: Record<string, any>;
}

export const GameModePatchNoteSchema =
  SchemaFactory.createForClass(GameModePatchNote);
