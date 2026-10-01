import {
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import { HelpersService } from '../../helpers/helpers.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

    constructor(
        private readonly helperService: HelpersService,
    ) { }

    use(
        req: Request,
        res: Response,
        next: NextFunction,
    ) {
        try {
            const authHeader = req.headers.authorization;
            console.log(authHeader);

            if (!authHeader) {
                throw new UnauthorizedException(
                    'Authorization token is required',
                );
            }

            // Expected:
            // Authorization: Bearer <token>

            const [type, token] =
                authHeader.split(' ');

            if (
                type !== 'Bearer' ||
                !token
            ) {
                throw new UnauthorizedException(
                    'Invalid authorization format',
                );
            }

            // Verify JWT
            const payload =
                this.helperService.JwtVerify(token);


            if (!payload || !payload.id) {
                throw new UnauthorizedException(
                    'Invalid token',
                );
            }


            req.user = {
                id: payload.id,
            };

            next();

        } catch (error) {
            throw new UnauthorizedException(
                'Unauthorized',
            );
        }
    }
}