import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, UploadedFiles, Req, UseGuards } from '@nestjs/common';
import { CreatorProfileService } from './creator_profile.service';
import { CreateCreatorProfileDto } from './dto/create-creator_profile.dto';
import { UpdateCreatorProfileDto } from './dto/update-creator_profile.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { RBACGuard } from 'src/common/middlewares/creator.middleware';
import { userRole } from 'src/types/types.common';
import { Roles } from 'src/common/Roles';
import { RedisService } from 'src/redis/redis.service';

@Controller('creator-profile')
@UseGuards(RBACGuard)
@Roles(userRole.CREATOR, userRole.COLLABORATOR)
export class CreatorProfileController {
  constructor(private redisData: RedisService, private readonly creatorProfileService: CreatorProfileService) { }


  @Post("create")
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'profile_photo_url', maxCount: 1 },
    { name: 'cover_photo_url', maxCount: 1 }
  ]))
  create(@UploadedFiles() files: { profile_photo_url?: Express.Multer.File[], cover_photo_url?: Express.Multer.File[] }, @Body() createCreatorProfileDto: CreateCreatorProfileDto, @Req() req) {


    return this.creatorProfileService.create(createCreatorProfileDto, req, files);
  }

  @Get("findall")
  findAll() {
    return this.creatorProfileService.findAll();
  }
  @Get('redis-test')
  async redisTest() {
    return this.redisData.testRedis();
  }

  @Get('findone')
  findOne(@Req() req) {
    return this.creatorProfileService.findOne(req);
  }

  @Patch('update-profile')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'profile_photo_url', maxCount: 1 },
    { name: 'cover_photo_url', maxCount: 1 }
  ]))
  update(@Req() req, @UploadedFiles() files: { profile_photo_url?: Express.Multer.File[], cover_photo_url?: Express.Multer.File[] }, @Param('id') id: string, @Body() updateCreatorProfileDto) {
    return this.creatorProfileService.updateprofile(req, updateCreatorProfileDto, files);
  }
  @Patch("update-location")
  updateLocation(@Req() req, @Body() location: any) {
    return this.creatorProfileService.updateLocation(req.user.id, location);
  }
  @Patch("update-status")
  updateStatus(@Req() req, @Body() collaboration: any) {
    return this.creatorProfileService.UpdateCollaboration(req.user.id, collaboration);
  }

  @Patch("update-pricing")
  updatePricing(@Req() req, @Body() pricing: any) {
    return this.creatorProfileService.UpdatePricing(req.user.id, pricing);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.creatorProfileService.remove(id);
  }


  // creator_category
  @Post("create/category/:id")
  createCatgeory(@Param("id") id: string, @Req() req) {

    return this.creatorProfileService.Createcategory(id, req.user.id)

  }

  @Delete("delete/category/:id")
  Delete(@Param("id") id: string) {
    return this.creatorProfileService.Deletecategory(id)
  }

  // creator_language
  @Post("create/language/:id")
  createLanguage(@Param("id") id: string, @Req() req) {
    return this.creatorProfileService.Createlanguage(id, req.user.id)

  }

  @Delete("delete/language/:id")
  DeleteLanguage(@Param("id") id: string) {
    return this.creatorProfileService.Deletelanguage(id)
  }

}
