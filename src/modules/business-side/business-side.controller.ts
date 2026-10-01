import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UploadedFiles, Req, UseInterceptors } from '@nestjs/common';
import { BusinessSideService } from './business-side.service';
import { Roles } from 'src/common/Roles';
import { RBACGuard } from 'src/common/middlewares/creator.middleware';
import { userRole } from 'src/types/types.common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';


@Controller('business-side')
@UseGuards(RBACGuard)
@Roles(userRole.BUSINESS)
export class BusinessSideController {
  constructor(private readonly businessSideService: BusinessSideService) { }

  @Post("create")
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'logo_url', maxCount: 1 },
    { name: 'cover_photo_url', maxCount: 1 }
  ]))
  create(
    @UploadedFiles() files: { logo_url?: Express.Multer.File[], cover_photo_url?: Express.Multer.File[] },
    @Body() createBusinessProfileDto,
    @Req() req,
  ) {
    console.log(files.cover_photo_url);

    return this.businessSideService.create(createBusinessProfileDto, req, files);
  }
  @Get()
  findAll() {
    return this.businessSideService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.businessSideService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBusinessSideDto) {
    return this.businessSideService.update(+id, updateBusinessSideDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.businessSideService.remove(+id);
  }
}
