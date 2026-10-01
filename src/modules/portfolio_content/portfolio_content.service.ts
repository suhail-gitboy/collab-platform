import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Injector } from '@nestjs/core/injector/injector';
import { InjectModel } from '@nestjs/sequelize';
import PortfolioContent from './model/model.portfolio';
import { HelpersService } from 'src/helpers/helpers.service';


@Injectable()
export class PortfolioContentService {

  constructor(private helpersService: HelpersService, @InjectModel(PortfolioContent) private Portfolio: typeof PortfolioContent) {

  }
  async create(
    creatorId: string,
    dto,
    thumbnail?: Express.Multer.File,
  ) {
    let thumbnail_url: string | null = null;
    let creator_ids = await this.helpersService.FindCreatorOrBusinessUserId(creatorId, "creator")
    if (!creator_ids) {
      throw new NotFoundException("notfound")
    }
    if (thumbnail) {
      thumbnail_url = await this.helpersService.CloudinarySetup(thumbnail, "portfolio-thumbnails");
    }

    try {
      const content = await this.Portfolio.create({
        creator_id: creator_ids,
        platform: dto.platform,
        url: dto.url,
        post_title: dto.post_title ?? null,
        channel_name: dto.channel_name ?? null,
        thumbnail: thumbnail_url,
      });

      return content;
    } catch (err: any) {
      if (err.name === "SequelizeUniqueConstraintError") {
        throw new BadRequestException("This URL has already been added.");
      }
      throw err;
    }
  }

  findAll(id) {
    return this.Portfolio.findAll({
      where: { creator_id: id }
    })

  }



  remove(contentid) {
    return this.Portfolio.destroy({
      where: { id: contentid }
    })
  }
}
