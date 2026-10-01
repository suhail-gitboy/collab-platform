import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { CollaborationFlowService } from './collaboration-flow.service';
import { RBACGuard } from 'src/common/middlewares/creator.middleware';
import { Roles } from 'src/common/Roles';
import { userRole, RequestStatus } from 'src/types/types.common';


type AuthedRequest = Request & { user: { id: string } };

@Controller('collaboration-flow')
export class CollaborationFlowController {
  constructor(private readonly collaborationFlowService: CollaborationFlowService) { }

  // ---------------------------------------------------------------------
  // CAMPAIGNS
  // ---------------------------------------------------------------------

  @UseGuards(RBACGuard)
  @Roles(userRole.BUSINESS)
  @Post('create-campaign')
  @UseInterceptors(FileInterceptor('img_url'))
  create(
    @Body() createCampaignDto,
    @Req() req: AuthedRequest,
    @UploadedFile() img_url: Express.Multer.File,
  ) {
    return this.collaborationFlowService.createCampaign(req.user.id, img_url, createCampaignDto);
  }

  // Public listing when logged out / browsing; scoped to own campaigns when a business is logged in.
  @Get('get-all/post')
  findAll(@Req() req: AuthedRequest) {
    return this.collaborationFlowService.GetAllCampaign(req.user?.id);
  }

  @Get('get-one/:id')
  findOne(@Param('id') id: string) {
    return this.collaborationFlowService.GetSinglecampaing(id);
  }

  @UseGuards(RBACGuard)
  @Roles(userRole.BUSINESS)
  @Delete('delete/:id')
  removeCampaign(@Param('id') id: string, @Req() req: AuthedRequest) {
    return this.collaborationFlowService.DeleteCampaign(id, req.user.id);
  }

  // ---------------------------------------------------------------------
  // COLLABORATION REQUESTS
  // ---------------------------------------------------------------------

  @UseGuards(RBACGuard)
  @Roles(userRole.CREATOR)
  @Post('create-request/:campaign-id')
  createRequest(
    @Body() createCollaborationFlowDto,
    @Param('campaign-id') campId: string,
    @Req() req: AuthedRequest,
  ) {
    return this.collaborationFlowService.CreatecreatorRequest(
      campId,
      req.user.id,
      createCollaborationFlowDto,
    );
  }

  // Requests a business has received on its campaigns.
  @UseGuards(RBACGuard)
  @Roles(userRole.BUSINESS)
  @Get('requests/received')
  findReceivedRequests(@Req() req: AuthedRequest) {
    return this.collaborationFlowService.ALLRequest(req.user.id, 'business');
  }

  // Requests a creator has sent out.
  @UseGuards(RBACGuard)
  @Roles(userRole.CREATOR)
  @Get('requests/sent')
  findSentRequests(@Req() req: AuthedRequest) {
    return this.collaborationFlowService.ALLRequest(req.user.id, 'creator');
  }

  // Business accepts/declines a request.
  @UseGuards(RBACGuard)
  @Roles(userRole.BUSINESS)
  @Patch('request/:id')
  updateRequest(
    @Param('id') id: string,
    @Body('status') status: RequestStatus,
    @Req() req: AuthedRequest,
  ) {
    return this.collaborationFlowService.EditRequest(id, status, req.user.id);
  }

  // Creator withdraws their own request (hard delete).
  @UseGuards(RBACGuard)
  @Roles(userRole.CREATOR)
  @Delete('delete/request/:id')
  removeRequest(@Param('id') id: string, @Req() req: AuthedRequest) {
    return this.collaborationFlowService.DeleteRequestBycreator(id, req.user.id);
  }
}