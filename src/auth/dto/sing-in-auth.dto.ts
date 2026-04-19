import { IsEmail, IsString, MinLength } from 'class-validator';

/**
 * DTO for user authentication (login).
 */
export class SignInDto {
  /**
   * User email
   */
  @IsEmail()
  email: string;

  /**
   * User password
   */
  @IsString()
  @MinLength(6)
  password: string;
}