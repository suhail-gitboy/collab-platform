import { JwtUserPayload } from '../helpers/helpers.service';

declare global {
    namespace Express {
        interface Request {
            user: {
                id: string;
            };
        }
    }
}