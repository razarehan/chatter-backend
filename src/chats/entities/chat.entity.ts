import { ObjectType, Field } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { AbstractEntity } from 'src/common/database/abstract.entity';

@ObjectType()
@Schema()
export class Chat extends AbstractEntity {
  @Field()
  @Prop()
  userId: string;

  @Field()
  @Prop()
  isPrivate: boolean;

  @Field(() => [String])
  @Prop({ type: [String] })
  userIds: string[];

  @Field({ nullable: true })
  @Prop({ required: false })
  name?: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);