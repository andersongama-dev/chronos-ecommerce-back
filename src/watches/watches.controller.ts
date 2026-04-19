import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WatchesService } from './watches.service';
import { CreateWatchDto } from './dto/create-watch.dto';
import { UpdateWatchDto } from './dto/update-watch.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('watches')
export class WatchesController {
  constructor(private readonly watchesService: WatchesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createWatchDto: CreateWatchDto) {
    return this.watchesService.create(createWatchDto);
  }

  @Get()
  findAll() {
    return this.watchesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.watchesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWatchDto: UpdateWatchDto) {
    return this.watchesService.update(+id, updateWatchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.watchesService.remove(+id);
  }
}
