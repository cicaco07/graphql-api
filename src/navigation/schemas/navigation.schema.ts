import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NavigationDocument = Navigation & Document;

@Schema({ timestamps: true })
export class Navigation {
  @Prop({ type: Types.ObjectId, ref: 'Navigation', default: null })
  parent_id?: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  icon?: string;

  @Prop()
  route?: string;

  @Prop({ required: true })
  order: number;

  @Prop({ default: false })
  is_header: boolean;

  @Prop({ default: true })
  is_active: boolean;

  @Prop({ type: [String], default: [] })
  roles: string[];

  @Prop({ type: [String], default: [] })
  permission: string[];

  @Prop()
  description?: string;

  @Prop({ default: 0 })
  level: number;

  @Prop()
  component?: string;

  @Prop({ default: true })
  is_visible: boolean;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const NavigationSchema = SchemaFactory.createForClass(Navigation);
