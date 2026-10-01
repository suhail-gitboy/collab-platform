// chat/authenticated-socket.adapter.ts
import { IoAdapter } from "@nestjs/platform-socket.io";
import { ServerOptions } from "socket.io";
import { INestApplicationContext } from "@nestjs/common";
import { wsAuthMiddleware } from "src/common/middlewares/ws.middleware";


export class AuthenticatedSocketAdapter extends IoAdapter {
    constructor(
        app: INestApplicationContext,

    ) {
        super(app);
    }

    createIOServer(port: number, options?: ServerOptions) {
        const server = super.createIOServer(port, options);
        server.use(wsAuthMiddleware()); // ← middleware attaches HERE
        return server;
    }
}