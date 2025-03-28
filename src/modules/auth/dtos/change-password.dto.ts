import { ApiProperty } from "@nestjs/swagger";

export class ChangePasswordDto {
  @ApiProperty({
    example: "oldpassword123",
    description: "The current password of the user",
  })
  currentPassword: string;

  @ApiProperty({
    example: "newpassword123",
    description: "The new password of the user",
    minLength: 1,
    maxLength: 128, // V2.1.2: Allow passwords up to 128 characters
  })
  newPassword: string;
}