import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCreatorProfileDto } from './dto/create-creator_profile.dto';
import { UpdateCreatorProfileDto } from './dto/update-creator_profile.dto';
import { InjectModel } from '@nestjs/sequelize';
import CreatorProfile from './model/model';
import { HelpersService } from 'src/helpers/helpers.service';
import { CreatorCategory } from './model/creatorcategory';
import { CreatorLanguage } from './model/language';
import { RedisService } from 'src/redis/redis.service';
import { configData } from 'src/config/configeration';

@Injectable()
export class CreatorProfileService {


  constructor(private redisData: RedisService, @InjectModel(CreatorLanguage) private language: typeof CreatorLanguage, private helperService: HelpersService, @InjectModel(CreatorCategory) private creatorchategory: typeof CreatorCategory, @InjectModel(CreatorProfile) private createModel: typeof CreatorProfile) {

  }
  async create(body, req, files: { profile_photo_url?: Express.Multer.File[], cover_photo_url?: Express.Multer.File[] }) {
    try {
      const User_id = req.user.id


      const profile_img = files.profile_photo_url?.[0] as Express.Multer.File
      const cover_img = files.cover_photo_url?.[0] as Express.Multer.File
      if (!profile_img && !cover_img) throw new Error("No images provided")

      const profile_photo_url = await this.helperService.CloudinarySetup(profile_img, "profile_photo_url");
      const cover_photo_url = await this.helperService.CloudinarySetup(cover_img, "cover_photo_url");


      const creatorProfile = await this.createModel.create({
        ...body,
        user_id: User_id,
        profile_photo_url,
        cover_photo_url
      });
      console.log(body);

      return creatorProfile;

    } catch (error) {
      console.log("Message:", error.message);
      console.log("Name:", error.name);
      console.log("Parent:", error.parent);
      console.log("Original:", error.original);
      console.log("Errors:", error.errors);

      throw new InternalServerErrorException(error.parent?.message || error.message);
    }
    return 'This action adds a new creatorProfile';
  }

  async findAll() {
    return await this.createModel.findAll({
      where: {}
    });
  }

  async findOne(req) {
    const { id } = req.user;
    const key = configData.RedisKeys.userProfile(id);
    console.log("keyyyyy", key);


    return this.redisData.getOrFetch(
      key,
      async () => {
        const userdata = await this.createModel.findOne({ where: { user_id: id } });
        return userdata;
      },
      4000,
    );
  }


  async updateprofile(req, updateCreatorProfileDto, files) {
    try {
      const profile_img = files.profile_photo_url?.[0] as Express.Multer.File;
      const cover_img = files.cover_photo_url?.[0] as Express.Multer.File;

      const profile_photo_url = profile_img
        ? await this.helperService.CloudinarySetup(profile_img, "profile_photo_url")
        : undefined;

      const cover_photo_url = cover_img
        ? await this.helperService.CloudinarySetup(cover_img, "cover_photo_url")
        : undefined;

      await this.createModel.update(
        {
          ...updateCreatorProfileDto,
          profile_photo_url,
          cover_photo_url,
        },
        { where: { user_id: req.user.id } }
      );

      return await this.createModel.findOne({ where: { user_id: req.user.id } });
    } catch (error) {
      console.log("Message:", error.message);
      console.log("Name:", error.name);
      console.log("Parent:", error.parent);
      console.log("Original:", error.original);
      console.log("Errors:", error.errors);

      throw new InternalServerErrorException(error.parent?.message || error.message);
    }
  }
  async updateLocation(id: string, location: any) {
    return await this.createModel.update(
      {
        location
      }, {
      where: { id }
    },
    )
  }

  async UpdatePricing(id: string, pricing: any) {
    return await this.createModel.update({
      pricing
    }, {
      where: { id }
    });
  }

  async UpdateCollaboration(id: string, collaboration: any) {
    return await this.createModel.update({
      collaboration
    }, {
      where: { id }
    });
  }
  async remove(id: string) {
    return await this.createModel.destroy({ where: { id } });
  }


  // category
  async Createcategory(id: string, userid: string) {
    try {
      let profile_id = await this.createModel.findOne({
        where: { user_id: userid }, attributes: ["id"]
      })

      return await this.creatorchategory.create({
        category_id: id,
        creator_id: profile_id?.id

      })

    } catch (error) {
      throw new InternalServerErrorException("err", error.message)

    }

  }
  async Deletecategory(id: string) {
    return await this.creatorchategory.destroy({
      where: { category_id: id }
    })

  }

  //Language
  async Createlanguage(id: string, userid: string) {
    try {
      let profile_id = await this.createModel.findOne({
        where: { user_id: userid }, attributes: ["id"]
      })

      return await this.language.create({
        creator_id: profile_id?.id,
        language_id: id

      })

    } catch (error) {
      throw new InternalServerErrorException("err", error.message)

    }
  }
  async Deletelanguage(id: string) {
    return await this.language.destroy({
      where: { language_id: id }
    })

  }

}
