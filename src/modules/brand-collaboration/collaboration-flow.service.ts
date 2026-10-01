import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HelpersService } from 'src/helpers/helpers.service';
import { Campaign } from './models/campaign';

import { CampaignStatus, InitiatorType, RequestStatus } from 'src/types/types.common';
import { CollaborationRequest } from './models/collaboration_request';

@Injectable()
export class CollaborationFlowService {
  constructor(
    private Helper: HelpersService,
    @InjectModel(Campaign) private Campaigns: typeof Campaign,
    @InjectModel(CollaborationRequest) private Requests: typeof CollaborationRequest,
  ) { }

  // ---------------------------------------------------------------------
  // CAMPAIGNS
  // ---------------------------------------------------------------------

  async createCampaign(userid, img_url: Express.Multer.File, createCollaborationFlowDto) {
    const businessId = await this.Helper.FindCreatorOrBusinessUserId(userid, 'business');

    if (
      createCollaborationFlowDto.budgetMin != null &&
      createCollaborationFlowDto.budgetMax != null &&
      createCollaborationFlowDto.budgetMin > createCollaborationFlowDto.budgetMax
    ) {
      throw new BadRequestException('budgetMin cannot exceed budgetMax');
    }

    let coverImageUrl: string | null = null;
    if (img_url) {
      coverImageUrl = await this.Helper.CloudinarySetup(img_url, 'campaigns');
    }

    try {
      const campaign = await this.Campaigns.create({
        businessId,
        title: createCollaborationFlowDto.title,
        description: createCollaborationFlowDto.description,
        coverImageUrl,
        collaborationType: createCollaborationFlowDto.collaborationType,
        budgetMin: createCollaborationFlowDto.budgetMin,
        budgetMax: createCollaborationFlowDto.budgetMax,
        currency: createCollaborationFlowDto.currency ?? 'INR',
        requirements: createCollaborationFlowDto.requirements,
        deliverables: createCollaborationFlowDto.deliverables,
        targetCity: createCollaborationFlowDto.targetCity,
        targetState: createCollaborationFlowDto.targetState,
        targetCountry: createCollaborationFlowDto.targetCountry,
        applicationDeadline: createCollaborationFlowDto.applicationDeadline,
        status: CampaignStatus.DRAFT,
      } as any);

      return campaign;
    } catch (error) {
      throw new InternalServerErrorException('error creating campaign');
    }
  }

  async GetAllCampaign(userid?: string) {
    try {
      const where: any = {};

      // If called by a business, scope to their own campaigns.
      // If no userid passed, treat as a public listing (e.g. creators browsing).
      if (userid) {
        const businessId = await this.Helper.FindCreatorOrBusinessUserId(userid, 'business');
        where.businessId = businessId;
      } else {
        where.status = CampaignStatus.ACTIVE;
      }

      return await this.Campaigns.findAll({ where, order: [['createdAt', 'DESC']] });
    } catch (error) {
      throw new InternalServerErrorException('error fetching campaigns');
    }
  }

  async GetSinglecampaing(campId: string) {
    const campaign = await this.Campaigns.findByPk(campId);

    if (!campaign) {
      throw new NotFoundException('campaign not found');
    }

    return campaign;
  }

  async DeleteCampaign(campId: string, userid: string) {
    const businessId = await this.Helper.FindCreatorOrBusinessUserId(userid, 'business');
    const campaign = await this.Campaigns.findByPk(campId);

    if (!campaign) {
      throw new NotFoundException('campaign not found');
    }

    if (campaign.businessId !== businessId) {
      throw new ForbiddenException('you do not own this campaign');
    }

    try {
      await campaign.destroy();
      return { deleted: true, id: campId };
    } catch (error) {
      throw new InternalServerErrorException('error deleting campaign');
    }
  }

  // ---------------------------------------------------------------------
  // COLLABORATION REQUESTS
  // ---------------------------------------------------------------------

  async CreatecreatorRequest(campId: string, userid: string, createCollaborationFlowDto) {
    const creatorId = await this.Helper.FindCreatorOrBusinessUserId(userid, 'creator');

    const campaign = await this.Campaigns.findByPk(campId, {
      attributes: ['id', 'businessId'],
    });

    if (!campaign) {
      throw new NotFoundException('campaign not found');
    }

    const existing = await this.Requests.findOne({
      where: { campaignId: campaign.id, creatorId, status: RequestStatus.PENDING },
    });

    if (existing) {
      throw new BadRequestException('you already have a pending request on this campaign');
    }

    try {
      const request = await this.Requests.create({
        campaignId: campaign.id,
        creatorId,
        businessId: campaign.businessId,
        initiatedBy: InitiatorType.CREATOR,
        collaborationType: createCollaborationFlowDto.collaborationType,
        proposedBudget: createCollaborationFlowDto.proposedBudget,
        currency: createCollaborationFlowDto.currency ?? 'INR',
        message: createCollaborationFlowDto.message,
        status: RequestStatus.PENDING,
      } as any);

      return request;
    } catch (error) {
      throw new InternalServerErrorException('error creating collaboration request');
    }
  }

  async ALLRequest(userid: string, creatorOrbusiness: 'creator' | 'business') {
    try {
      const profileId = await this.Helper.FindCreatorOrBusinessUserId(userid, creatorOrbusiness);
      const where = creatorOrbusiness === 'creator'
        ? { creatorId: profileId }
        : { businessId: profileId };

      return await this.Requests.findAll({
        where,
        include: [Campaign],
        order: [['createdAt', 'DESC']],
      });
    } catch (error) {
      throw new InternalServerErrorException('error fetching collaboration requests');
    }
  }

  async EditRequest(id: string, status: RequestStatus, userid: string) {
    const businessId = await this.Helper.FindCreatorOrBusinessUserId(userid, 'business');
    const request = await this.Requests.findByPk(id);

    if (!request) {
      throw new NotFoundException('request not found');
    }

    if (request.businessId !== businessId) {
      throw new ForbiddenException('you do not own this request');
    }

    if (request.status !== RequestStatus.PENDING) {
      throw new BadRequestException('only pending requests can be updated');
    }

    try {
      request.status = status;
      request.respondedAt = new Date();
      await request.save();
      return request;
    } catch (error) {
      throw new InternalServerErrorException('error updating request');
    }
  }

  async DeleteRequestBycreator(id: string, userid: string) {
    const creatorId = await this.Helper.FindCreatorOrBusinessUserId(userid, 'creator');
    const request = await this.Requests.findByPk(id);

    if (!request) {
      throw new NotFoundException('request not found');
    }

    if (request.creatorId !== creatorId) {
      throw new ForbiddenException('you do not own this request');
    }

    try {
      await request.destroy();
      return { deleted: true, id };
    } catch (error) {
      throw new InternalServerErrorException('error deleting request');
    }
  }
}