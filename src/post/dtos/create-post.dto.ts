import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    example: 'This is my first post!',
    description: 'The content of the post',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(280)
  content: string;
}