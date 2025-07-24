import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Item extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  tag: string;

  @Prop({ required: true })
  type: string;

  @Prop({ type: [String], required: true })
  attributes: string[];

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  image: string;

  @Prop({ required: false })
  story: string;

  @Prop({ type: [String], required: false })
  description: string[];

  @Prop({ required: false })
  tips: string;

  @Prop({ required: false })
  parent_items: string[];
}

export const ItemSchema = SchemaFactory.createForClass(Item);
