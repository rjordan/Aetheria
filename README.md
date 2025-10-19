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

## 📁 **Project Structure**

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
