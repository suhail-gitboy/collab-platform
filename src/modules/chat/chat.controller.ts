import { Body, Controller, Req, Get, Param, NotFoundException, InternalServerErrorException, Query, Delete } from '@nestjs/common';
import { ConversationConnection } from './model/conversation';
import { ConversationMessage } from './model/message';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { RBACGuard } from 'src/common/middlewares/creator.middleware';
import { Op, QueryTypes, Sequelize } from 'sequelize';
import sequelize from 'sequelize';
import { User } from '../auth/models/user-models';


@Controller('chat')
export class ChatController {

    constructor(@InjectModel(User) private user: typeof User, @InjectConnection() private sequelize: Sequelize, @InjectModel(ConversationConnection) private mutualConnection: typeof ConversationConnection, @InjectModel(ConversationMessage) private message: typeof ConversationMessage) {

    }


    @Get("allchatuser")
    async GetAlluser(@Req() req) {
        try {
            const userId = req.user.id;


            const typeOfuser = await this.sequelize.query(
                `SELECT user_type FROM users WHERE id = :userId`,
                {
                    replacements: { userId },
                    type: QueryTypes.SELECT
                }
            ) as any[];

            if (!typeOfuser.length) throw new NotFoundException("user_type not found");

            let usersdata;

            if (typeOfuser[0].user_type == "business") {
                usersdata = await this.sequelize.query(
                    `
    SELECT 
        cv.id AS "connectionId",
        ms.content AS "lastmessage",

        other_user.id AS "userId",

        cp.id AS "creatorId",
        cp.display_name AS "creatorDisplayName",
        cp.profile_photo_url AS "creatorPhoto"

    FROM "conversations" cv

    LEFT JOIN "users" other_user
        ON other_user.id = CASE
            WHEN cv.user1_id = :userId THEN cv.user2_id
            ELSE cv.user1_id
        END

    LEFT JOIN "creator_profiles" cp
        ON other_user.id = cp.user_id

    LEFT JOIN "messages" ms
        ON ms.id = cv.last_message_id

    WHERE cv.user1_id = :userId
       OR cv.user2_id = :userId
    `,
                    {
                        replacements: { userId },
                        type: QueryTypes.SELECT
                    }
                );
                //         usersdata = await this.sequelize.query(
                //             `
                // SELECT 
                //   cv.id AS "connectionId",
                //   us.id AS "user1o2",
                //   us1.id AS "user1or2",
                //   ms.content AS "lastmessage",
                //   cp.id AS "creatorId",
                //   cp.display_name AS "creatorDisplayName",
                //   cp.profile_photo_url AS "creatorPhoto",
                //   cp1.id AS "creatorId2",
                //   cp1.display_name AS "creatorDisplayName2",
                //   cp1.profile_photo_url AS "creatorPhoto2"
                // FROM "conversations" cv
                // LEFT JOIN "users" us ON cv.user1_id = us.id
                // LEFT JOIN "users" us1 ON cv.user2_id = us1.id
                // LEFT JOIN "creator_profiles" cp ON us.id = cp.user_id
                // LEFT JOIN "creator_profiles" cp1 ON us1.id = cp1.user_id
                // LEFT JOIN "messages" ms ON ms.id=cv.last_message_id
                // WHERE cv.user1_id = :userId OR cv.user2_id = :userId
                // `,
                //             {
                //                 replacements: { userId },
                //                 type: QueryTypes.SELECT
                //             }
                //         );
            } else {
                usersdata = await this.sequelize.query(
                    `
        SELECT 
          cv.id AS "connectionId",
          
          ms.content AS "lastmessage",
          cp.id AS "businessId",
          cp.business_name AS "businessName",
          cp.logo_url AS "businessLogo",
        
        FROM "conversations" cv
        LEFT JOIN "users" us ON us.id=WHEN cv.user1_id=:userId THEN cv.user2_id ELSE cv.user1_id END
        
        LEFT JOIN "business_profiles" cp ON us.id = cp.user_id
    
        LEFT JOIN "messages" ms ON ms.id=cv.last_message_id
        WHERE cv.user1_id = :userId OR cv.user2_id = :userId
        `,
                    {
                        replacements: { userId },
                        type: QueryTypes.SELECT
                    }
                );
            }
            console.log(usersdata);

            return usersdata;

        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }
    @Get("chathistory")
    async Getchathistory(
        @Query("connectionID") connectionID: string,
        @Query("limit") limit: string = "20"
    ) {
        try {
            const parsedLimit = parseInt(limit, 10) || 20;

            const messages = await this.sequelize.query(
                `
      SELECT * FROM messages 
      WHERE conversation_id = :connectionID 
      ORDER BY created_at DESC 
      LIMIT :limit
      `,
                {
                    replacements: { connectionID, limit: parsedLimit },
                    type: QueryTypes.SELECT
                }
            );


            return messages;

        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

}
