import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUSer } from 'src/auth/current-user.decorator';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Get the currently authenticated user's data.
   * 
   * @param user Injected user from JWT (via CurrentUser decorator)
   * @returns User public data (name, email)
   */
  @Get()
  getProfile(@CurrentUSer() user: CurrentUserDto) {
    return this.usersService.getProfile(user.userId);
  }

  /**
   * Update the currently authenticated user's data.
   * 
   * @param user Injected user from JWT
   * @param updateUserDto Payload containing fields to update
   * @returns Updated user data
   */
  @Patch()
  update(
    @CurrentUSer() user: CurrentUserDto,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(user.userId, updateUserDto);
  }

  /**
   * Delete the currently authenticated user.
   * 
   * @param user Injected user from JWT
   * @returns void
   */
  @Delete()
  remove(@CurrentUSer() user: CurrentUserDto) {
    return this.usersService.remove(user.userId);
  }
}