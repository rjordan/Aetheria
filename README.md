# Aetheria World Data System

A comprehensive system for managing and sharing fantasy world data, featuring both AI integration and beautiful public documentation.

## 🌟 **What You Get**

### 🤖 **AI Integration**
Model Context Protocol (MCP) server that provides rich, rendered world content to AI systems - including both structured data and full page content exactly as users see it.

### 🌐 **Public Documentation**
Beautiful, responsive SolidJS website automatically deployed to GitHub Pages with hash routing and mobile-friendly design.

### 📊 **Structured Data**
JSON-based data with automatic TypeScript types, combined with rich markdown documentation.

## 🚀 **Quick Start**

### View the Live Site
Your world data is automatically published at:
**`https://rjordan.github.io/Aetheria`**

### Make Changes
1. Edit data files in `/site/src/data/` or page content in `/site/src/pages/`
2. Commit and push to GitHub
3. GitHub Actions automatically rebuilds and deploys your site!

### Development
```bash
# Preview site locally (Node.js)
./dev.sh site

# Preview site locally (Bun - faster)
./dev.sh site-bun

# Test MCP server with rendered content
cd site && npm run build:mcp && npm run mcp

# Deploy changes
git add . && git commit -m "Update content" && git push
```

## 🔨 **Build Commands**

The project uses dotenv for clean environment management:

```bash
# Development server (uses .env)
npm run dev

# Production build (uses .env)
npm run build

# GitHub Pages build (uses .env.github)
npm run build:github

# Preview production build
npm run preview
```

### Environment Files
- **`.env`** - Development defaults (not committed)
- **`.env.example`** - Template with all options
- **`.env.github`** - GitHub Pages configuration

## 🤖 **MCP Server Setup**

The MCP server provides AI agents with access to fully rendered page content using Puppeteer:

### Build and Run
```bash
cd site
npm run build:mcp
npm run mcp
```

### Configuration
```bash
# Use GitHub Pages (default)
npm run mcp

# Use local dev server
AETHERIA_SITE_URL=http://localhost:3000 npm run mcp
```

### Available Resources
- **`aetheria://pages/magic`** - Full magic system page with explanations
- **`aetheria://pages/classes`** - Character classes with descriptions
- **`aetheria://pages/equipment`** - Equipment catalog with details
- **`aetheria://pages/politics`** - Political organizations and relationships
- **`aetheria://pages/alignment`** - Alignment system overview
- **`aetheria://pages/religion`** - Religious systems and deities
- **`aetheria://pages/relationships`** - Character relationships and dynamics

The MCP server uses headless Chrome to render actual page content, ensuring AI agents get the same rich information that human users see in the browser.

### Generic Data Loading Interface

The site uses a configurable data loading system that works with static files or APIs:

```typescript
// Runtime loading via HTTP fetch (cached automatically)
const magicData = await fetchMagicData()  // GET ${DATA_ENDPOINT}/magic.json
const classData = await fetchClassesData()  // GET ${DATA_ENDPOINT}/classes.json
```

#### Environment Configuration
```bash
# Copy .env.example to .env and customize
cp .env.example .env

# Default configuration (.env)
VITE_DATA_ENDPOINT=/data      # Data source endpoint
AETHERIA_BASE_PATH=/          # Site base path

# Example configurations:
VITE_DATA_ENDPOINT=https://api.example.com/aetheria/data  # Remote API
VITE_DATA_ENDPOINT=http://localhost:3000/api/v1/data     # Local API server
AETHERIA_BASE_PATH=/Aetheria/                            # GitHub Pages path
```

#### Data Architecture
- **Dotenv Integration**: Clean environment variable management with `.env` files
- **Multiple Environments**: Separate configs for development, GitHub Pages, etc.
- **Static Files**: JSON files in `/public/data/` served at `/data/` URLs
- **Dynamic APIs**: Any HTTP endpoint returning JSON with the same structure
- **Runtime Loading**: Uses standard `fetch()` calls, no compile-time dependencies
- **Automatic Caching**: In-memory cache prevents repeated requests

#### Data Structure Examples
- **`magic.json`**: Contains `magic.schools` and `magic.spells` data
- **`classes.json`**: Contains `classes.primary` and `classes.specialized` data
- **Other files**: Equipment, organizations, creatures, site configuration

#### Benefits
- **Environment Configurable**: Switch between static files and APIs via ENV vars
- **Zero Bundle Impact**: JSON files not included in JavaScript bundle
- **Offline Support**: Service Worker provides offline functionality with cached data
- **Intelligent Caching**: Network-first for fresh data, cache fallback for offline
- **API-Ready**: Drop-in replacement with real web services
- **Development Friendly**: Works with local files during development
- **Production Flexible**: Can serve from CDN, API, or static files## 📁 **Project Structure**

- **`/site/`** - SolidJS application with data and pages
  - **`/src/data/`** - JSON data files with TypeScript types
  - **`/src/pages/`** - SolidJS page components
  - **`/src/mcp-server-simple.ts`** - MCP server with Puppeteer rendering
- **`/docs/`** - Generated static site (GitHub Pages output)
- **`/dev.sh`** - Development workflow script
- **`.github/workflows/`** - Automated deployment configuration

## ✨ **Features**

### For AI Systems (MCP Server)
- **Rendered Content**: Access to actual page content as users see it
- **Search**: Query across all rendered pages for specific terms
- **No Maintenance**: Automatically works with any new pages added
- **Accurate Context**: Gets rich explanations, terminology, and formatting

### For Humans (GitHub Pages)
- **SolidJS SPA**: Fast, reactive single-page application
- **Hash Routing**: Works perfectly with GitHub Pages subpaths
- **Offline Support**: Service Worker enables offline browsing with cached data
- **Smart Caching**: Network-first strategy keeps content fresh when online
- **Mobile-Friendly**: Responsive design that works on all devices
- **Fast Navigation**: Instant page transitions after initial load

### For Developers
- **TypeScript**: Type-safe development with full IntelliSense
- **Hot Reload**: Fast development with Vite
- **Multiple Runtimes**: Choose between Node.js or Bun for development
- **Automated Deployment**: Zero-maintenance publishing to GitHub Pages

## 🎯 **Use Cases**

- **📖 Story Writing**: AI generates consistent, lore-accurate content using full page context
- **🎮 Game Mastering**: Rich reference material with AI assistance
- **👥 Player Resources**: Share world information via public website
- **📚 World Building**: Organize complex information with rich explanations
- **🌍 Community Sharing**: Professional presentation of your fantasy world

## 🔧 **Technical Architecture**

- **Frontend**: SolidJS + TypeScript + Vite
- **Routing**: Hash-based routing for GitHub Pages compatibility
- **Styling**: SCSS with responsive design
- **MCP Integration**: Puppeteer-based content rendering
- **Deployment**: GitHub Actions → GitHub Pages
- **Development**: Multiple runtime support (Node.js/Bun)

Perfect for creating rich, interactive fantasy worlds that serve both AI systems and human readers! 🎉
