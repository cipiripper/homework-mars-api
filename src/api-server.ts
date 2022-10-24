import Express from "express";
import http from "http";
import { AddressInfo } from "net";
import * as Routers from "./routers";

export default class ApiServer {
    private port: number;
    private mountPoint: string;
    private app: Express.Application;
    private server: http.Server | null;

    constructor(port?: number) {
        this.port = port ?? Number(process.env.PORT ?? 0);
        this.mountPoint = process.env.MOUNT_POINT ?? "/api";
        this.app = Express();
        this.server = null;
    }

    private async initRouters() {
        this.app.use(`${this.mountPoint}`, Routers.images);
    }

    public async start(): Promise<number> {
        await this.initRouters();

        return new Promise((resolve, reject) => {
            this.server = this.app.listen(this.port, () => {
                const startedPort = (this.server!.address() as AddressInfo).port;
                this.port = startedPort;
                console.log(`Mars Images API is available at: http://localhost:${startedPort}${this.mountPoint}`);
                resolve(startedPort);
            });

            this.server.on("error", reject);
        });
    }

    public stop() {
        try {
            if (this.server) {
                this.server.close();
                this.server.closeAllConnections();
                this.server.closeIdleConnections();
            }
        } catch {
            //Errors ignored.
        }
    }

    public getApp(): Express.Application {
        return this.app;
    }
}