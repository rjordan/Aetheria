# Aetheria World Data System

A comprehensive system for managing and sharing fantasy world data, featuring both AI-optimized RAG documentation and beautiful public websites.

## 🌟 **What You Get**

### 🤖 **AI-Optimized Documentation**
Generate consolidated markdown files specifically designed for RAG (Retrieval Augmented Generation) systems and vector databases. Perfect for loading into pgvector or other vector storage systems.

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

# Generate AI-optimized docs for RAG systems
./dev.sh package

# Deploy changes to GitHub Pages
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

## 🤖 **AI-Optimized Documentation**

The system generates comprehensive markdown documentation specifically optimized for AI consumption and RAG systems:

### Quick Start for AI Integration
```bash
# Generate AI-optimized documentation
./dev.sh package

# This creates a timestamped ZIP file with:
# - Consolidated reference documents
# - Individual entity files
# - Cross-reference mappings
# - Master index and navigation
```

### What You Get
- **Consolidated Files**: `complete-world-overview.md`, `all-magic.md`, `all-characters.md`
- **Individual References**: Detailed files for each entity (regions, characters, magic schools)
- **Cross-References**: Explicit relationship mapping between entities
- **Vector-Ready**: Perfect for chunking and loading into pgvector or similar systems
- **GitHub Releases**: Automated ZIP generation and publishing via GitHub Actions

### Perfect for RAG Systems
The generated documentation is specifically designed for vector databases:
- **Semantic Completeness**: Each document contains full context
- **Chunk-Friendly**: Natural breaks for vector database chunking
- **Relationship Mapping**: Explicit entity connections for better retrieval
- **Comprehensive Coverage**: Both individual and consolidated views

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
- **`/docs/`** - Generated static site (GitHub Pages output)
- **`/ai-docs/`** - Generated AI-optimized documentation (excluded from git)
- **`/generate-ai-docs.js`** - AI documentation generator script
- **`/dev.sh`** - Development workflow script
- **`.github/workflows/`** - Automated deployment and AI docs generation

## ✨ **Features**

### For AI Systems (RAG Integration)
- **Vector-Ready Content**: Consolidated documents perfect for chunking and vector storage
- **Comprehensive Context**: Each document contains complete information without requiring navigation
- **Relationship Mapping**: Explicit cross-references between entities for better retrieval
- **Multiple Access Patterns**: Both consolidated overviews and individual entity files
- **Automated Generation**: GitHub Actions automatically creates and releases updated documentation

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
- **AI Documentation Pipeline**: Automated generation and packaging for RAG systems

## 🎯 **Use Cases**

- **📖 Story Writing**: AI generates consistent, lore-accurate content using comprehensive world knowledge from RAG systems
- **🎮 Game Mastering**: Rich reference material with AI assistance powered by vector search
- **👥 Player Resources**: Share world information via public website
- **📚 World Building**: Organize complex information with rich cross-references
- **🌍 Community Sharing**: Professional presentation of your fantasy world
- **🤖 AI Training**: Perfect dataset for fine-tuning language models on your world
- **📊 Vector Databases**: Ready-to-use documentation for pgvector and other RAG systems

## 🔧 **Technical Architecture**

- **Frontend**: SolidJS + TypeScript + Vite
- **Routing**: Hash-based routing for GitHub Pages compatibility
- **Styling**: SCSS with responsive design
- **AI Documentation**: Node.js generator for RAG-optimized markdown
- **Vector Database Ready**: Perfect for pgvector, Chroma, or other vector stores
- **Deployment**: GitHub Actions → GitHub Pages + AI docs releases
- **Development**: Multiple runtime support (Node.js/Bun)

Perfect for creating rich, interactive fantasy worlds that serve both AI systems via RAG and human readers via beautiful web interfaces! 🎉
