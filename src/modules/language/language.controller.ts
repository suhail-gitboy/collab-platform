import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LanguageService } from './language.service';


@Controller('language')
export class LanguageController {
  constructor(private readonly languageService: LanguageService) { }

  @Post("create")
  create(@Body() createLanguageDto) {
    return this.languageService.create(createLanguageDto);
  }

  @Get("get")
  findAll() {
    return this.languageService.findAll();
  }



  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateLanguageDto) {
    return this.languageService.update(id, updateLanguageDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.languageService.remove(id);
  }
}
