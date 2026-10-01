import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import CollaborationResponse from "./Models/Creator-collaboration";
import CollaborationPost from "./Models/Creator-collaboration.request";
import { HelpersService } from "src/helpers/helpers.service";
import { userRole } from "src/types/types.common";
// import { CollaborationPost } from "./model/collaboration-post.model";
// import { CollaborationResponse } from "./model/collaboration-response.model";
import { QueryCollaborationResponseParams } from "./types/creator-collaboration.entity";
@Injectable()
export class CreatorCollaborationService {
  constructor(
    @InjectModel(CollaborationPost)
    private readonly postModel: typeof CollaborationPost,
    @InjectModel(CollaborationResponse)
    private readonly responseModel: typeof CollaborationResponse,
    private readonly helper: HelpersService) { }

  // ---------- Posts ----------

  async createPost(userId: string, dto) {
    let creatorprofile = await this.helper.FindCreatorOrBusinessUserId(userId, "creator")
    return await this.postModel.create({ ...dto, user_id: creatorprofile } as any);
  }

  async findAllPosts() {
    return await this.postModel.findAll({
      include: [{ model: CollaborationResponse, as: "responses" }],
      order: [["created_at", "DESC"]],
    });
  }

  async findOnePost(id: string) {
    const post = await this.postModel.findByPk(id, {
      include: [{ model: CollaborationResponse, as: "responses" }],
    });
    if (!post) {
      throw new NotFoundException(`Collaboration post ${id} not found`);
    }
    return post;
  }

  async updatePost(id: string, dto) {
    const post = await this.findOnePost(id);
    return post.update(dto as any);
  }

  async removePost(id: string) {
    const post = await this.findOnePost(id);
    await post.destroy();
    return { id, deleted: true };
  }

  // ---------- Responses ----------



  async createResponse(
    userId,
    userType,
    dto
  ) {
    const profileId = await this.helper.FindCreatorOrBusinessUserId(userId, userType);

    const payload: any = {
      collaboration_post_id: dto.collaboration_post_id,
      message: dto.message,
      responder_type: userType,
    };

    if (userType === userRole.CREATOR) {
      payload.responder_creator_id = profileId;
    } else {
      payload.responder_business_id = profileId;
    }

    return this.responseModel.create(payload);
  }

  findResponsesForPost(postId: string, query: QueryCollaborationResponseParams = {}) {
    const where: Record<string, any> = { collaboration_post_id: postId };

    if (query.responder_type) where.responder_type = query.responder_type;
    if (query.status) where.status = query.status;

    return this.responseModel.findAll({
      where,
      order: [["created_at", "DESC"]],
    });
  }

  async findOneResponse(id: string) {
    const response = await this.responseModel.findByPk(id);
    if (!response) {
      throw new NotFoundException(`Collaboration response ${id} not found`);
    }
    return response;
  }

  async updateResponse(id: string, dto) {
    const response = await this.findOneResponse(id);
    return response.update(dto as any);
  }

  async removeResponse(id: string) {
    const response = await this.findOneResponse(id);
    await response.destroy();
    return { id, deleted: true };
  }
}