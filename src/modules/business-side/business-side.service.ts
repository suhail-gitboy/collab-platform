import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import BusinessProfile from './model/busines.modelmain';
import { HelpersService } from 'src/helpers/helpers.service';


@Injectable()
export class BusinessSideService {

  constructor(private helperService: HelpersService, @InjectModel(BusinessProfile) private businessProfileModel: typeof BusinessProfile) {
  }
  async create(body, req, files: { logo_url?: Express.Multer.File[], cover_photo_url?: Express.Multer.File[] }) {
    try {
      const User_id = req.user.id;

      const logo_img = files.logo_url?.[0] as Express.Multer.File;
      const cover_img = files.cover_photo_url?.[0] as Express.Multer.File;
      if (!logo_img && !cover_img) throw new Error("No images provided");

      const logo_urlone = await this.helperService.CloudinarySetup(logo_img, "logo_url");
      const cover_photo_urlone = await this.helperService.CloudinarySetup(cover_img, "cover_photo_url");

      const businessProfile = await this.businessProfileModel.create({
        ...body,
        user_id: User_id,
        logo_url: logo_urlone,
        cover_photo_url: cover_photo_urlone,
      });
      console.log(body);

      return businessProfile;

    } catch (error) {
      console.log("Message:", error.message);
      console.log("Name:", error.name);
      console.log("Parent:", error.parent);
      console.log("Original:", error.original);
      console.log("Errors:", error.errors);

      throw new InternalServerErrorException(error.parent?.message || error.message);
    }
  }

  findAll() {
    return `This action returns all businessSide`;
  }

  findOne(id: number) {
    return `This action returns a #${id} businessSide`;
  }

  update(id: number, updateBusinessSideDto) {
    return `This action updates a #${id} businessSide`;
  }

  remove(id: number) {
    return `This action removes a #${id} businessSide`;
  }
}
