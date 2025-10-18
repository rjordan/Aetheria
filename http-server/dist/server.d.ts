#!/usr/bin/env node
declare class AetheriaHttpServer {
    private app;
    private docsPath;
    private dataPath;
    private templatesPath;
    private md;
    private port;
    constructor(port?: number);
    private setupRoutes;
    private listDocs;
    private getDoc;
    private listData;
    private getData;
    private getHierarchy;
    private getHierarchyEntity;
    private search;
    private generateContent;
    private generateNamedContent;
    private serveDocAsHtml;
    private serveIndex;
    private loadYamlData;
    private findEntityInHierarchy;
    private getParentChain;
    private getAllChildren;
    private searchDocs;
    private searchData;
    private extractMatch;
    private searchInObject;
    start(): void;
}
export default AetheriaHttpServer;
//# sourceMappingURL=server.d.ts.map