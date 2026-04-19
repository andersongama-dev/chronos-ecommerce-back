import { IsEmail, IsOptional, IsString } from 'class-validator';

/**
 * DTO for updating basic user information.
 * Only allows safe, non-sensitive fields.
 */
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}