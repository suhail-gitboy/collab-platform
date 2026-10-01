import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
    ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectModel } from '@nestjs/sequelize';
import { HelpersService } from 'src/helpers/helpers.service';
import { User } from 'src/modules/auth/models/user-models';

import { userRole } from 'src/types/types.common';
import { ROLES_KEY } from '../Roles';


@Injectable()
export class RBACGuard implements CanActivate {
    constructor(
        private readonly helpersService: HelpersService,
        private readonly reflector: Reflector,

        @InjectModel(User)
        private readonly userModel: typeof User,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const token = request.headers.authorization?.split(' ')[1];

        if (!token) {
            throw new UnauthorizedException('Token not found');
        }

        const payload = await this.helpersService.JwtVerify(token);

        const user = await this.userModel.findByPk(payload.id);


        if (!user) {
            throw new UnauthorizedException('User not found');
        }


        request.user = payload;



        const requiredRoles = this.reflector.getAllAndOverride<userRole[]>(
            ROLES_KEY,
            [
                context.getHandler(),
                context.getClass(),
            ],
        );

        // No @Roles() => allow authenticated user
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }


        if (!requiredRoles.includes(user.user_type as userRole)) {
            throw new ForbiddenException('Access denied');
        }

        return true;
    }
}