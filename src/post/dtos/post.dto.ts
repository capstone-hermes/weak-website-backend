import { ApiProperty } from '@nestjs/swagger';

export class PostDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier for the post',
  })
  id: number;

  @ApiProperty({
    example: 'This is my first post!',
    description: 'The content of the post',
  })
  content: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00.000Z',
    description: 'The date and time when the post was created',
  })
  createdAt: Date;

  @ApiProperty({
    example: 1,
    description: 'The ID of the user who created the post',
  })
  userId: number;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email of the user who created the post',
  })
  userEmail: string;
}