#!/usr/bin/env node
declare class AetheriaStaticGenerator {
    private dataPath;
    private templatesPath;
    private outputPath;
    constructor(outputPath?: string);
    generate(): Promise<void>;
    private generateIndex;
    private generateForDataType;
    private generateDataTypeIndex;
    private generateEntityFiles;
    private generateEntityFile;
    private generateBasicEntityMarkdown;
    private objectToMarkdown;
    private getAllEntities;
    private renderHierarchyText;
    private capitalize;
    private sanitizeFilename;
}
export default AetheriaStaticGenerator;
//# sourceMappingURL=generator.d.ts.map