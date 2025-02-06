import { ApiProperty } from '@nestjs/swagger';
import e from 'express';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({
    example: 1,
    description: 'The unique identifier for the user',
  })
  id: number;

  @Column()
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user',
  })
  email: string;

  @Column()
  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
  })
  password: string;

  @Column()
  @ApiProperty({
    example: 'user',
    description: 'The role of the user',
  })
  role: string;
}
