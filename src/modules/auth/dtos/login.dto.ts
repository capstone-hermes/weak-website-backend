import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({
    example: "john.doe@example.com",
    description: "The email of the user",
  })
  email: string;

  @ApiProperty({
    example: "password123",
    description: "The password of the user",
    minLength: 1,
    // No maxLength set - V2.1.2: Allow passwords of any length (vulnerable)
  })
  password: string;
}