import { Controller, Get, Post, Body, Patch, Query, Param, Delete, Req, Res, UseGuards } from '@nestjs/common';
import { SocialaccountService } from './socialaccount.service';


import { Response, Request } from 'express';
import { InjectModel } from '@nestjs/sequelize';
import { CreatorSocialAccount, SocialPlatform } from './model/model';
import { RBACGuard } from 'src/common/middlewares/creator.middleware';
import { Roles } from 'src/common/Roles';
import { userRole } from 'src/types/types.common';
import { EncryptionService } from 'src/helpers/Encryptor';
import CreatorProfile from '../creator_profile/model/model';
SocialPlatform
@Controller('socialaccount')
@UseGuards(RBACGuard)
@Roles(userRole.CREATOR, userRole.COLLABORATOR)
export class SocialaccountController {
  constructor(@InjectModel(CreatorProfile) private creator: typeof CreatorProfile, private encryptionService: EncryptionService, private readonly socialaccountService: SocialaccountService, @InjectModel(CreatorSocialAccount) private readonly creatorSocialAccountModel: typeof CreatorSocialAccount) { }
  @Get('connect')
  async create(@Req() req, @Res() res) {
    const redirectUri = process.env.REDIRECT!.trim();
    console.log("in connect", redirectUri);

    const params = new URLSearchParams({
      client_id: process.env.INSTAGRAM_APP_ID!.trim(),
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'instagram_business_basic',
    });
    return res.redirect(`https://www.instagram.com/oauth/authorize?${params.toString()}`);
  }

  @Get('callback')
  async callback(@Query() query: any, @Res() res, @Req() req) {
    const { code, error, error_reason, error_description } = query;

    if (!code) {
      console.error('Instagram returned no code:', { error, error_reason, error_description });
      return res.status(400).json({ success: false, message: 'Instagram authorization code missing', instagramError: query });
    }

    try {
      const token = await this.socialaccountService.exchangeCodeForToken(code);
      const longLived = await this.socialaccountService.getLongLivedToken(token.access_token);
      const profile = await this.socialaccountService.getInstagramProfile(longLived.access_token);
      let encryptedtoken = this.encryptionService.encrypt(longLived.access_token);
      console.log("userid", req.user.id);

      let creater = await this.creator.findOne({ where: { user_id: req.user.id }, attributes: ["id"] })
      console.log("creater", creater);

      const newAccount = await this.creatorSocialAccountModel.create({
        creator_id: creater?.id,
        platform: SocialPlatform.INSTAGRAM,
        handle: profile.username,
        profile_url: `https://www.instagram.com/${profile.username}/`,
        followers_count: profile.followers_count,
        is_verified: profile.is_verified,
        access_token: encryptedtoken,
        token_expires_at: longLived.expires_at,
        account_type: profile.account_type,
      });

      return res.json({ success: true, instagram: newAccount, token: longLived });

    } catch (error: any) {
      console.error('Instagram callback error:', error.response?.data || error.message);
      return res.status(500).json({ success: false, message: error.response?.data || error.message });
    }
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.socialaccountService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSocialaccountDto) {
    return this.socialaccountService.update(+id, updateSocialaccountDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.socialaccountService.remove(+id);
  }
}
