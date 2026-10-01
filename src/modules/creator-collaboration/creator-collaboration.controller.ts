import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  ParseUUIDPipe,
  UseGuards,
} from "@nestjs/common";


import { CreatorCollaborationService } from "./post.service";
import { RBACGuard } from "src/common/middlewares/creator.middleware";
import { Roles } from "src/common/Roles";
import { userRole } from "src/types/types.common";
import { HelpersService } from "src/helpers/helpers.service";
import { QueryCollaborationResponseParams } from "./types/creator-collaboration.entity";

@Controller("creator-collaboration")
@UseGuards(RBACGuard)
@Roles(userRole.CREATOR, userRole.COLLABORATOR)
export class CreatorCollaborationController {
  constructor(private readonly service: CreatorCollaborationService, private readonly helper: HelpersService) { }



  @Post("posts")
  createPost(@Req() req: any, @Body() dto) {

    // Swap req.user.id for however your auth guard exposes the current user.
    return this.service.createPost(req.user.id, dto);
  }

  @Get("posts")
  findAllPosts() {
    return this.service.findAllPosts();
  }

  @Get("posts/:id")
  findOnePost(@Param("id", ParseUUIDPipe) id: string) {
    return this.service.findOnePost(id);
  }

  @Patch("posts/:id")
  updatePost(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto
  ) {
    return this.service.updatePost(id, dto);
  }

  @Delete("posts/:id")
  removePost(@Param("id", ParseUUIDPipe) id: string) {
    return this.service.removePost(id);
  }

  // ---------- Responses: /creator-collaboration/responses ----------

  @Post("responses/:userType/:userId")
  createResponse(
    @Param("userType") userType,
    @Param("userId") userId: string,
    @Body() dto
  ) {
    return this.service.createResponse(userId, userType, dto);
  }

  // Replies scoped to one post, e.g. /creator-collaboration/posts/:postId/responses
  @Get("posts/:postId/responses")
  findResponsesForPost(
    @Param("postId") postId: string,
    @Query() query
  ) {
    return this.service.findResponsesForPost(postId, query);
  }
  @Get("responses/:id")
  findOneResponse(@Param("id", ParseUUIDPipe) id: string) {
    return this.service.findOneResponse(id);
  }

  // Used for accept/reject — pass { "status": "accepted" }
  @Patch("responses/:id")
  updateResponse(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto
  ) {
    return this.service.updateResponse(id, dto);
  }

  @Delete("responses/:id")
  removeResponse(@Param("id", ParseUUIDPipe) id: string) {
    return this.service.removeResponse(id);
  }
}