import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUSer } from 'src/auth/current-user.decorator';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';

@Controller('carts')
@UseGuards(JwtAuthGuard)
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  getCart(@CurrentUSer() user: CurrentUserDto) {
    return this.cartsService.findUserCart(user.userId);
  }

  @Post('items')
  addItem(
    @CurrentUSer() user: CurrentUserDto,
    @Body() body: { watchId: number; quantity: number },
  ) {
    return this.cartsService.addItem(
      user.userId,
      body.watchId,
      body.quantity,
    );
  }

  @Patch('items/:id')
  updateItem(
    @CurrentUSer() user: CurrentUserDto,
    @Param('id') id: string,
    @Body() body: { quantity: number },
  ) {
    return this.cartsService.updateItemQuantity(
      user.userId,
      +id,
      body.quantity,
    );
  }

  @Delete('items/:id')
  removeItem(
    @CurrentUSer() user: CurrentUserDto,
    @Param('id') id: string,
  ) {
    return this.cartsService.removeItem(user.userId, +id);
  }

  @Delete()
  clearCart(@CurrentUSer() user: CurrentUserDto) {
    return this.cartsService.clearCart(user.userId);
  }
}