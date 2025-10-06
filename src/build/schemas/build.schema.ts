import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { BattleSpell } from 'src/battle-spell/schemas/battle-spell.schema';
import { Emblem } from 'src/emblem/schemas/emblem.schema';
import { Hero } from 'src/hero/schemas/hero.schema';
import { Item } from 'src/item/schemas/item.schema';
// import { BuildRating } from '../entities/build.entity';

@Schema({ timestamps: true })
export class Build {
  @Prop({ required: true, trim: true, maxlength: 100 })
  name: string;

  @Prop({
    required: true,
    enum: ['Exp Lane', 'Gold Lane', 'Roam', 'Mid Lane', 'Jungle'],
  })
  role: string;

  @Prop({ maxlength: 500 })
  description?: string;

  @Prop({ type: Types.ObjectId, ref: 'Hero', required: true })
  hero: Hero;

  @Prop([
    {
      item: {
        type: Types.ObjectId,
        ref: 'Item',
        required: true,
      },
      order: { type: Number, required: true, min: 1 },
    },
  ])
  items: Array<{
    item: Item;
    order: number;
  }>;

  @Prop({
    type: [Types.ObjectId],
    ref: 'Emblem',
    required: true,
  })
  emblems: Emblem[];

  @Prop({
    type: [Types.ObjectId],
    ref: 'BattleSpell',
    required: true,
    validate: {
      validator: function (v: any[]) {
        return v.length >= 1 && v.length <= 2;
      },
      message: 'Battle spells must be between 1 and 2',
    },
  })
  battle_spells: BattleSpell[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ default: false })
  is_official: boolean;

  // @Prop([
  //   {
  //     userId: { type: Types.ObjectId, ref: 'User' },
  //     rating: { type: Number, min: 1, max: 5 },
  //     createdAt: { type: Date, default: Date.now },
  //   },
  // ])
  // ratings: BuildRating[];

  // @Prop({ default: 0, min: 0, max: 5 })
  // rating: number;

  // @Prop({ default: 0 })
  // totalRatings: number;
}

export const BuildSchema = SchemaFactory.createForClass(Build);

// Indexes
// BuildSchema.index({ hero: 1, is_official: 1 });
// BuildSchema.index({ user: 1 });
// BuildSchema.index({ rating: -1 });
// BuildSchema.index({ role: 1 });

// Method untuk update rating
// BuildSchema.methods.updateRating = function (this: Build) {
//   if (this.ratings && this.ratings.length > 0) {
//     const sum = this.ratings.reduce(
//       (acc: number, rating: BuildRating) => acc + rating.rating,
//       0,
//     );
//     this.rating = sum / this.ratings.length;
//     this.totalRatings = this.ratings.length;
//   } else {
//     this.rating = 0;
//     this.totalRatings = 0;
//   }
// };
