import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, isNotEmpty, IsStrongPassword } from 'class-validator';
@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  username: string;

  @Field()
  @IsStrongPassword()
  password: string;
}
