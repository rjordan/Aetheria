#!/usr/bin/env node
import fs from 'fs/promises';
import path from 'path';
import yaml from 'yaml';
import Mustache from 'mustache';
class AetheriaStaticGenerator {
    dataPath;
    templatesPath;
    outputPath;
    constructor(outputPath = '../generated') {
        this.dataPath = path.resolve('../data');
        this.templatesPath = path.resolve('../templates');
        this.outputPath = path.resolve(outputPath);
    }
    async generate() {
        console.log('🚀 Starting Aetheria static generation...');
        // Ensure output directory exists
        await fs.mkdir(this.outputPath, { recursive: true });
        // Generate index
        await this.generateIndex();
        // Generate content for each data type
        const dataFiles = await fs.readdir(this.dataPath);
        const yamlFiles = dataFiles.filter(file => file.endsWith('.yaml') || file.endsWith('.yml'));
        for (const file of yamlFiles) {
            const dataType = path.parse(file).name;
            console.log(`📊 Processing ${dataType}...`);
            await this.generateForDataType(dataType);
        }
        console.log(`✅ Generation complete! Files created in: ${this.outputPath}`);
    }
    async generateIndex() {
        const dataFiles = await fs.readdir(this.dataPath);
        const yamlFiles = dataFiles.filter(file => file.endsWith('.yaml') || file.endsWith('.yml'));
        const dataTypes = yamlFiles.map(file => path.parse(file).name);
        const templateFiles = await fs.readdir(this.templatesPath);
        const templates = templateFiles.filter(file => file.endsWith('.md'));
        const indexContent = `# Aetheria Generated Content

This directory contains generated markdown files from the Aetheria world data.

## Data Types

${dataTypes.map(type => `- [${type}](${type}/index.md)`).join('\n')}

## Available Templates

${templates.map(template => {
            const name = path.parse(template).name;
            return `- ${name}`;
        }).join('\n')}

## Generation Info

- Generated on: ${new Date().toISOString()}
- Source data: \`../data/\`
- Templates: \`../templates/\`

## File Structure

\`\`\`
generated/
├── index.md (this file)
${dataTypes.map(type => `├── ${type}/
│   ├── index.md
│   └── [entities].md`).join('\n')}
\`\`\`
`;
        await fs.writeFile(path.join(this.outputPath, 'index.md'), indexContent);
    }
    async generateForDataType(dataType) {
        const dataFilePath = path.join(this.dataPath, `${dataType}.yaml`);
        const content = await fs.readFile(dataFilePath, 'utf-8');
        const data = yaml.parse(content);
        // Create directory for this data type
        const typeDir = path.join(this.outputPath, dataType);
        await fs.mkdir(typeDir, { recursive: true });
        // Generate index for this data type
        await this.generateDataTypeIndex(dataType, data, typeDir);
        // Generate individual entity files
        await this.generateEntityFiles(dataType, data, typeDir);
    }
    async generateDataTypeIndex(dataType, data, outputDir) {
        const entities = this.getAllEntities(data);
        const indexContent = `# ${this.capitalize(dataType)}

## Overview

This section contains all ${dataType} from the Aetheria world.

## Entities (${entities.length})

${entities.map(entity => `- [${entity.name || entity.key}](${this.sanitizeFilename(entity.name || entity.key)}.md)`).join('\n')}

## Hierarchy

\`\`\`
${this.renderHierarchyText(data)}
\`\`\`

---
*Generated from \`../data/${dataType}.yaml\`*
`;
        await fs.writeFile(path.join(outputDir, 'index.md'), indexContent);
    }
    async generateEntityFiles(dataType, data, outputDir) {
        const entities = this.getAllEntities(data);
        for (const entity of entities) {
            await this.generateEntityFile(dataType, entity, outputDir);
        }
    }
    async generateEntityFile(dataType, entity, outputDir) {
        const entityName = entity.name || entity.key;
        const filename = this.sanitizeFilename(entityName) + '.md';
        // Try to find a matching template
        const templateFiles = await fs.readdir(this.templatesPath);
        let template = null;
        // Look for specific template for this data type
        const specificTemplate = `${dataType.slice(0, -1)}_stat_block.md`; // creatures -> creature_stat_block.md
        if (templateFiles.includes(specificTemplate)) {
            template = await fs.readFile(path.join(this.templatesPath, specificTemplate), 'utf-8');
        }
        else if (templateFiles.includes('generic_entity.md')) {
            template = await fs.readFile(path.join(this.templatesPath, 'generic_entity.md'), 'utf-8');
        }
        let content;
        if (template) {
            // Use template
            content = Mustache.render(template, {
                ...entity,
                dataType,
                entityName,
                generatedDate: new Date().toISOString()
            });
        }
        else {
            // Generate basic markdown
            content = this.generateBasicEntityMarkdown(entityName, entity, dataType);
        }
        await fs.writeFile(path.join(outputDir, filename), content);
    }
    generateBasicEntityMarkdown(entityName, entity, dataType) {
        let content = `# ${entityName}\n\n`;
        if (entity.description) {
            content += `${entity.description}\n\n`;
        }
        if (entity.type && entity.type !== entityName) {
            content += `**Type:** ${entity.type}\n\n`;
        }
        // Add properties
        const excludeKeys = ['name', 'description', 'children'];
        const properties = Object.entries(entity).filter(([key]) => !excludeKeys.includes(key));
        if (properties.length > 0) {
            content += `## Properties\n\n`;
            for (const [key, value] of properties) {
                if (typeof value === 'string' || typeof value === 'number') {
                    content += `- **${this.capitalize(key)}:** ${value}\n`;
                }
                else if (Array.isArray(value)) {
                    content += `- **${this.capitalize(key)}:** ${value.join(', ')}\n`;
                }
                else if (typeof value === 'object' && value !== null) {
                    content += `- **${this.capitalize(key)}:**\n`;
                    content += this.objectToMarkdown(value, 2);
                }
            }
            content += '\n';
        }
        // Add children if they exist
        if (entity.children && Object.keys(entity.children).length > 0) {
            content += `## Subtypes\n\n`;
            for (const childName of Object.keys(entity.children)) {
                content += `- [${childName}](${this.sanitizeFilename(childName)}.md)\n`;
            }
            content += '\n';
        }
        content += `---\n*Part of ${dataType} • Generated on ${new Date().toISOString()}*\n`;
        return content;
    }
    objectToMarkdown(obj, indent = 0) {
        const spaces = '  '.repeat(indent);
        let result = '';
        for (const [key, value] of Object.entries(obj)) {
            if (typeof value === 'string' || typeof value === 'number') {
                result += `${spaces}- **${this.capitalize(key)}:** ${value}\n`;
            }
            else if (Array.isArray(value)) {
                result += `${spaces}- **${this.capitalize(key)}:** ${value.join(', ')}\n`;
            }
            else if (typeof value === 'object' && value !== null) {
                result += `${spaces}- **${this.capitalize(key)}:**\n`;
                result += this.objectToMarkdown(value, indent + 1);
            }
        }
        return result;
    }
    getAllEntities(data, path = '') {
        const entities = [];
        const traverse = (obj, currentPath) => {
            if (typeof obj === 'object' && obj !== null) {
                for (const [key, value] of Object.entries(obj)) {
                    const newPath = currentPath ? `${currentPath}.${key}` : key;
                    if (typeof value === 'object' && value !== null) {
                        // This is an entity
                        entities.push({
                            key,
                            name: value.name || key,
                            path: newPath,
                            data: value
                        });
                        // Check for children
                        if (value.children) {
                            traverse(value.children, newPath);
                        }
                    }
                }
            }
        };
        traverse(data, path);
        return entities;
    }
    renderHierarchyText(data, indent = 0) {
        const spaces = '  '.repeat(indent);
        let result = '';
        for (const [key, value] of Object.entries(data)) {
            result += `${spaces}${key}\n`;
            if (typeof value === 'object' && value !== null && value.children) {
                result += this.renderHierarchyText(value.children, indent + 1);
            }
        }
        return result;
    }
    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
    }
    sanitizeFilename(name) {
        return name.toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }
}
// Create a generic entity template if it doesn't exist
async function ensureGenericTemplate() {
    const templatesPath = path.resolve('../templates');
    const genericTemplatePath = path.join(templatesPath, 'generic_entity.md');
    try {
        await fs.access(genericTemplatePath);
    }
    catch {
        // Create generic template
        const genericTemplate = `# {{entityName}}

{{#description}}
{{description}}
{{/description}}

{{#type}}
**Type:** {{type}}
{{/type}}

## Properties

{{#properties}}
- **{{key}}:** {{value}}
{{/properties}}

{{#children}}
## Subtypes

{{#.}}
- {{.}}
{{/.}}
{{/children}}

---
*Part of {{dataType}} • Generated on {{generatedDate}}*
`;
        await fs.writeFile(genericTemplatePath, genericTemplate);
        console.log('📝 Created generic entity template');
    }
}
// Run generator if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const outputPath = process.argv[2] || '../generated';
    (async () => {
        try {
            await ensureGenericTemplate();
            const generator = new AetheriaStaticGenerator(outputPath);
            await generator.generate();
        }
        catch (error) {
            console.error('❌ Generation failed:', error);
            process.exit(1);
        }
    })();
}
export default AetheriaStaticGenerator;
//# sourceMappingURL=generator.js.map