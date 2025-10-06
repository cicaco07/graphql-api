import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ObjectType, Field, ID } from '@nestjs/graphql';

export type BlacklistedTokenDocument = BlacklistedToken & Document;

@Schema({ timestamps: true })
@ObjectType()
export class BlacklistedToken {
  @Field(() => ID)
  _id: string;

  @Prop({ required: true })
  @Field()
  token: string;

  @Prop({ required: true })
  @Field()
  userId: string;

  @Prop({ required: true })
  @Field()
  expiresAt: Date;

  @Prop({ default: false })
  @Field({ defaultValue: false })
  isAllTokens: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

export const BlacklistedTokenSchema =
  SchemaFactory.createForClass(BlacklistedToken);

BlacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
