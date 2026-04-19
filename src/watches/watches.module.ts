import { Module } from '@nestjs/common';
import { WatchesService } from './watches.service';
import { WatchesController } from './watches.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [WatchesController],
  providers: [WatchesService, PrismaService],
})
export class WatchesModule {}
