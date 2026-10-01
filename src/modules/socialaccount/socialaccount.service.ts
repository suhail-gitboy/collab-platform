import { Injectable, InternalServerErrorException } from '@nestjs/common';

import axios from "axios"
@Injectable()
export class SocialaccountService {
  create(createSocialaccountDto) {
    return 'This action adds a new socialaccount';
  }

  async exchangeCodeForToken(code: string) {
    try {
      const redirectUri =
        process.env.REDIRECT!.trim();

      const params = new URLSearchParams();

      params.append(
        'client_id',
        process.env.INSTAGRAM_APP_ID!.trim(),
      );


      params.append(
        'client_secret',
        process.env.INSTAGRAM_APP_SECRET!.trim(),
      );

      params.append(
        'grant_type',
        'authorization_code',
      );

      params.append(
        'redirect_uri',
        redirectUri,
      );

      params.append('code', code);

      const response = await axios.post(
        'https://api.instagram.com/oauth/access_token',
        params.toString(),
        {
          headers: {
            'Content-Type':
              'application/x-www-form-urlencoded',
          },
        },
      );

      return response.data;

    } catch (error: any) {
      console.error(
        'Instagram token exchange failed:',
        error.response?.data ||
        error.message,
      );

      throw error;
    }
  }
  async getLongLivedToken(shortLivedToken: string) {
    try {
      const params = new URLSearchParams();


      params.append('grant_type', 'ig_exchange_token');
      params.append(
        'client_secret',
        process.env.INSTAGRAM_APP_SECRET!,
      );
      params.append('access_token', shortLivedToken);

      const response = await axios.get(
        'https://graph.instagram.com/access_token',
        {
          params: Object.fromEntries(params),
        },
      );

      return response.data;
    } catch (error: any) {
      console.error(
        'Long-lived token exchange failed:',
        error.response?.data || error.message,
      );

      throw new InternalServerErrorException(
        'Failed to obtain long-lived Instagram token',
      );
    }
  }
  async getInstagramProfile(accessToken: string) {
    try {
      const response = await axios.get(
        'https://graph.instagram.com/me',
        {
          params: {
            fields: 'id, username, account_type, media_count, followers_count, follows_count, name, profile_picture_url',
            access_token: accessToken,
          },
        },
      );

      return response.data;
    } catch (error: any) {
      console.error(
        'Instagram profile request failed:',
        error.response?.data || error.message,
      );

      throw new InternalServerErrorException(
        'Failed to fetch Instagram profile',
      );
    }
  }
  findOne(id: number) {
    return `This action returns a #${id} socialaccount`;
  }

  update(id: number, updateSocialaccountDto) {
    return `This action updates a #${id} socialaccount`;
  }

  remove(id: number) {
    return `This action removes a #${id} socialaccount`;
  }
}
