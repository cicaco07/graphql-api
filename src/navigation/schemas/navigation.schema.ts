import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Navigation extends Document {
  @Prop({ required: false })
  parent_id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  icon: string;

  @Prop({ required: false })
  link: string;

  @Prop({ required: true })
  order: number;

  @Prop({ required: true })
  is_header: boolean;

  @Prop({ required: true })
  is_active: boolean;
}

export const NavigationSchema = SchemaFactory.createForClass(Navigation);
