#!/usr/bin/env node

import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import yaml from 'yaml';
import MarkdownIt from 'markdown-it';
import matter from 'gray-matter';
import Mustache from 'mustache';

interface HierarchicalEntity {
  name?: string;
  type?: string;
  parent?: string;
  description?: string;
  children?: Record<string, HierarchicalEntity>;
  [key: string]: any;
}

class AetheriaHttpServer {
  private app: express.Application;
  private docsPath: string;
  private dataPath: string;
  private templatesPath: string;
  private md: MarkdownIt;
  private port: number;

  constructor(port: number = 3000) {
    this.app = express();
    this.docsPath = path.resolve('../docs');
    this.dataPath = path.resolve('../data');
    this.templatesPath = path.resolve('../templates');
    this.md = new MarkdownIt();
    this.port = port;

    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Serve static assets
    this.app.use('/static', express.static(this.docsPath));

    // API endpoints
    this.app.get('/api/docs', this.listDocs.bind(this));
    this.app.get('/api/docs/:filename', this.getDoc.bind(this));
    this.app.get('/api/data', this.listData.bind(this));
    this.app.get('/api/data/:type', this.getData.bind(this));
    this.app.get('/api/hierarchy/:type', this.getHierarchy.bind(this));
    this.app.get('/api/hierarchy/:type/:entity', this.getHierarchyEntity.bind(this));
    this.app.get('/api/search', this.search.bind(this));

    // Dynamic markdown generation
    this.app.get('/generate/:type', this.generateContent.bind(this));
    this.app.get('/generate/:type/:name', this.generateNamedContent.bind(this));

    // Serve existing docs as HTML
    this.app.get('/docs/:filename', this.serveDocAsHtml.bind(this));

    // Root endpoint
    this.app.get('/', this.serveIndex.bind(this));
  }

  private async listDocs(req: express.Request, res: express.Response): Promise<void> {
    try {
      const files = await fs.readdir(this.docsPath);
      const mdFiles = files.filter(file => file.endsWith('.md'));
      res.json(mdFiles);
    } catch (error) {
      res.status(500).json({ error: 'Failed to list documentation files' });
    }
  }

  private async getDoc(req: express.Request, res: express.Response): Promise<void> {
    try {
      const filename = req.params.filename;
      if (!filename.endsWith('.md')) {
        res.status(400).json({ error: 'Only markdown files are supported' });
        return;
      }

      const filePath = path.join(this.docsPath, filename);
      const content = await fs.readFile(filePath, 'utf-8');
      const parsed = matter(content);

      res.json({
        frontmatter: parsed.data,
        content: parsed.content,
        html: this.md.render(parsed.content),
        filename
      });
    } catch (error) {
      res.status(404).json({ error: 'Document not found' });
    }
  }

  private async listData(req: express.Request, res: express.Response): Promise<void> {
    try {
      const files = await fs.readdir(this.dataPath);
      const yamlFiles = files.filter(file => file.endsWith('.yaml') || file.endsWith('.yml'));
      const types = yamlFiles.map(file => path.parse(file).name);
      res.json(types);
    } catch (error) {
      res.status(500).json({ error: 'Failed to list data files' });
    }
  }

  private async getData(req: express.Request, res: express.Response): Promise<void> {
    try {
      const type = req.params.type;
      const filePath = path.join(this.dataPath, `${type}.yaml`);
      const content = await fs.readFile(filePath, 'utf-8');
      const data = yaml.parse(content);
      res.json(data);
    } catch (error) {
      res.status(404).json({ error: 'Data file not found' });
    }
  }

  private async getHierarchy(req: express.Request, res: express.Response): Promise<void> {
    try {
      const type = req.params.type;
      const data = await this.loadYamlData(type);

      if (!data) {
        res.status(404).json({ error: 'Hierarchy type not found' });
        return;
      }

      // Return the root level of the hierarchy
      res.json(Object.keys(data));
    } catch (error) {
      res.status(500).json({ error: 'Failed to load hierarchy' });
    }
  }

  private async getHierarchyEntity(req: express.Request, res: express.Response): Promise<void> {
    try {
      const { type, entity } = req.params;
      const includeChildren = req.query.includeChildren === 'true';
      const includeParents = req.query.includeParents === 'true';

      const data = await this.loadYamlData(type);
      if (!data) {
        res.status(404).json({ error: 'Hierarchy type not found' });
        return;
      }

      const entityData = this.findEntityInHierarchy(data, entity);
      if (!entityData) {
        res.status(404).json({ error: 'Entity not found in hierarchy' });
        return;
      }

      let result: any = { ...entityData };

      if (includeParents) {
        result.parents = this.getParentChain(data, entity);
      }

      if (includeChildren) {
        result.allChildren = this.getAllChildren(entityData);
      }

      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get hierarchy entity' });
    }
  }

