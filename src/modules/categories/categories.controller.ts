import { Controller, Get, Post, Req, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Put } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { FileInterceptor } from '@nestjs/platform-express';
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post("create")
  @UseInterceptors(FileInterceptor('icon'))
  create(@Body() createCategoryDto, @Req() req: Request, @UploadedFile() icon: Express.Multer.File) {

    return this.categoriesService.create(createCategoryDto, icon);
  }

  @Get("all")
  findAll() {
    return this.categoriesService.findAll();
  }
  @Patch("status/:id")
  ChangeStatus(@Param("id") id: string) {
    return this.categoriesService.ChangeStatus(id)

  }


  @Put('update/:id')
  @UseInterceptors(FileInterceptor("icon"))
  update(@Param('id') id: string, @Body() body, @UploadedFile() icon: Express.Multer.File) {
    console.log(body);

    return this.categoriesService.update(id, body, icon);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
