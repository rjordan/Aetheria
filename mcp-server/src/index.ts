#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  CallToolRequest,
  ListResourcesRequest,
  ReadResourceRequest,
  ListToolsRequest,
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'fs/promises';
import path from 'path';
import yaml from 'yaml';
import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';
import Mustache from 'mustache';

interface AetheriaResource {
  uri: string;
  mimeType: string;
  name: string;
}

interface MarkdownContent {
  frontmatter: Record<string, any>;
  content: string;
  metadata: {
    file: string;
    category: string;
    lastModified?: Date;
  };
}

interface HierarchicalData {
  [key: string]: any;
}

interface HierarchicalEntity {
  name?: string;
  type?: string;
  parent?: string;
  description?: string;
  children?: Record<string, HierarchicalEntity>;
  [key: string]: any;
}

interface SearchResult {
  file: string;
  category: string;
  matches: string[];
  frontmatter: Record<string, any>;
  context?: string;
}

interface GenerationParameters {
  template?: string;
  includeHierarchy?: boolean;
  format?: 'markdown' | 'json' | 'yaml';
  [key: string]: any;
}

class AetheriaMCPServer {
  private server: Server;
  private docsPath: string;
  private dataPath: string;
  private templatesPath: string;
  private md: MarkdownIt;
  private markdownCache: Map<string, MarkdownContent> = new Map();
  private hierarchyCache: Map<string, HierarchicalData> = new Map();

  constructor() {
    this.server = new Server(
      {
        name: 'aetheria-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.docsPath = path.resolve('../docs');
    this.dataPath = path.resolve('../data');
    this.templatesPath = path.resolve('../templates');
    this.md = new MarkdownIt();
    this.setupHandlers();
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListResourcesRequestSchema, async (request: ListResourcesRequest) => {
      const resources: AetheriaResource[] = [];

      // Add static markdown resources
      const markdownFiles = await this.findMarkdownFiles();
      for (const file of markdownFiles) {
        const relativePath = path.relative(this.docsPath, file);
        resources.push({
          uri: `aetheria://docs/${relativePath}`,
          mimeType: 'text/markdown',
          name: path.basename(file, '.md'),
        });
      }

      // Add structured data resources
      const dataFiles = await this.findDataFiles();
      for (const file of dataFiles) {
        const relativePath = path.relative(this.dataPath, file);
        resources.push({
          uri: `aetheria://data/${relativePath}`,
          mimeType: 'application/json',
          name: path.basename(file, path.extname(file)),
        });
      }

      return { resources };
    });

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request: ReadResourceRequest) => {
      const { uri } = request.params;

      if (uri.startsWith('aetheria://docs/')) {
        const relativePath = uri.replace('aetheria://docs/', '');
        const filePath = path.join(this.docsPath, relativePath);
        const content = await fs.readFile(filePath, 'utf-8');

        return {
          contents: [{
            uri,
            mimeType: 'text/markdown',
            text: content,
          }],
        };
      }

      if (uri.startsWith('aetheria://data/')) {
        const relativePath = uri.replace('aetheria://data/', '');
        const filePath = path.join(this.dataPath, relativePath);
        const content = await fs.readFile(filePath, 'utf-8');

        return {
          contents: [{
            uri,
            mimeType: 'application/json',
            text: content,
          }],
        };
      }

      throw new Error(`Unknown resource: ${uri}`);
    });