  private async search(req: express.Request, res: express.Response): Promise<void> {
    try {
      const query = req.query.q as string;
      const category = req.query.category as string;

      if (!query) {
        res.status(400).json({ error: 'Query parameter "q" is required' });
        return;
      }

      const results: any[] = [];

      // Search in documentation
      if (!category || category === 'docs') {
        const docResults = await this.searchDocs(query);
        results.push(...docResults);
      }

      // Search in data
      if (!category || category === 'data') {
        const dataResults = await this.searchData(query);
        results.push(...dataResults);
      }

      res.json({
        query,
        category: category || 'all',
        count: results.length,
        results
      });
    } catch (error) {
      res.status(500).json({ error: 'Search failed' });
    }
  }

  private async generateContent(req: express.Request, res: express.Response): Promise<void> {
    try {
      const type = req.params.type;
      const name = req.query.name as string;

      const templatePath = path.join(this.templatesPath, `${type}.md`);

      try {
        await fs.access(templatePath);
      } catch {
        res.status(404).json({ error: 'Template not found' });
        return;
      }

      const template = await fs.readFile(templatePath, 'utf-8');

      let data: any = {};
      if (name) {
        // Try to find the entity in various data files
        const dataTypes = ['creatures', 'magic_schools', 'organizations', 'classes', 'equipment'];
        for (const dataType of dataTypes) {
          const yamlData = await this.loadYamlData(dataType);
          if (yamlData) {
            const entity = this.findEntityInHierarchy(yamlData, name);
            if (entity) {
              data = { ...entity, type: dataType };
              break;
            }
          }
        }
      }

      const content = Mustache.render(template, data);

      res.setHeader('Content-Type', 'text/markdown');
      res.send(content);
    } catch (error) {
      res.status(500).json({ error: 'Failed to generate content' });
    }
  }

  private async generateNamedContent(req: express.Request, res: express.Response): Promise<void> {
    req.query.name = req.params.name;
    return this.generateContent(req, res);
  }

