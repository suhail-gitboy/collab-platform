// ws-auth.middleware.ts
import { Socket } from "socket.io";
import { verify } from "jsonwebtoken";

export const wsAuthMiddleware = () => {
    return async (socket, next) => {
        try {
            const authHeader = socket.handshake.headers.authorization;

            console.log('Authorization:', authHeader);

            if (!authHeader) {
                return next(new Error('Authorization header missing'));
            }

            const [type, token] = authHeader.split(' ');

            if (type !== 'Bearer' || !token) {
                return next(new Error('Invalid authorization header'));
            }


            const payload = verify(token, process.env.SECRET) as { id: string };
            socket.data.userId = payload.id

            next();
        } catch (error) {
            console.error('WS auth error:', error);
            next(new Error('Unauthorized'));
        }
    };
};
