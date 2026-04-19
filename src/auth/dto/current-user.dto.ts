import { IsEmail, IsInt } from 'class-validator';

/**
 * Authenticated user payload structure.
 */
export class CurrentUserDto {
  @IsInt()
  userId: number;

  @IsEmail()
  email: string;
}