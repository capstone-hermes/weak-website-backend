import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({
    example: "john.doe",
    description: "The username of the user",
  })
  email: string;

  @ApiProperty({
    example: "password123",
    description: "The password of the user",
  })
  password: string;
}
