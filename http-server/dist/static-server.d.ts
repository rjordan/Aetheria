#!/usr/bin/env node
declare class StaticServer {
    private app;
    private port;
    private staticPath;
    constructor(staticPath?: string, port?: number);
    private setupRoutes;
    start(): void;
}
export default StaticServer;
//# sourceMappingURL=static-server.d.ts.map