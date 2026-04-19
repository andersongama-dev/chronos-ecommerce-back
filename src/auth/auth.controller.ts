import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-auth.dto';
import { SignInDto } from './dto/sing-in-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register a new user.
   * 
   * @param dto Registration payload
   * @returns JWT access token
   */
  @Post()
  async create(@Body() dto: CreateUserDto) {
    return this.authService.create(dto);
  }

  /**
   * Authenticate a user.
   * 
   * @param dto Login credentials
   * @returns JWT access token
   */
  @Post('sign-in')
  async signIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }
}