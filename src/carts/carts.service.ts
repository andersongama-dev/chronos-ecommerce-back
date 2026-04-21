import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class CartsService {
  constructor(private prisma: PrismaService) {}

  async getOrCreateCart(userId: number) {
    let cart = await this.prisma.cart.findFirst({
      where: { userId },
      include: {
        items: {
          include: {
            watch: true,
          },
        },
      },
    });

    if (!cart) {
      cart = await this.prisma.cart.create({
        data: {
          userId,
        },
        include: {
          items: {
            include: {
              watch: true,
            },
          },
        },
      });
    }

    return cart;
  }

  async findUserCart(userId: number) {
    return this.getOrCreateCart(userId);
  }

  async addItem(userId: number, watchId: number, quantity = 1) {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }

    const cart = await this.getOrCreateCart(userId);

    const watch = await this.prisma.watch.findUnique({
      where: { id: watchId },
    });

    if (!watch) {
      throw new NotFoundException('Watch not found');
    }

    const existingItem = await this.prisma.cartItem.findUnique({
      where: {
        cartId_watchId: {
          cartId: cart.id,
          watchId,
        },
      },
    });

    if (existingItem) {
      await this.prisma.cartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: existingItem.quantity + quantity,
        },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          watchId,
          quantity,
          priceAtAddition: watch.price,
        },
      });
    }

    return this.findUserCart(userId);
  }

  async updateItemQuantity(
    userId: number,
    itemId: number,
    quantity: number,
  ) {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }

    const cart = await this.getOrCreateCart(userId);

    const item = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });

    return this.findUserCart(userId);
  }

  async removeItem(userId: number, itemId: number) {
    const cart = await this.getOrCreateCart(userId);

    const item = await this.prisma.cartItem.findFirst({
      where: {
        id: itemId,
        cartId: cart.id,
      },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    await this.prisma.cartItem.delete({
      where: { id: itemId },
    });

    return this.findUserCart(userId);
  }

  async clearCart(userId: number) {
    const cart = await this.getOrCreateCart(userId);

    await this.prisma.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    return this.findUserCart(userId);
  }
}