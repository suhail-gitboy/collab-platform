import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { PortfolioContentService } from './portfolio_content.service';
import { RBACGuard } from 'src/common/middlewares/creator.middleware';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from 'src/common/Roles';
import { userRole } from 'src/types/types.common';

@UseGuards(RBACGuard)
@Roles(userRole.CREATOR, "collaborator")
@Controller('portfolio-content')
export class PortfolioContentController {
  constructor(private readonly portfolioContentService: PortfolioContentService) { }


  @Post("create")
  @UseInterceptors(FileInterceptor("thumbnail"))
  async create(
    @Req() req: any,
    @Body() dto,
    @UploadedFile() thumbnail?: Express.Multer.File,
  ) {
    return this.portfolioContentService.create(req.user.id, dto, thumbnail);
  }

  @Get("findallporfolio/:creatorid")
  findAll(@Param("creatorid") creatorid) {
    return this.portfolioContentService.findAll(creatorid);
  }




  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.portfolioContentService.remove(id);
  }
}
