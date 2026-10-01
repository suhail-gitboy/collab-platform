import { Controller, Get, Post, Body, Req, Patch, Param, Delete, BadRequestException } from '@nestjs/common';
import { SavedService } from './saved.service';

@Controller('save')
export class SavedController {
  constructor(private readonly savedService: SavedService) { }

  @Post("new/:savedprofileid")
  create(@Param("savedprofileid") savedid: string, @Body() createSavedDto, @Req() req: Request) {
    return this.savedService.create(savedid, createSavedDto, req);
  }

  @Get("getall/savedbybusiness")
  findAllsavedbusiness(@Req() req: Request) {
    return this.savedService.findAll(req, "business");
  }

  @Get("getall/savedbycreator")
  findAllsavedcreator(@Req() re1) {
    return this.savedService.findAll(re1, "creator");
  }




  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.savedService.remove(id);
  }
}
