#!/usr/bin/env node
import express from 'express';
import path from 'path';
class StaticServer {
    app;
    port;
    staticPath;
    constructor(staticPath = '../generated', port = 3001) {
        this.app = express();
        this.staticPath = path.resolve(staticPath);
        this.port = port;
        this.setupRoutes();
    }
    setupRoutes() {
        // Serve static files
        this.app.use('/static', express.static(this.staticPath));
        // Serve generated markdown as HTML
        this.app.use('/', express.static(this.staticPath));
        // Root redirect
        this.app.get('/', (req, res) => {
            res.redirect('/index.html');
        });
    }
    start() {
        this.app.listen(this.port, () => {
            console.log(`Static server running on http://localhost:${this.port}`);
            console.log(`Serving files from: ${this.staticPath}`);
        });
    }
}
// Start server if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const staticPath = process.argv[2] || '../generated';
    const port = process.env.PORT ? parseInt(process.env.PORT) : 3001;
    const server = new StaticServer(staticPath, port);
    server.start();
}
export default StaticServer;
//# sourceMappingURL=static-server.js.map