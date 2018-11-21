import * as fastify from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import * as pino from 'pino';
import {Routes} from "./routes";
import {DataBase} from "../db";

export class AppServer {
    private static serverInstance: AppServer;
    private server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>;
    private loggerTransport = pino({ level: 'info' });

    static getInstance() {
        if (!AppServer.serverInstance) {
            AppServer.serverInstance = new AppServer();
        }
        return AppServer.serverInstance;
    }

    private constructor() {
        this.server = fastify({
            ignoreTrailingSlash: true,
            logger: this.loggerTransport,
        });

        this.setMiddlewares();
        this.setRoutes();
    }

    private setMiddlewares = () => {
        this.server.use(require('cors')());
        this.server.use(require('hide-powered-by')());
        this.server.use(require('x-xss-protection')());
    };

    private setRoutes = () => new Routes(this.server).getRoutes();

    startServer = async () => {
        try {
            await DataBase.getInstance().connectToBd();
        } catch (err) {
            this.server.log.error(err.message);
            process.exit(1);
        }

        this.server.listen(Number(process.env.port), '0.0.0.0', async (err, address) => {
            if (err) {
                this.server.log.error(err.message);
                await DataBase.getInstance().db.disconnect();
                process.exit(1);
            }
        });
    }

}