  private async serveDocAsHtml(req: express.Request, res: express.Response): Promise<void> {
    try {
      const filename = req.params.filename;
      if (!filename.endsWith('.md')) {
        res.status(400).json({ error: 'Only markdown files are supported' });
        return;
      }

      const filePath = path.join(this.docsPath, filename);
      const content = await fs.readFile(filePath, 'utf-8');
      const parsed = matter(content);
      const html = this.md.render(parsed.content);

      const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${parsed.data.title || filename}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        code { background-color: #f4f4f4; padding: 2px 4px; border-radius: 3px; }
        pre { background-color: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
    </style>
</head>
<body>
    <nav><a href="/">← Back to Index</a></nav>
    ${html}
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html');
      res.send(fullHtml);
    } catch (error) {
      res.status(404).send('<h1>Document not found</h1>');
    }
  }

  private async serveIndex(req: express.Request, res: express.Response): Promise<void> {
    try {
      const docs = await fs.readdir(this.docsPath);
      const mdFiles = docs.filter(file => file.endsWith('.md'));

      const dataFiles = await fs.readdir(this.dataPath);
      const yamlFiles = dataFiles.filter(file => file.endsWith('.yaml') || file.endsWith('.yml'));

      const templateFiles = await fs.readdir(this.templatesPath);
      const templates = templateFiles.filter(file => file.endsWith('.md'));

      const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aetheria World Data</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; }
        .section { margin: 20px 0; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
        .card { border: 1px solid #ddd; padding: 15px; border-radius: 5px; }
        .card h3 { margin-top: 0; }
        ul { list-style: none; padding: 0; }
        li { margin: 5px 0; }
        a { color: #0066cc; text-decoration: none; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <h1>Aetheria World Data Server</h1>

    <div class="grid">
        <div class="card">
            <h3>📚 Documentation</h3>
            <ul>
                ${mdFiles.map(file => `<li><a href="/docs/${file}">${file}</a></li>`).join('')}
            </ul>
        </div>

        <div class="card">
            <h3>📊 Data Files</h3>
            <ul>
                ${yamlFiles.map(file => {
                  const name = path.parse(file).name;
                  return `<li><a href="/api/data/${name}">${name}</a></li>`;
                }).join('')}
            </ul>
        </div>

        <div class="card">
            <h3>🔧 Generate Content</h3>
            <ul>
                ${templates.map(file => {
                  const name = path.parse(file).name;
                  return `<li><a href="/generate/${name}">${name}</a></li>`;
                }).join('')}
            </ul>
        </div>
    </div>

    <div class="section">
        <h2>API Endpoints</h2>
        <ul>
            <li><code>GET /api/docs</code> - List all documentation files</li>
            <li><code>GET /api/docs/:filename</code> - Get specific document with HTML</li>
            <li><code>GET /api/data</code> - List all data types</li>
            <li><code>GET /api/data/:type</code> - Get specific data type</li>
            <li><code>GET /api/hierarchy/:type</code> - Get hierarchy root</li>
            <li><code>GET /api/hierarchy/:type/:entity</code> - Get specific entity</li>
            <li><code>GET /api/search?q=query&category=docs|data</code> - Search content</li>
            <li><code>GET /generate/:type</code> - Generate content from template</li>
            <li><code>GET /generate/:type/:name</code> - Generate content for specific entity</li>
        </ul>
    </div>
</body>
</html>`;

      res.setHeader('Content-Type', 'text/html');
      res.send(html);
    } catch (error) {
      res.status(500).send('<h1>Server Error</h1>');
    }
  }

  // Helper methods (similar to MCP server)
  private async loadYamlData(type: string): Promise<any> {
    try {
      const filePath = path.join(this.dataPath, `${type}.yaml`);
      const content = await fs.readFile(filePath, 'utf-8');
      return yaml.parse(content);
    } catch {
      return null;
    }
  }

  private findEntityInHierarchy(data: any, entityName: string): HierarchicalEntity | null {
    const search = (obj: any): HierarchicalEntity | null => {
      if (typeof obj !== 'object' || obj === null) return null;

      for (const [key, value] of Object.entries(obj)) {
        if (key.toLowerCase() === entityName.toLowerCase()) {
          return value as HierarchicalEntity;
        }

        if (typeof value === 'object' && value !== null) {
          const result = search(value);
          if (result) return result;
        }
      }
      return null;
    };

    return search(data);
  }

  private getParentChain(data: any, entityName: string): string[] {
    const findPath = (obj: any, target: string, path: string[] = []): string[] | null => {
      if (typeof obj !== 'object' || obj === null) return null;

      for (const [key, value] of Object.entries(obj)) {
        const currentPath = [...path, key];

        if (key.toLowerCase() === target.toLowerCase()) {
          return currentPath.slice(0, -1); // Exclude the target itself
        }

        if (typeof value === 'object' && value !== null) {
          const result = findPath(value, target, currentPath);
          if (result) return result;
        }
      }
      return null;
    };

    return findPath(data, entityName) || [];
  }

  private getAllChildren(entity: HierarchicalEntity): string[] {
    const children: string[] = [];

    if (entity.children) {
      for (const childName of Object.keys(entity.children)) {
        children.push(childName);
        children.push(...this.getAllChildren(entity.children[childName]));
      }
    }

    return children;
  }

  private async searchDocs(query: string): Promise<any[]> {
    const results: any[] = [];

    try {
      const files = await fs.readdir(this.docsPath);
      const mdFiles = files.filter(file => file.endsWith('.md'));

      for (const file of mdFiles) {
        const filePath = path.join(this.docsPath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        const parsed = matter(content);

        if (content.toLowerCase().includes(query.toLowerCase())) {
          results.push({
            type: 'document',
            file,
            title: parsed.data.title || file,
            match: this.extractMatch(content, query),
            url: `/docs/${file}`
          });
        }
      }
    } catch (error) {
      // Ignore errors in search
    }

    return results;
  }

  private async searchData(query: string): Promise<any[]> {
    const results: any[] = [];

    try {
      const files = await fs.readdir(this.dataPath);
      const yamlFiles = files.filter(file => file.endsWith('.yaml') || file.endsWith('.yml'));

      for (const file of yamlFiles) {
        const type = path.parse(file).name;
        const data = await this.loadYamlData(type);

        if (data) {
          const matches = this.searchInObject(data, query);
          results.push(...matches.map(match => ({
            type: 'data',
            dataType: type,
            entity: match.path,
            match: match.value,
            url: `/api/hierarchy/${type}/${match.path}`
          })));
        }
      }
    } catch (error) {
      // Ignore errors in search
    }

    return results;
  }

  private extractMatch(content: string, query: string): string {
    const lines = content.split('\n');
    const queryLower = query.toLowerCase();

    for (const line of lines) {
      if (line.toLowerCase().includes(queryLower)) {
        return line.trim();
      }
    }

    return '';
  }

  private searchInObject(obj: any, query: string, path: string = ''): Array<{path: string, value: string}> {
    const results: Array<{path: string, value: string}> = [];
    const queryLower = query.toLowerCase();

    const search = (current: any, currentPath: string) => {
      if (typeof current === 'string' && current.toLowerCase().includes(queryLower)) {
        results.push({ path: currentPath, value: current });
      } else if (typeof current === 'object' && current !== null) {
        for (const [key, value] of Object.entries(current)) {
          const newPath = currentPath ? `${currentPath}.${key}` : key;
          search(value, newPath);
        }
      }
    };

    search(obj, path);
    return results;
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Aetheria HTTP Server running on http://localhost:${this.port}`);
      console.log(`\nAvailable endpoints:`);
      console.log(`  http://localhost:${this.port}/              - Web interface`);
      console.log(`  http://localhost:${this.port}/api/docs      - List documentation`);
      console.log(`  http://localhost:${this.port}/api/data      - List data types`);
      console.log(`  http://localhost:${this.port}/generate/     - Generate content`);
    });
  }
}

// Start server if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
  const server = new AetheriaHttpServer(port);
  server.start();
}

export default AetheriaHttpServer;
