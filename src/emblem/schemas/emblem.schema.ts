import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Emblem extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  icon: string;

  @Prop({ type: MongooseSchema.Types.Mixed, required: false })
  attributes: Record<string, any>;

  @Prop({ required: false })
  benefit?: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ required: false })
  cooldown?: string;
}

export const EmblemSchema = SchemaFactory.createForClass(Emblem);
