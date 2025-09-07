import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type HeroPatchNoteDocument = HeroPatchNote & Document;

@Schema()
export class HeroChangeDetail {
  @Prop({ required: true })
  name: string;

  @Prop({
    required: true,
    enum: ['new', 'buff', 'nerf', 'adjusted', 'rework', 'removed'],
  })
  change_type: string;

  @Prop({ required: false })
  description?: string;
}

@Schema()
export class HeroChange {
  @Prop({ required: true })
  name: string;

  @Prop({ required: false })
  alias?: string;

  @Prop({
    required: true,
    enum: ['new', 'buff', 'nerf', 'adjusted', 'rework', 'removed'],
  })
  change_type: string;

  @Prop({ required: false })
  description?: string;

  @Prop({ type: [HeroChangeDetail], required: false })
  change_details?: HeroChangeDetail[];
}

@Schema({ timestamps: true })
export class HeroPatchNote {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ type: [HeroChange], required: false })
  hero_changes: HeroChange[];
}

export const HeroPatchNoteSchema = SchemaFactory.createForClass(HeroPatchNote);
export const HeroChangeSchema = SchemaFactory.createForClass(HeroChange);
export const HeroChangeDetailSchema =
  SchemaFactory.createForClass(HeroChangeDetail);
