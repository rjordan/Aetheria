#!/bin/bash

# Aetheria Development Helper Script

set -e

echo "🌍 Aetheria World Builder"
echo "========================"

case "$1" in
  "mcp")
    echo "🤖 Starting MCP Server..."
    cd mcp-server
    npm run dev
    ;;
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
    echo "🔨 Building all components..."
    echo "Building SolidJS site..."
    cd site && npm run build:github
    cd ..
    echo "Building MCP server..."
    cd mcp-server && npm run build
    cd ..
    echo "✅ All builds complete!"
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
  "docs")
    echo "📄 Generating documentation..."
    cd site
    npm run generate-docs
    cd ..
    echo "✅ Documentation generated!"
    ;;
  *)
    echo "Usage: $0 {mcp|site|site-bun|build|deploy|docs}"
    echo ""
    echo "Commands:"
    echo "  mcp      - Start MCP server for AI integration"
    echo "  site     - Start SolidJS development server (Node.js)"
    echo "  site-bun - Start SolidJS development server (Bun runtime)"
    echo "  build    - Build both SolidJS site and MCP server"
    echo "  deploy   - Build and push to GitHub Pages"
    echo "  docs     - Generate documentation files"
    echo ""
    echo "Examples:"
    echo "  $0 site     # Start SolidJS dev server"
    echo "  $0 mcp      # Start MCP server"
    echo "  $0 deploy   # Build and deploy to GitHub Pages"
    exit 1
    ;;
esac