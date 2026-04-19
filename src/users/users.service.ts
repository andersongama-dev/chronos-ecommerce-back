import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';

type UserResponse = {
  name: string;
  email: string;
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) { }

  /**
   * Retrieve a user by ID.
   * @param id User ID
   * @returns Public user data
   * @throws NotFoundException if the user does not exist
   */
  async getProfile(id: number): Promise<UserResponse> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { name: true, email: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  /**
   * Update user data.
   * - Preserves existing values if not provided
   * - Ensures email uniqueness
   *
   * @param id User ID
   * @param dto Update payload
   * @returns Updated user data
   */
  async update(id: number, dto: UpdateUserDto): Promise<UserResponse> {
    const { name, email } = dto;

    // Check for email conflict
    if (email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });

      if (existingUser && existingUser.id !== id) {
        throw new BadRequestException('Email is already in use');
      }
    }

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(email && { email }),
        },
        select: { name: true, email: true },
      });

      return updatedUser;
    } catch (error) {
      // Prisma throws if the record does not exist
      throw new NotFoundException('User not found');
    }
  }

  /**
   * Delete a user by ID.
   * @param id User ID
   * @throws NotFoundException if the user does not exist
   */
  async remove(id: number): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }
}