    this.server.setRequestHandler(ListToolsRequestSchema, async (request: ListToolsRequest) => {
      return {
        tools: [
          {
            name: 'search_lore',
            description: 'Search through Aetheria lore and documentation with advanced filtering',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query for lore content',
                },
                category: {
                  type: 'string',
                  description: 'Optional category to search within',
                  enum: ['magic', 'politics', 'religion', 'classes', 'equipment', 'alignment', 'anime', 'all'],
                },
                includeContext: {
                  type: 'boolean',
                  description: 'Include surrounding context for matches',
                  default: true,
                },
                maxResults: {
                  type: 'number',
                  description: 'Maximum number of results to return',
                  default: 10,
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'get_hierarchy',
            description: 'Get hierarchical data for creatures, organizations, magic schools, or other structured entities',
            inputSchema: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  description: 'Type of hierarchy to retrieve',
                  enum: ['creatures', 'organizations', 'magic_schools', 'locations', 'classes', 'equipment'],
                },
                entity: {
                  type: 'string',
                  description: 'Specific entity to get hierarchy for (optional)',
                },
                includeChildren: {
                  type: 'boolean',
                  description: 'Include child entities in the hierarchy',
                  default: true,
                },
                includeParents: {
                  type: 'boolean',
                  description: 'Include parent entities in the hierarchy',
                  default: true,
                },
              },
              required: ['type'],
            },
          },
          {
            name: 'generate_content',
            description: 'Generate dynamic content based on templates and data with support for existing markdown data',
            inputSchema: {
              type: 'object',
              properties: {
                type: {
                  type: 'string',
                  description: 'Type of content to generate',
                  enum: [
                    'creature_stat_block',
                    'magic_school_description',
                    'character_class_guide',
                    'equipment_catalog',
                    'political_overview',
                    'location_description',
                    'character_profile'
                  ],
                },
                name: {
                  type: 'string',
                  description: 'Name of the entity to generate content for',
                },
                parameters: {
                  type: 'object',
                  description: 'Additional parameters for generation',
                },
              },
              required: ['type', 'name'],
            },
          },
          {
            name: 'extract_data',
            description: 'Extract structured data from markdown tables and content',
            inputSchema: {
              type: 'object',
              properties: {
                source: {
                  type: 'string',
                  description: 'Source document to extract from',
                  enum: ['magic', 'politics', 'classes', 'equipment', 'religion', 'alignment', 'anime'],
                },
                dataType: {
                  type: 'string',
                  description: 'Type of data to extract',
                  enum: ['tables', 'lists', 'definitions', 'all'],
                },
                format: {
                  type: 'string',
                  description: 'Output format',
                  enum: ['json', 'yaml', 'markdown'],
                  default: 'json',
                },
              },
              required: ['source'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params;

      if (!args) {
        throw new Error('No arguments provided');
      }

      switch (name) {
        case 'search_lore':
          return await this.searchLore(
            args.query as string,
            args.category as string,
            args.includeContext as boolean,
            args.maxResults as number
          );
        case 'get_hierarchy':
          return await this.getHierarchy(
            args.type as string,
            args.entity as string,
            args.includeChildren as boolean,
            args.includeParents as boolean
          );
        case 'generate_content':
          return await this.generateContent(
            args.type as string,
            args.name as string,
            args.parameters as GenerationParameters
          );
        case 'extract_data':
          return await this.extractData(
            args.source as string,
            args.dataType as string,
            args.format as string
          );
        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  private async findMarkdownFiles(): Promise<string[]> {
    const files: string[] = [];
    try {
      const entries = await fs.readdir(this.docsPath, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.md')) {
          files.push(path.join(this.docsPath, entry.name));
        }
      }
    } catch (error) {
      console.error('Error reading docs directory:', error);
    }
    return files;
  }

  private async findDataFiles(): Promise<string[]> {
    const files: string[] = [];
    try {
      const entries = await fs.readdir(this.dataPath, { withFileTypes: true, recursive: true });
      for (const entry of entries) {
        if (entry.isFile() && (entry.name.endsWith('.json') || entry.name.endsWith('.yaml') || entry.name.endsWith('.yml'))) {
          files.push(path.join(this.dataPath, entry.name));
        }
      }
    } catch (error) {
      console.error('Error reading data directory:', error);
    }
    return files;
  }

  private async loadMarkdownContent(filePath: string): Promise<MarkdownContent> {
    const cacheKey = filePath;
    if (this.markdownCache.has(cacheKey)) {
      return this.markdownCache.get(cacheKey)!;
    }

    const content = await fs.readFile(filePath, 'utf-8');
    const { data: frontmatter, content: markdown } = matter(content);
    const stats = await fs.stat(filePath);

    const markdownContent: MarkdownContent = {
      frontmatter,
      content: markdown,
      metadata: {
        file: path.basename(filePath, '.md'),
        category: path.basename(filePath, '.md').toLowerCase(),
        lastModified: stats.mtime,
      },
    };

    this.markdownCache.set(cacheKey, markdownContent);
    return markdownContent;
  }

  private async searchLore(
    query: string,
    category: string = 'all',
    includeContext: boolean = true,
    maxResults: number = 10
  ): Promise<any> {
    const results: SearchResult[] = [];
    const markdownFiles = await this.findMarkdownFiles();

    for (const file of markdownFiles) {
      const fileName = path.basename(file, '.md').toLowerCase();

      // Skip if category specified and doesn't match
      if (category !== 'all' && !fileName.includes(category.toLowerCase())) {
        continue;
      }

      const markdownContent = await this.loadMarkdownContent(file);
      const content = markdownContent.content;

      // Enhanced search with context
      if (content.toLowerCase().includes(query.toLowerCase())) {
        const lines = content.split('\n');
        const matchingLines: string[] = [];
        const contextLines: string[] = [];

        for (let i = 0; i < lines.length; i++) {
          if (lines[i].toLowerCase().includes(query.toLowerCase())) {
            matchingLines.push(lines[i]);

            if (includeContext) {
              // Add context lines before and after
              const start = Math.max(0, i - 2);
              const end = Math.min(lines.length, i + 3);
              const context = lines.slice(start, end).join('\n');
              contextLines.push(context);
            }
          }
        }

        results.push({
          file: fileName,
          category: markdownContent.metadata.category,
          matches: matchingLines.slice(0, 5),
          frontmatter: markdownContent.frontmatter,
          context: includeContext ? contextLines.join('\n---\n') : undefined,
        });
      }
    }

    const limitedResults = results.slice(0, maxResults);

    return {
      content: [{
        type: 'text',
        text: `Found ${limitedResults.length} matches for "${query}" (total: ${results.length}):\n\n${JSON.stringify(limitedResults, null, 2)}`,
      }],
    };
  }

  private async getHierarchy(
    type: string,
    entity?: string,
    includeChildren: boolean = true,
    includeParents: boolean = true
  ): Promise<any> {
    try {
      let data: HierarchicalData;

      // First try to load from YAML data files
      try {
        const dataFile = path.join(this.dataPath, `${type}.yaml`);
        const content = await fs.readFile(dataFile, 'utf-8');
        data = yaml.parse(content);
      } catch {
        // If no YAML file, try to extract from markdown
        data = await this.extractHierarchyFromMarkdown(type);
      }

      if (entity) {
        const found = this.findInHierarchy(data, entity, includeChildren, includeParents);
        return {
          content: [{
            type: 'text',
            text: `Hierarchy for ${entity}:\n\n${JSON.stringify(found, null, 2)}`,
          }],
        };
      }

      return {
        content: [{
          type: 'text',
          text: `${type} hierarchy:\n\n${JSON.stringify(data, null, 2)}`,
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `No hierarchy data found for ${type}. Error: ${(error as Error).message}`,
        }],
      };
    }
  }

  private async extractHierarchyFromMarkdown(type: string): Promise<HierarchicalData> {
    const markdownFiles = await this.findMarkdownFiles();
    const relevantFile = markdownFiles.find(f =>
      path.basename(f, '.md').toLowerCase() === type.toLowerCase()
    );

    if (!relevantFile) {
      throw new Error(`No markdown file found for ${type}`);
    }

    const content = await this.loadMarkdownContent(relevantFile);
    return this.parseTablesFromMarkdown(content.content);
  }

  private parseTablesFromMarkdown(markdown: string): HierarchicalData {
    const lines = markdown.split('\n');
    const tables: HierarchicalData = {};
    let currentTable: any[] = [];
    let currentTableName = '';
    let headers: string[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Table header detection
      if (line.startsWith('|') && line.endsWith('|') && !line.includes('---')) {
        if (headers.length === 0) {
          headers = line.split('|').slice(1, -1).map(h => h.trim());
          // Skip the separator line
          i++;
          currentTable = [];
          // Use previous heading as table name
          for (let j = i - 1; j >= 0; j--) {
            if (lines[j].startsWith('#')) {
              currentTableName = lines[j].replace(/#+\s*/, '').trim();
              break;
            }
          }
        } else {
          // Table row
          const values = line.split('|').slice(1, -1).map(v => v.trim());
          const row: Record<string, string> = {};
          headers.forEach((header, idx) => {
            row[header] = values[idx] || '';
          });
          currentTable.push(row);
        }
      } else if (currentTable.length > 0 && !line.startsWith('|')) {
        // End of table
        if (currentTableName && currentTable.length > 0) {
          tables[currentTableName] = currentTable;
        }
        currentTable = [];
        headers = [];
        currentTableName = '';
      }
    }

    // Handle last table
    if (currentTableName && currentTable.length > 0) {
      tables[currentTableName] = currentTable;
    }

    return tables;
  }

  private findInHierarchy(
    data: HierarchicalData,
    searchTerm: string,
    includeChildren: boolean,
    includeParents: boolean
  ): any {
    const search = (obj: any, path: string[] = []): any => {
      if (typeof obj === 'object' && obj !== null) {
        for (const [key, value] of Object.entries(obj)) {
          const typedValue = value as HierarchicalEntity;
          if (key.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (typedValue?.name && typedValue.name.toLowerCase().includes(searchTerm.toLowerCase()))) {

            const result: any = { path: [...path, key], data: typedValue };

            if (!includeChildren && typedValue?.children) {
              result.data = { ...typedValue };
              delete result.data.children;
            }

            if (includeParents && path.length > 0) {
              result.parentPath = path;
            }

            return result;
          }

          const result = search(value, [...path, key]);
          if (result) return result;
        }
      }
      return null;
    };

    return search(data);
  }  private async generateContent(
    type: string,
    name: string,
    parameters: GenerationParameters = {}
  ): Promise<any> {
    try {
      // Load template
      const templatePath = path.join(this.templatesPath, `${type}.md`);
      let template: string;

      try {
        template = await fs.readFile(templatePath, 'utf-8');
      } catch {
        // Generate a basic template if none exists
        template = await this.generateBasicTemplate(type);
      }

      // Get data for the entity
      const entityData = await this.getEntityData(name, type);

      // Merge with parameters
      const renderData = { ...entityData, ...parameters };

      // Render template
      const rendered = Mustache.render(template, renderData);

      return {
        content: [{
          type: 'text',
          text: rendered,
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error generating ${type} for ${name}: ${(error as Error).message}`,
        }],
      };
    }
  }

  private async getEntityData(name: string, type: string): Promise<any> {
    // Try to find entity in hierarchy data
    const hierarchyType = this.mapTypeToHierarchy(type);
    if (hierarchyType) {
      try {
        const hierarchy = await this.getHierarchy(hierarchyType, name);
        if (hierarchy.content[0].text.includes('Hierarchy for')) {
          const data = JSON.parse(hierarchy.content[0].text.split('\n\n')[1]);
          return data.data || {};
        }
      } catch {
        // Continue to markdown extraction
      }
    }

    // Try to extract from markdown
    const markdownFiles = await this.findMarkdownFiles();
    for (const file of markdownFiles) {
      const content = await this.loadMarkdownContent(file);
      const tables = this.parseTablesFromMarkdown(content.content);

      for (const [tableName, tableData] of Object.entries(tables)) {
        if (Array.isArray(tableData)) {
          const found = tableData.find((row: any) =>
            Object.values(row).some((value: any) =>
              typeof value === 'string' && value.toLowerCase().includes(name.toLowerCase())
            )
          );
          if (found) {
            return { ...found, name, type, source: tableName };
          }
        }
      }
    }

    return { name, type };
  }

  private mapTypeToHierarchy(type: string): string | null {
    const mappings: Record<string, string> = {
      'creature_stat_block': 'creatures',
      'magic_school_description': 'magic_schools',
      'character_class_guide': 'classes',
      'equipment_catalog': 'equipment',
      'political_overview': 'organizations',
    };
    return mappings[type] || null;
  }

  private async generateBasicTemplate(type: string): Promise<string> {
    const templates: Record<string, string> = {
      'creature_stat_block': `# {{name}}
*{{type}}*

## Description
{{description}}

{{#challenge_rating}}**Challenge Rating:** {{challenge_rating}}{{/challenge_rating}}
{{#abilities}}
## Abilities
{{#abilities}}
- {{.}}
{{/abilities}}
{{/abilities}}

---
*Generated from Aetheria data*`,

      'character_class_guide': `# {{name}} Class Guide

## Description
{{description}}

{{#alternative_names}}**Alternative Names:** {{alternative_names}}{{/alternative_names}}
{{#weapons_armor}}**Typical Equipment:** {{weapons_armor}}{{/weapons_armor}}

---
*Generated from Aetheria class data*`,
    };

    return templates[type] || `# {{name}}\n\n{{description}}\n\n---\n*Generated content*`;
  }

  private async extractData(
    source: string,
    dataType: string = 'all',
    format: string = 'json'
  ): Promise<any> {
    try {
      const markdownFiles = await this.findMarkdownFiles();
      const relevantFile = markdownFiles.find(f =>
        path.basename(f, '.md').toLowerCase() === source.toLowerCase()
      );

      if (!relevantFile) {
        throw new Error(`No markdown file found for ${source}`);
      }

      const content = await this.loadMarkdownContent(relevantFile);
      const extracted = this.parseTablesFromMarkdown(content.content);

      let result: any;
      switch (format) {
        case 'yaml':
          result = yaml.stringify(extracted);
          break;
        case 'markdown':
          result = this.convertToMarkdown(extracted);
          break;
        default:
          result = JSON.stringify(extracted, null, 2);
      }

      return {
        content: [{
          type: 'text',
          text: `Extracted data from ${source}:\n\n${result}`,
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Error extracting data from ${source}: ${(error as Error).message}`,
        }],
      };
    }
  }

  private convertToMarkdown(data: HierarchicalData): string {
    let markdown = '';

    for (const [tableName, tableData] of Object.entries(data)) {
      markdown += `## ${tableName}\n\n`;

      if (Array.isArray(tableData) && tableData.length > 0) {
        const headers = Object.keys(tableData[0]);
        markdown += `|${headers.join('|')}|\n`;
        markdown += `|${headers.map(() => '---').join('|')}|\n`;

        for (const row of tableData) {
          markdown += `|${headers.map(h => row[h] || '').join('|')}|\n`;
        }
        markdown += '\n';
      }
    }

    return markdown;
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Aetheria MCP server running on stdio');
  }
}

const server = new AetheriaMCPServer();
server.run().catch(console.error);
