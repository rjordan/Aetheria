#!/bin/bash

# Aetheria Development Helper Script

set -e

echo "🌍 Aetheria World Builder"
echo "========================"

case "$1" in
  "site")
    echo "🌐 Starting SolidJS development server..."
    cd site
    npm run dev
    ;;
  "site-bun")
    echo "🚀 Starting SolidJS development server with Bun..."
    cd site
    bun run dev
    ;;
  "build")
    echo "🔨 Building SolidJS site..."
    cd site && npm run build:github
    cd ..
    echo "✅ Site build complete!"
    ;;
  "deploy")
    echo "🚀 Building and deploying to GitHub Pages..."
    cd site && npm run build:github
    cd ..
    git add .
    git status
    read -p "Continue with commit and push? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
      git commit -m "Update Aetheria world data - $(date)"
      git push
      echo "✅ Pushed to GitHub! Site will deploy automatically."
    else
      echo "❌ Deployment cancelled."
    fi
    ;;
  "package")
    echo "📦 Generating and packaging AI-optimized documentation..."
    echo "🚀 Generating AI-optimized docs..."
    node generate-ai-docs.js

    echo "📁 Packaging for distribution..."
    cd ai-docs

    # Create comprehensive README for the package
    cat > AI_DOCS_README.md << EOF
# Aetheria AI-Optimized Documentation

**Generated:** $(date -u '+%Y-%m-%d %H:%M:%S UTC')
**Repository:** https://github.com/rjordan/Aetheria

## 🤖 Purpose

This documentation is specifically optimized for AI models and RAG (Retrieval Augmented Generation) systems. Unlike web-oriented docs, these files:

- **Consolidate related information** into single documents
- **Provide complete context** without requiring navigation
- **Include explicit cross-references** between entities
- **Offer multiple access patterns** (comprehensive vs. specific)

## 📚 Quick Start for AI Models

1. **Start here:** \`index.md\` - Master sitemap showing all available content
2. **Get everything:** \`complete-world-overview.md\` - Single comprehensive document
3. **Focus by topic:** \`all-regions.md\`, \`all-magic.md\`, \`all-characters.md\`
4. **Understand relationships:** \`cross-references.md\`

## 🎯 Key Files for AI Consumption

### Consolidated References (Recommended)
- **index.md** - Master sitemap and navigation guide
- **complete-world-overview.md** - Everything in one document ($(wc -w < complete-world-overview.md) words)
- **all-regions.md** - Complete geographic and political reference
- **all-magic.md** - Entire magic system with all schools
- **all-characters.md** - Every named character with full details
- **alignment-system.md** - Complete guide to the four-axis alignment system
- **cross-references.md** - Explicit relationship mapping

### Individual Entity Files
- **regions/** - Detailed files for each region and location
- **characters/** - In-depth character profiles with context
- **magic/** - Individual magic school references

## 📊 Content Statistics

- **Files:** $(find . -name "*.md" | wc -l) markdown documents
- **Regions:** $(ls regions/ 2>/dev/null | wc -l) locations
- **Characters:** $(ls characters/ 2>/dev/null | wc -l) named individuals
- **Magic Schools:** $(ls magic/ 2>/dev/null | wc -l) schools of magic
- **Total Words:** ~$(find . -name "*.md" -exec cat {} \; | wc -w)

## 🔄 Usage Patterns

**For Comprehensive Context:**
Load \`complete-world-overview.md\` for full world knowledge

**For Topic-Focused Work:**
Use \`all-regions.md\`, \`all-magic.md\`, or \`all-characters.md\`

**For Character Interaction:**
Combine character files with \`alignment-system.md\` for personality context

**For World Building:**
Use \`cross-references.md\` to understand entity relationships

---

**Optimized for:** Claude, GPT, LLaMA, and other language models
**Format:** Markdown with rich cross-references and metadata
**Update Frequency:** Generated from source data as needed
EOF

    # Create timestamped archive
    TIMESTAMP=$(date +%Y%m%d-%H%M%S)
    ARCHIVE_NAME="aetheria-ai-docs-${TIMESTAMP}.zip"

    zip -r "../$ARCHIVE_NAME" . -x "*.zip"
    cd ..

    echo "✅ AI documentation package created successfully!"
    echo ""
    echo "📁 Archive: $ARCHIVE_NAME"
    echo "📊 Size: $(du -sh "$ARCHIVE_NAME" | cut -f1)"
    echo "📋 Contents: $(unzip -l "$ARCHIVE_NAME" | tail -1 | awk '{print $2}') files"
    echo ""
    echo "🎯 This package is optimized for:"
    echo "   • AI model consumption (Claude, GPT, etc.)"
    echo "   • RAG system knowledge bases"
    echo "   • Language model fine-tuning"
    echo "   • Interactive fiction development"
    echo ""
    echo "💡 Start with AI_DOCS_README.md inside the archive for usage instructions"
    ;;
  *)
    echo "Usage: $0 {site|site-bun|build|deploy|package}"
    echo ""
    echo "Commands:"
    echo "  site     - Start SolidJS development server (Node.js)"
    echo "  site-bun - Start SolidJS development server (Bun runtime)"
    echo "  build    - Build SolidJS site for GitHub Pages"
    echo "  deploy   - Build and push to GitHub Pages"
    echo "  package  - Generate and package AI-optimized docs for RAG systems"
    echo ""
    echo "Examples:"
    echo "  $0 site     # Start SolidJS dev server"
    echo "  $0 package  # Create AI-optimized docs for vector database"
    echo "  $0 deploy   # Build and deploy to GitHub Pages"
    exit 1
    ;;
esac
