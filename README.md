# Aetheria World Data System

A comprehensive system for managing and sharing fantasy world data, featuring both AI integration and beautiful public documentation.

## 🌟 **What You Get**

### 🤖 **AI Integration**
TypeScript MCP server that provides rich, structured world context to AI systems for dynamic text generation.

### 🌐 **Public Documentation**
Beautiful, responsive website automatically deployed to GitHub Pages showing your world data in an explorable format.

### 📊 **Hierarchical Data**
YAML-based data structures with inheritance (e.g., Fiend → Demon → Succubus → Lilith) that both AI and humans can understand.

## 🚀 **Quick Start**

### View the Live Site
Your world data is automatically published at:
**`https://yourusername.github.io/Aetheria`**

### Make Changes
1. Edit files in `/data/` (YAML hierarchies) or `/docs/` (markdown documentation)
2. Commit and push to GitHub
3. GitHub Actions automatically rebuilds and deploys your site!

### Development
```bash
# Preview site locally
./dev.sh site

# Test MCP server
./dev.sh mcp

# Deploy changes
./dev.sh deploy
```

## 📁 **Project Structure**

- **`/docs/`** - Your world documentation (Magic.md, Politics.md, etc.)
- **`/data/`** - Hierarchical YAML data (creatures, classes, organizations, etc.)
- **`/templates/`** - Mustache templates for dynamic content generation
- **`/mcp-server/`** - AI integration server (Model Context Protocol)
- **`/site-generator/`** - Static site generator for GitHub Pages
- **`.github/workflows/`** - Automated deployment configuration

## ✨ **Features**

### For AI Systems (MCP Server)
- **Search**: Query across all documentation and data
- **Hierarchy Navigation**: Explore complex entity relationships
- **Content Generation**: Create stat blocks, guides, overviews
- **Data Extraction**: Convert content to structured formats

### For Humans (GitHub Pages)
- **Documentation Browser**: All markdown files as beautiful HTML
- **Data Explorer**: Interactive hierarchy browser with visual relationships
- **Mobile-Friendly**: Responsive design that works on all devices
- **Search-Optimized**: SEO-ready with sitemap generation

### For Developers
- **TypeScript**: Type-safe development with full IntelliSense
- **Automated Deployment**: Zero-maintenance publishing
- **Shared Data Sources**: Consistent information across all systems
- **Easy Extension**: Add new data types or templates easily

## 🎯 **Use Cases**

- **📖 Story Writing**: AI generates consistent, lore-accurate content
- **🎮 Game Mastering**: Quick reference during sessions + dynamic content
- **👥 Player Resources**: Share world information via public website
- **📚 World Building**: Organize complex relationships and hierarchies
- **🌍 Community Sharing**: Professional presentation of your world

## 🔧 **Development**

See the detailed documentation in each component:
- [MCP Server](mcp-server/README.md) - AI integration setup
- [Site Generator](site-generator/README.md) - GitHub Pages customization
- [Project Summary](PROJECT_SUMMARY.md) - Complete system overview

Perfect for creating rich, interactive fantasy worlds that serve both AI systems and human readers! 🎉
