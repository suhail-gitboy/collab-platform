import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SavedByType, SavedRelation } from './models/savemodel';
import CreatorProfile from '../creator_profile/model/model';
import BusinessProfile from '../business-side/model/busines.modelmain';
import { HelpersService } from 'src/helpers/helpers.service';


@Injectable()
export class SavedService {

  constructor(private Helper: HelpersService, @InjectModel(SavedRelation) private Save: typeof SavedRelation, @InjectModel(CreatorProfile) private creator: typeof CreatorProfile, @InjectModel(BusinessProfile) private business: typeof BusinessProfile) {

  }
  async create(params, createSavedDto, req) {
    try {
      const { id } = req.user
      const { savedby } = createSavedDto
      let resource
      if (savedby === 'creator') {
        const creatorId = await this.Helper.FindCreatorOrBusinessUserId(id, 'creator');
        resource = await this.Save.create({
          savedBy: savedby,
          creatorId,
          businessId: params,
        });
      } else {
        const businessId = await this.Helper.FindCreatorOrBusinessUserId(id, 'business');
        resource = await this.Save.create({
          savedBy: savedby,
          businessId,
          creatorId: params,
        });
      }

      return resource


    } catch (error) {
      throw new InternalServerErrorException("err", error.message)
    }

  }
  async findAll(req, savedBy) {

    let bywhom
    if (savedBy == "creator") {
      bywhom = await this.Helper.FindCreatorOrBusinessUserId(req.user.id, "creator")
      return await this.Save.findAll({
        where: {
          creator_id: bywhom
        }
      })
    } else {
      bywhom = await this.Helper.FindCreatorOrBusinessUserId(req.user.id, "business")
      return await this.Save.findAll({
        where: {
          business_id: bywhom
        }
      })
    }






  }




  async remove(id: string) {
    return await this.Save.destroy({
      where: { id }
    });
  }
}
