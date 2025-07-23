import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Item extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  item_type: string;

  @Prop({ type: [String], required: true })
  attributes: string[];

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  image: string;

  @Prop({ required: false })
  story: string;

  @Prop({ required: true })
  isChildren: boolean;

  @Prop({ required: false })
  parent_item: string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
