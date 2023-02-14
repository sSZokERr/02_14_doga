import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Render } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppService } from './app.service';
import ChocoDto from './choco.dto';
import Chocolate from './Chocolate.entity';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private dataSource: DataSource,
  ) {}

  @Get()
  @Render('index')
  index() {
    return { message: 'Welcome to the homepage' };
  }

  @Get('/csoki')
  async allCsoki() {
    const chocoRepo = this.dataSource.getRepository(Chocolate);
    return await chocoRepo.find();
  }

@Post('/csoki')
async newChoco(@Body() chocoDto: ChocoDto) {
  if(!chocoDto.name || !chocoDto.type ||!chocoDto.weight){
    throw new BadRequestException('Minden mezőt kötelező kitölteni');
  }
  if( typeof chocoDto.weight == 'string'){
    throw new BadRequestException('A suly csak egész szám lehet.');
  }
  
    const chocoRepo = this.dataSource.getRepository(Chocolate);
    const csoki = new Chocolate();
    csoki.name = chocoDto.name;
    csoki.weight = chocoDto.weight;
    csoki.type = chocoDto.type
    await chocoRepo.save(csoki);

}

  @Delete('/csoki/:id')
  deleteChoco(@Param('id') id: number) {
  const chocoRepo = this.dataSource.getRepository(Chocolate);
  chocoRepo.delete(id)
  }
}