import {
  Injectable,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateWatchDto } from './dto/create-watch.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from 'src/generated/prisma/client';
import { UpdateWatchDto } from './dto/update-watch.dto';

@Injectable()
export class WatchesService {
  constructor(private readonly prisma: PrismaService) { }

  async create(createWatchDto: CreateWatchDto) {
    const {
      name,
      brand,
      price,
      gender,
      style,
      caseMaterial,
      strapMaterial,
      strapColor,
      imageUrl,
      slug,
    } = createWatchDto;

    if (
      !name ||
      !brand ||
      price === undefined ||
      !gender ||
      !style ||
      !caseMaterial ||
      !strapMaterial ||
      !strapColor ||
      !imageUrl ||
      !slug
    ) {
      throw new BadRequestException('All fields are required');
    }

    try {
      return await this.prisma.watch.create({
        data: {
          name,
          brand,
          price: new Prisma.Decimal(price),
          gender,
          style,
          caseMaterial,
          strapMaterial,
          strapColor,
          imageUrl,
          slug,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Slug already exists');
      }

      throw new BadRequestException('Invalid request data');
    }
  }

  async findAll() {
    return this.prisma.watch.findMany();
  }

  async findOne(id: number) {
    return this.prisma.watch.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateWatchDto: UpdateWatchDto) {
    try {
      return await this.prisma.watch.update({
        where: { id },
        data: {
          ...updateWatchDto,
          price: updateWatchDto.price
            ? new Prisma.Decimal(updateWatchDto.price)
            : undefined,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new Error('Watch not found');
      }

      throw error;
    }
  }

  async remove(id: number) {
    return this.prisma.watch.delete({
      where: { id },
    });
  }
}

function removeUndefined<T extends object>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined),
  ) as Partial<T>;
}