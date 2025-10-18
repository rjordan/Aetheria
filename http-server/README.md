# Aetheria HTTP Server

This HTTP server provides multiple ways to access and serve your Aetheria world data:

1. **Dynamic API Server** - Serves data via REST API with search and hierarchy navigation
2. **Static Generator** - Creates static markdown files from your data
3. **Static File Server** - Serves the generated static files

## Quick Start

```bash
# Install dependencies
npm install

# Build the server
npm run build

# Option 1: Run dynamic API server
npm start

# Option 2: Generate static files
npm run generate

# Option 3: Serve static files
npm run serve-static
```

## Dynamic API Server

Start the dynamic server that serves your data via REST API:

```bash
npm start
```

Visit `http://localhost:3000` for a web interface with:

- 📚 **Documentation browser** - View your markdown docs as HTML
- 📊 **Data explorer** - Browse hierarchical data structures
- 🔍 **Search functionality** - Search across docs and data
- 🔧 **Content generation** - Generate dynamic content from templates

### API Endpoints

- `GET /` - Web interface
- `GET /api/docs` - List all documentation files
- `GET /api/docs/:filename` - Get specific document with HTML
- `GET /api/data` - List all data types
- `GET /api/data/:type` - Get specific data type (YAML)
- `GET /api/hierarchy/:type` - Get hierarchy root
- `GET /api/hierarchy/:type/:entity` - Get specific entity with relationships
- `GET /api/search?q=query&category=docs|data` - Search content
- `GET /generate/:type` - Generate content from template
- `GET /generate/:type/:name` - Generate content for specific entity
- `GET /docs/:filename` - View markdown docs as HTML

### Examples

```bash
# Search for demons
curl "http://localhost:3000/api/search?q=demon&category=data"

# Get creature hierarchy
curl "http://localhost:3000/api/hierarchy/creatures"

# Get Lilith with full context
curl "http://localhost:3000/api/hierarchy/creatures/lilith?includeParents=true&includeChildren=true"

# Generate stat block for Lilith
curl "http://localhost:3000/generate/creature_stat_block/lilith"

# View Politics.md as HTML
curl "http://localhost:3000/docs/Politics.md"
```

## Static Generator

Generate static markdown files from your data:

```bash
npm run generate
```

This creates a complete static site in `../generated/` with:

- Individual pages for each entity
- Index pages for each data type
- Hierarchical organization
- Cross-references and links

### Generated Structure

```
generated/
├── index.md                 # Main index
├── classes/
│   ├── index.md            # Classes overview
│   ├── warrior.md          # Individual class pages
│   └── ...
├── creatures/
│   ├── index.md            # Creatures overview
│   ├── lilith.md           # Individual creature pages
│   └── ...
├── equipment/
├── magic_schools/
└── organizations/
```

### Custom Output Location

```bash
# Generate to custom directory
npx tsx src/generator.ts ./my-output-dir
```

## Static File Server

Serve the generated static files:

```bash
npm run serve-static
```

This starts a simple static file server on `http://localhost:3001` serving the generated content.

## Directory Structure

The HTTP server expects this directory structure:

```
Aetheria/
├── data/                    # YAML data files (moved up from mcp-server)
│   ├── creatures.yaml
│   ├── magic_schools.yaml
│   └── ...
├── templates/               # Mustache templates (moved up from mcp-server)
│   ├── creature_stat_block.md
│   ├── character_class_guide.md
│   └── ...
├── docs/                    # Your existing markdown docs
│   ├── Magic.md
│   ├── Politics.md
│   └── ...
├── http-server/             # This HTTP server
│   ├── src/
│   ├── package.json
│   └── ...
├── mcp-server/              # MCP server (updated paths)
└── generated/               # Generated static files (created by generator)
```

## Configuration

### Environment Variables

- `PORT` - Server port (default: 3000 for API, 3001 for static)

### Customization

1. **Templates**: Edit files in `../templates/` to customize generated content
2. **Data**: Edit YAML files in `../data/` to modify the data structure
3. **Styling**: Modify the HTML templates in `src/server.ts` for custom styling

## Features

### 🔍 **Smart Search**
- Full-text search across documentation and data
- Category filtering (docs, data, or all)
- Context extraction and highlighting

### 🌳 **Hierarchy Navigation**
- Explore complex entity relationships
- Parent/child traversal
- Inheritance understanding (Lilith → Succubus → Demon → Fiend)

### 📄 **Dynamic Content Generation**
- Template-based content creation
- Mustache templating with data injection
- Multiple output formats

### 📊 **Data Integration**
- YAML data files with rich hierarchies
- Markdown documentation preservation
- Seamless cross-referencing

### 🎨 **Web Interface**
- Clean, responsive design
- Navigation between different content types
- Direct links to raw data and generated content

## Use Cases

### 📖 **Documentation Website**
Generate a complete static documentation site from your world data.

### 🤖 **AI Integration**
Use the API endpoints to provide rich context to AI systems.

### 🎮 **Game Development**
Generate stat blocks, equipment catalogs, and world information for games.

### 📝 **Content Creation**
Create consistent, template-based content for stories, campaigns, or world-building.

## Integration with MCP Server

The HTTP server complements the MCP server:

- **MCP Server**: Optimized for AI integration via Model Context Protocol
- **HTTP Server**: Human-readable web interface and static generation

Both use the same data sources (`../data/`, `../templates/`, `../docs/`) so content stays synchronized.

## Development

```bash
# Watch mode for development
npm run dev

# Build TypeScript
npm run build

# Type checking
npx tsc --noEmit
```

## Troubleshooting

### Port Already in Use
Change the port with environment variables:
```bash
PORT=4000 npm start
```

### Missing Data
Ensure the data directory structure matches:
```bash
ls ../data/        # Should show YAML files
ls ../templates/   # Should show template files
ls ../docs/        # Should show markdown files
```

### Template Errors
Check template syntax and data structure compatibility in `../templates/`.
