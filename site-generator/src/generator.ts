#!/usr/bin/env node

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

interface PageData {
  title: string;
  content: string;
  path: string;
  category?: string;
  lastModified?: Date;
}

class AetheriaStaticSiteGenerator {
  private dataPath: string;
  private templatesPath: string;
  private docsPath: string;
  private outputPath: string;
  private md: MarkdownIt;
  private pages: PageData[] = [];

  constructor() {
    this.dataPath = path.resolve('../data');
    this.templatesPath = path.resolve('../templates');
    this.docsPath = path.resolve('../docs');
    this.outputPath = path.resolve('./dist');
    this.md = new MarkdownIt();
  }

  async generate(): Promise<void> {
    console.log('🚀 Generating Aetheria static site...');

    // Clean and create output directory
    await this.cleanOutput();
    await fs.mkdir(this.outputPath, { recursive: true });
    await fs.mkdir(path.join(this.outputPath, 'css'), { recursive: true });
    await fs.mkdir(path.join(this.outputPath, 'data'), { recursive: true });
    await fs.mkdir(path.join(this.outputPath, 'docs'), { recursive: true });

    // Generate CSS
    await this.generateCSS();

    // Process documentation
    console.log('📚 Processing documentation...');
    await this.processDocumentation();

    // Process data hierarchies
    console.log('📊 Processing data hierarchies...');
    await this.processDataHierarchies();

    // Generate index page
    console.log('🏠 Generating index page...');
    await this.generateIndexPage();

    // Generate sitemap
    await this.generateSitemap();

    console.log(`✅ Site generation complete! ${this.pages.length} pages created in: ${this.outputPath}`);
    console.log('🌐 Ready for GitHub Pages deployment');
  }

  private async cleanOutput(): Promise<void> {
    try {
      await fs.rm(this.outputPath, { recursive: true });
    } catch {
      // Directory doesn't exist, that's fine
    }
  }

  private async generateCSS(): Promise<void> {
    const css = `
/* Aetheria Static Site Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #fafafa;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
  margin-bottom: 2rem;
}

header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

header p {
  font-size: 1.1rem;
  opacity: 0.9;
}

nav {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
  padding: 1rem;
}

nav ul {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

nav a {
  color: #667eea;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

nav a:hover {
  background-color: #f0f0f0;
}

.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.card h2 {
  color: #667eea;
  margin-bottom: 1rem;
  border-bottom: 2px solid #eee;
  padding-bottom: 0.5rem;
}

.card h3 {
  color: #764ba2;
  margin: 1rem 0 0.5rem 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.hierarchy {
  background: #f8f9fa;
  border-left: 4px solid #667eea;
  padding: 1rem;
  margin: 1rem 0;
  font-family: 'Courier New', monospace;
  white-space: pre-line;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

th, td {
  border: 1px solid #ddd;
  padding: 0.75rem;
  text-align: left;
}

th {
  background-color: #f2f2f2;
  font-weight: 600;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

/* Magic Schools Table Styling */
.magic-schools-table {
  font-size: 0.95rem;
}

.magic-schools-table th {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-align: center;
  font-weight: 600;
}

.magic-schools-table td {
  vertical-align: top;
}

.magic-schools-table td:first-child {
  font-weight: 600;
  min-width: 120px;
}

.magic-schools-table td:nth-child(4) {
  max-width: 400px;
  word-wrap: break-word;
}

.magic-schools-table td:last-child {
  max-width: 250px;
  word-wrap: break-word;
}

.magic-schools-table a {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
}

.magic-schools-table a:hover {
  text-decoration: underline;
}

code {
  background-color: #f4f4f4;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
}

pre {
  background-color: #f4f4f4;
  padding: 1rem;
  border-radius: 5px;
  overflow-x: auto;
  margin: 1rem 0;
}

.breadcrumb {
  color: #666;
  margin-bottom: 1rem;
}

.breadcrumb a {
  color: #667eea;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.entity-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.entity-card {
  background: white;
  border: 1px solid #eee;
  border-radius: 6px;
  padding: 1rem;
  transition: box-shadow 0.3s;
}

.entity-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.entity-card h4 {
  margin: 0 0 0.5rem 0;
  color: #667eea;
}

.entity-card a {
  text-decoration: none;
  color: inherit;
}

.entity-card p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

footer {
  margin-top: 3rem;
  padding: 2rem 0;
  border-top: 1px solid #eee;
  text-align: center;
  color: #666;
}

.search-box {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  header h1 {
    font-size: 2rem;
  }

  nav ul {
    flex-direction: column;
    gap: 0.5rem;
  }

  .grid {
    grid-template-columns: 1fr;
  }
}
`;

    await fs.writeFile(path.join(this.outputPath, 'css', 'style.css'), css);
  }

