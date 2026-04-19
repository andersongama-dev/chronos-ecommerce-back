import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * DTO for user registration.
 * 
 * Used to validate incoming data when creating a new user.
 */
export class CreateUserDto {
  /**
   * User's full name
   */
  @IsString()
  name: string;

  /**
   * User's email (must be unique)
   */
  @IsEmail()
  email: string;

  /**
   * User's password (min length recommended)
   */
  @IsString()
  @MinLength(6)
  password: string;

  /**
   * Password confirmation (must match password)
   * Note: equality check is handled in the service
   */
  @IsString()
  confirmPassword: string;
}