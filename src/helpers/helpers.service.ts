import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';

import bcrypt from "bcrypt"
import { configData } from 'src/config/configeration';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import { InjectModel } from '@nestjs/sequelize';
import CreatorProfile from 'src/modules/creator_profile/model/model';
import BusinessProfile from 'src/modules/business-side/model/busines.modelmain';
import { Server } from 'node:http';

interface JwtUserPayload extends JwtPayload {
    id: string;
}

@Injectable()
export class HelpersService {

    constructor(@InjectModel(CreatorProfile) private creator: typeof CreatorProfile, @InjectModel(BusinessProfile) private business: typeof BusinessProfile) {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_SECRET
        })
    }


    JwtGenerateAccessToken(id: string): string {
        const token = jwt.sign(
            { id },
            process.env.SECRET || configData.secret as string,
            {
                expiresIn: '10m',
            },
        );

        return token;
    }

    JwtRefeshtoken(id: string): string {
        const token = jwt.sign(
            { id },
            process.env.SECRET,
            {
                expiresIn: '7d',
            },
        );

        return token;
    }

    JwtVerify(token: string): JwtUserPayload {
        const decoded = jwt.verify(
            token,
            process.env.SECRET,
        );

        if (typeof decoded === 'string') {
            throw new UnauthorizedException(
                'Invalid token payload',
            );
        }

        return decoded as JwtUserPayload;
    }
    async Hashing(password: any): Promise<boolean> {
        const hash = await bcrypt.hash(password, 10)
        return hash
    }


    async Compare(password: any, hashedp: string): Promise<string> {
        const hash = await bcrypt.compare(password, hashedp)
        return hash
    }


    async CloudinarySetup(
        file: Express.Multer.File,
        folder: string,
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            const uploadStream =
                cloudinary.uploader.upload_stream(
                    {
                        folder,
                        resource_type: 'image',
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                            return;
                        }

                        if (!result) {
                            reject(
                                new Error(
                                    'Cloudinary upload failed',
                                ),
                            );
                            return;
                        }

                        resolve(result.secure_url);
                    },
                );

            uploadStream.end(file.buffer);
        });
    }


    async FindCreatorOrBusinessUserId(userid, creatorOrbusiness) {

        try {
            let iditem
            if (creatorOrbusiness == "creator") {
                iditem = await this.creator.findOne({
                    where: { user_id: userid },
                    attributes: ["id"]
                })


            } else if (creatorOrbusiness == "business") {
                iditem = await this.business.findOne({
                    where: { user_id: userid },
                    attributes: ["id"]
                })


            }
            if (iditem == null) {
                throw new NotFoundException("not found in business or creator accound")

            }

            let result = iditem ? iditem.id : null
            return result

        } catch (error) {
            throw new InternalServerErrorException("error finding profile user_id in helper function ")
        }
    }
}