  private async processDocumentation(): Promise<void> {
    const files = await fs.readdir(this.docsPath);
    const mdFiles = files.filter((file: string) => file.endsWith('.md'));

    for (const file of mdFiles) {
      const filePath = path.join(this.docsPath, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const parsed = matter(content);
      const html = this.md.render(parsed.content);

      const pageTitle = parsed.data.title || path.parse(file).name;
      const outputFile = path.parse(file).name + '.html';

      const fullHtml = this.generatePageHTML({
        title: pageTitle,
        content: html,
        breadcrumb: `<a href="../index.html">Home</a> > <a href="index.html">Documentation</a> > ${pageTitle}`,
        category: 'Documentation'
      });

      await fs.writeFile(path.join(this.outputPath, 'docs', outputFile), fullHtml);

      this.pages.push({
        title: pageTitle,
        content: parsed.content,
        path: `/docs/${outputFile}`,
        category: 'Documentation',
        lastModified: new Date()
      });
    }

    // Generate docs index
    await this.generateDocsIndex(mdFiles);
  }

  private async generateDocsIndex(mdFiles: string[]): Promise<void> {
    const content = `
<div class="card">
  <h2>📚 Documentation</h2>
  <p>Core documentation for the Aetheria world.</p>

  <div class="entity-list">
    ${mdFiles.map((file: string) => {
      const name = path.parse(file).name;
      const title = this.capitalize(name);
      return `
        <div class="entity-card">
          <a href="${name}.html">
            <h4>${title}</h4>
            <p>${file}</p>
          </a>
        </div>
      `;
    }).join('')}
  </div>
</div>
`;

    const fullHtml = this.generatePageHTML({
      title: 'Documentation',
      content,
      breadcrumb: `<a href="../index.html">Home</a> > Documentation`,
      category: 'Documentation'
    });

    await fs.writeFile(path.join(this.outputPath, 'docs', 'index.html'), fullHtml);
  }

  private async processDataHierarchies(): Promise<void> {
    const files = await fs.readdir(this.dataPath);
    const yamlFiles = files.filter((file: string) => file.endsWith('.yaml') || file.endsWith('.yml'));

    for (const file of yamlFiles) {
      const dataType = path.parse(file).name;
      console.log(`  📊 Processing ${dataType}...`);

      await fs.mkdir(path.join(this.outputPath, 'data', dataType), { recursive: true });
      await this.processDataType(dataType);
    }

    // Generate data index
    await this.generateDataIndex(yamlFiles.map((file: string) => path.parse(file).name));
  }

  private async processDataType(dataType: string): Promise<void> {
    const dataFilePath = path.join(this.dataPath, `${dataType}.yaml`);
    const content = await fs.readFile(dataFilePath, 'utf-8');
    const data = yaml.parse(content);

    // Generate index for this data type
    await this.generateDataTypeIndex(dataType, data);

    // Generate individual entity pages
    await this.generateEntityPages(dataType, data);
  }

  private async generateDataTypeIndex(dataType: string, data: any): Promise<void> {
    const entities = this.getAllEntities(data);
    const hierarchy = this.renderHierarchyHTML(data);

    let content = '';

    // Special handling for magic schools with flat structure
    if (dataType === 'magic_schools' && data.magic_schools) {
      content = `
<div class="card">
  <h2>${this.capitalize(dataType.replace('_', ' '))}</h2>
  <p>All magic schools in the Aetheria world (${entities.length} schools).</p>

  <h3>🎓 Magic Schools Overview</h3>
  <table class="magic-schools-table">
    <thead>
      <tr>
        <th>School</th>
        <th>Focus</th>
        <th>Opposing Element</th>
        <th>Description</th>
        <th>Regulation</th>
      </tr>
    </thead>
    <tbody>
      ${entities.map(entity => `
        <tr>
          <td><a href="data/${dataType}/${this.sanitizeFilename(entity.name)}.html"><strong>${entity.name}</strong></a></td>
          <td>${Array.isArray(entity.data.focus) ? entity.data.focus.join(', ') : entity.data.focus || 'N/A'}</td>
          <td>${entity.data.opposing_element || 'N/A'}</td>
          <td>${entity.data.description ? (entity.data.description.length > 250 ? entity.data.description.substring(0, 250) + '...' : entity.data.description) : 'No description'}</td>
          <td>${entity.data.regulation || 'N/A'}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>
</div>
`;
    } else if (dataType === 'equipment' && data.equipment &&
        (data.equipment.weapons || data.equipment.armor_and_shields || data.equipment.miscellaneous)) {
      content = `
<div class="card">
  <h2>${this.capitalize(dataType)}</h2>
  <p>All ${dataType} in the Aetheria world (${entities.length} entities), organized by category.</p>
`;

      // Generate tables for each category
      for (const [categoryKey, categoryValue] of Object.entries(data.equipment)) {
        if (typeof categoryValue === 'object' && categoryValue !== null) {
          const categoryEntities = Object.entries(categoryValue)
            .filter(([_, value]) => typeof value === 'object' && value !== null)
            .map(([key, value]) => ({
              name: (value as any).name || key,
              data: value as any
            }));

          const categoryTitle = this.capitalize(categoryKey.replace(/_/g, ' '));
          content += `
  <h3>⚔️ ${categoryTitle}</h3>
  <div class="entity-list">
    ${categoryEntities.map(entity => `
      <div class="entity-card">
        <a href="data/${dataType}/${this.sanitizeFilename(entity.name)}.html">
          <h4>${entity.name}</h4>
          <p><strong>Type:</strong> ${Array.isArray(entity.data.type) ? entity.data.type.join(', ') : entity.data.type}</p>
          <p><strong>Rarity:</strong> ${entity.data.rarity}</p>
          <p>${entity.data.description ? entity.data.description.substring(0, 80) + '...' : 'No description'}</p>
        </a>
      </div>
    `).join('')}
  </div>
`;
        }
      }

      content += `
  <h3>🌳 Hierarchy</h3>
  <div class="hierarchy">${hierarchy}</div>
</div>
`;
    } else {
      // Default handling for other data types
      content = `
<div class="card">
  <h2>${this.capitalize(dataType)}</h2>
  <p>All ${dataType} in the Aetheria world (${entities.length} entities).</p>

  <h3>📋 Quick Access</h3>
  <div class="entity-list">
    ${entities.map(entity => `
      <div class="entity-card">
        <a href="data/${dataType}/${this.sanitizeFilename(entity.name)}.html">
          <h4>${entity.name}</h4>
          <p>${entity.data.description ? entity.data.description.substring(0, 100) + '...' : 'No description'}</p>
        </a>
      </div>
    `).join('')}
  </div>

  <h3>🌳 Hierarchy</h3>
  <div class="hierarchy">${hierarchy}</div>
</div>
`;
    }

    const fullHtml = this.generatePageHTML({
      title: this.capitalize(dataType),
      content,
      breadcrumb: `<a href="../../index.html">Home</a> > <a href="../index.html">Data</a> > ${this.capitalize(dataType)}`,
      category: 'Data'
    });

    await fs.writeFile(path.join(this.outputPath, 'data', dataType, 'index.html'), fullHtml);
  }

  private async generateEntityPages(dataType: string, data: any): Promise<void> {
    const entities = this.getAllEntities(data);

    for (const entity of entities) {
      await this.generateEntityPage(dataType, entity);
    }
  }

  private async generateEntityPage(dataType: string, entity: any): Promise<void> {
    const entityName = entity.name;
    const filename = this.sanitizeFilename(entityName) + '.html';

    let content = '';

    try {
      // Try to use template-based generation
      content = await this.generateEntityContentFromTemplate(dataType, entity.data);
    } catch (error) {
      // Fallback to basic structure if template fails
      console.warn(`Template generation failed for ${dataType}/${entityName}, using fallback: ${error}`);
      content = await this.generateEntityContentFallback(entity);
    }

    // Add children if they exist
    if (entity.data.children && Object.keys(entity.data.children).length > 0) {
      content += `<h3>Subtypes</h3><div class="entity-list">`;
      for (const childName of Object.keys(entity.data.children)) {
        content += `
          <div class="entity-card">
            <a href="data/${dataType}/${this.sanitizeFilename(childName)}.html">
              <h4>${childName}</h4>
            </a>
          </div>
        `;
      }
      content += `</div>`;
    }

    content += `</div>`;

    const fullHtml = this.generatePageHTML({
      title: entityName,
      content,
      breadcrumb: `<a href="../../../index.html">Home</a> > <a href="../../index.html">Data</a> > <a href="index.html">${this.capitalize(dataType)}</a> > ${entityName}`,
      category: dataType
    });

    await fs.writeFile(path.join(this.outputPath, 'data', dataType, filename), fullHtml);

    this.pages.push({
      title: entityName,
      content: entity.data.description || '',
      path: `/data/${dataType}/${filename}`,
      category: dataType,
      lastModified: new Date()
    });
  }

  private async generateEntityContentFromTemplate(dataType: string, entityData: any): Promise<string> {
    // Try different template naming patterns
    const templatePaths = [
      path.join(this.templatesPath, `${dataType}.md`),
      path.join(this.templatesPath, `${dataType.slice(0, -1)}.md`), // Remove 's' for plurals
      path.join(this.templatesPath, 'generic_entity.md')
    ];

    let template = '';
    let templateFound = false;

    for (const templatePath of templatePaths) {
      try {
        template = await fs.readFile(templatePath, 'utf-8');
        templateFound = true;
        break;
      } catch (error) {
        // Continue to next template
      }
    }

    if (!templateFound) {
      throw new Error(`No suitable template found for ${dataType}`);
    }

    // Prepare template data with helper properties for arrays
    const templateData = {
      ...entityData,
      // Add helper properties for conditional sections
      has_alternative_names: Array.isArray(entityData.alternative_names) && entityData.alternative_names.length > 0,
      has_damage_type: Array.isArray(entityData.damage_type) && entityData.damage_type.length > 0,
      has_focus: Array.isArray(entityData.focus) && entityData.focus.length > 0,
      // Add display strings for arrays
      type_display: Array.isArray(entityData.type) ? entityData.type.join(', ') : entityData.type,
      alternative_names_display: Array.isArray(entityData.alternative_names) ? entityData.alternative_names.map((name: any) => `- ${name}`).join('\n') : '',
      damage_type_display: Array.isArray(entityData.damage_type) ? entityData.damage_type.map((type: any) => `- ${type}`).join('\n') : '',
      focus_display: Array.isArray(entityData.focus) ? entityData.focus.map((focus: any) => `- ${focus}`).join('\n') : '',
    };

    // Render the template with prepared data
    const markdown = Mustache.render(template, templateData);

    // Convert markdown to HTML
    const html = this.md.render(markdown);

    return `<div class="card">${html}</div>`;
  }

  private async generateEntityContentFallback(entity: any): Promise<string> {
    // Original hardcoded HTML generation as fallback
    let content = `<div class="card">`;
    content += `<h2>${entity.name}</h2>`;

    if (entity.data.description) {
      content += `<p>${entity.data.description}</p>`;
    }

    if (entity.data.type && entity.data.type !== entity.name) {
      // Handle new array type format
      if (Array.isArray(entity.data.type)) {
        content += `<p><strong>Type:</strong> ${entity.data.type.join(', ')}</p>`;
      } else {
        content += `<p><strong>Type:</strong> ${entity.data.type}</p>`;
      }
    }

    // Add properties
    const excludeKeys = ['name', 'description', 'children'];
    const properties = Object.entries(entity.data).filter(([key]) => !excludeKeys.includes(key));

    if (properties.length > 0) {
      content += `<h3>Properties</h3><table>`;
      for (const [key, value] of properties) {
        if (typeof value === 'string' || typeof value === 'number') {
          content += `<tr><td><strong>${this.capitalize(key)}</strong></td><td>${value}</td></tr>`;
        } else if (Array.isArray(value)) {
          content += `<tr><td><strong>${this.capitalize(key)}</strong></td><td>${value.join(', ')}</td></tr>`;
        } else if (typeof value === 'object' && value !== null) {
          // Handle nested objects (like protection stats)
          const nestedProps = Object.entries(value).map(([k, v]) => `${k}: ${v}`).join(', ');
          content += `<tr><td><strong>${this.capitalize(key)}</strong></td><td>${nestedProps}</td></tr>`;
        }
      }
      content += `</table>`;
    }

    return content;
  }

  private async generateDataIndex(dataTypes: string[]): Promise<void> {
    const content = `
<div class="card">
  <h2>📊 World Data</h2>
  <p>Structured hierarchical data about the Aetheria world.</p>

  <div class="grid">
    ${dataTypes.map(type => `
      <div class="card">
        <h3><a href="${type}/index.html">${this.capitalize(type)}</a></h3>
        <p>Browse all ${type} in the world with their relationships and properties.</p>
      </div>
    `).join('')}
  </div>
</div>
`;

    const fullHtml = this.generatePageHTML({
      title: 'World Data',
      content,
      breadcrumb: `<a href="../index.html">Home</a> > Data`,
      category: 'Data'
    });

    await fs.writeFile(path.join(this.outputPath, 'data', 'index.html'), fullHtml);
  }

  private async generateIndexPage(): Promise<void> {
    const dataFiles = await fs.readdir(this.dataPath);
    const yamlFiles = dataFiles.filter((file: string) => file.endsWith('.yaml') || file.endsWith('.yml'));
    const dataTypes = yamlFiles.map((file: string) => path.parse(file).name);

    const docsFiles = await fs.readdir(this.docsPath);
    const mdFiles = docsFiles.filter((file: string) => file.endsWith('.md'));

    const content = `
<div class="card">
  <h2>🌍 Welcome to Aetheria</h2>
  <p>Explore the rich world of Aetheria through interactive documentation and hierarchical data.</p>
</div>

<div class="grid">
  <div class="card">
    <h2>📚 Documentation</h2>
    <p>Core world documentation covering magic, politics, religion, and more.</p>
    <ul>
      ${mdFiles.slice(0, 5).map((file: string) => {
        const name = path.parse(file).name;
        return `<li><a href="docs/${name}.html">${this.capitalize(name)}</a></li>`;
      }).join('')}
    </ul>
    <p><a href="docs/index.html">View all documentation →</a></p>
  </div>

  <div class="card">
    <h2>📊 World Data</h2>
    <p>Structured hierarchical data with relationships and inheritance.</p>
    <ul>
      ${dataTypes.slice(0, 5).map(type => `<li><a href="data/${type}/index.html">${this.capitalize(type)}</a></li>`).join('')}
    </ul>
    <p><a href="data/index.html">Explore all data →</a></p>
  </div>
</div>

<div class="card">
  <h2>🔍 Quick Stats</h2>
  <div class="grid">
    <div>
      <h3>${mdFiles.length}</h3>
      <p>Documentation Files</p>
    </div>
    <div>
      <h3>${dataTypes.length}</h3>
      <p>Data Categories</p>
    </div>
    <div>
      <h3>${this.pages.length}</h3>
      <p>Total Pages</p>
    </div>
  </div>
</div>
`;

    const fullHtml = this.generatePageHTML({
      title: 'Aetheria World',
      content,
      breadcrumb: 'Home',
      category: 'Home',
      isHomePage: true
    });

    await fs.writeFile(path.join(this.outputPath, 'index.html'), fullHtml);
  }

  private generatePageHTML(options: {
    title: string;
    content: string;
    breadcrumb: string;
    category: string;
    isHomePage?: boolean;
  }): string {
    const { title, content, breadcrumb, category, isHomePage = false } = options;

    // Calculate CSS path based on actual directory depth
    // Count the depth by checking how many directory levels we need to go up
    const pathDepth = breadcrumb.split(' > ').length - 1;
    const cssPath = isHomePage ? 'css/style.css' : '../'.repeat(pathDepth) + 'css/style.css';

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <base href="/Aetheria/">
    <title>${title} - Aetheria World</title>
    <meta name="description" content="Explore the world of Aetheria - ${title}">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <header>
        <div class="container">
            <h1>🌍 Aetheria</h1>
            <p>A Rich Fantasy World</p>
        </div>
    </header>

    <nav>
        <div class="container">
            <ul>
                <li><a href="index.html">🏠 Home</a></li>
                <li><a href="docs/index.html">📚 Documentation</a></li>
                <li><a href="data/index.html">📊 Data</a></li>
            </ul>
        </div>
    </nav>

    <main class="container">
        ${!isHomePage ? `<div class="breadcrumb">${breadcrumb}</div>` : ''}
        ${content}
    </main>

    <footer>
        <div class="container">
            <p>Generated on ${new Date().toLocaleDateString()} | <a href="https://github.com/rjordan/Aetheria">View on GitHub</a></p>
        </div>
    </footer>
</body>
</html>`;
  }

  private renderHierarchyHTML(data: any, indent: number = 0): string {
    const spaces = '  '.repeat(indent);
    let result = '';

    // Check if this is the new flat magic schools structure
    if (data.magic_schools && typeof data.magic_schools === 'object') {
      result += `magic_schools\n`;

      // Group by regulation
      const byRegulation: Record<string, string[]> = {};
      for (const [schoolKey, schoolValue] of Object.entries(data.magic_schools)) {
        if (typeof schoolValue === 'object' && schoolValue !== null) {
          const regulation = (schoolValue as any).regulation || 'unregulated';
          if (!byRegulation[regulation]) byRegulation[regulation] = [];
          byRegulation[regulation].push(`${(schoolValue as any).name || schoolKey}`);
        }
      }

      for (const [regulation, schools] of Object.entries(byRegulation)) {
        result += `  ${regulation}\n`;
        for (const school of schools.sort()) {
          result += `    ${school}\n`;
        }
      }
      return result;
    }

    // Check if this is the new grouped equipment structure
    if (data.equipment && typeof data.equipment === 'object') {
      // Handle grouped structure (weapons, armor_and_shields, miscellaneous)
      result += `equipment\n`;

      for (const [categoryKey, categoryValue] of Object.entries(data.equipment)) {
        result += `  ${categoryKey.replace(/_/g, ' ')}\n`;

        if (typeof categoryValue === 'object' && categoryValue !== null) {
          // Group by rarity within each category
          const byRarity: Record<string, string[]> = {};
          for (const [itemKey, itemValue] of Object.entries(categoryValue)) {
            if (typeof itemValue === 'object' && itemValue !== null) {
              const rarity = (itemValue as any).rarity || 'unknown';
              if (!byRarity[rarity]) byRarity[rarity] = [];
              byRarity[rarity].push(`${(itemValue as any).name || itemKey}`);
            }
          }

          for (const [rarity, items] of Object.entries(byRarity)) {
            result += `    ${rarity}\n`;
            for (const item of items.sort()) {
              result += `      ${item}\n`;
            }
          }
        }
      }
      return result;
    }    // Handle hierarchical structure (legacy format)
    for (const [key, value] of Object.entries(data)) {
      result += `${spaces}${key}\n`;

      if (typeof value === 'object' && value !== null && (value as any).children) {
        result += this.renderHierarchyHTML((value as any).children, indent + 1);
      }
    }

    return result;
  }

  private getAllEntities(data: any): Array<{name: string, data: any}> {
    const entities: Array<{name: string, data: any}> = [];

    // Check if this is the new flat magic schools structure
    if (data.magic_schools && typeof data.magic_schools === 'object') {
      // Handle flat magic schools structure
      for (const [schoolKey, schoolValue] of Object.entries(data.magic_schools)) {
        if (typeof schoolValue === 'object' && schoolValue !== null) {
          entities.push({
            name: (schoolValue as any).name || schoolKey,
            data: schoolValue
          });
        }
      }
      return entities;
    }

    // Check if this is the new grouped equipment structure
    if (data.equipment && typeof data.equipment === 'object') {
      // Handle grouped structure (weapons, armor_and_shields, miscellaneous)
      for (const [categoryKey, categoryValue] of Object.entries(data.equipment)) {
        if (typeof categoryValue === 'object' && categoryValue !== null) {
          // If this category has subcategories (like weapons, armor_and_shields, miscellaneous)
          for (const [itemKey, itemValue] of Object.entries(categoryValue)) {
            if (typeof itemValue === 'object' && itemValue !== null) {
              entities.push({
                name: (itemValue as any).name || itemKey,
                data: { ...itemValue, category: categoryKey }
              });
            }
          }
        }
      }
      return entities;
    }

    // Handle hierarchical structure (legacy format)
    const traverse = (obj: any) => {
      if (typeof obj === 'object' && obj !== null) {
        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === 'object' && value !== null) {
            entities.push({
              name: (value as any).name || key,
              data: value
            });

            if ((value as any).children) {
              traverse((value as any).children);
            }
          }
        }
      }
    };

    traverse(data);
    return entities;
  }

  private async generateSitemap(): Promise<void> {
    const baseUrl = 'https://rjordan.github.io/Aetheria';
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <priority>1.0</priority>
  </url>
  ${this.pages.map(page => `
  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>${page.lastModified?.toISOString() || new Date().toISOString()}</lastmod>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`;

    await fs.writeFile(path.join(this.outputPath, 'sitemap.xml'), sitemap);
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
  }

  private sanitizeFilename(name: string): string {
    return name.toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  }
}

// Run generator
(async () => {
  try {
    const generator = new AetheriaStaticSiteGenerator();
    await generator.generate();
  } catch (error) {
    console.error('❌ Site generation failed:', error);
    process.exit(1);
  }
})();
