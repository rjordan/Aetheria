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
    echo "🌐 Building and previewing static site..."
    cd site-generator
    npm run build
    echo "📖 Opening preview at http://localhost:8002"
    cd dist && python3 -m http.server 8002
    ;;
  "build")
    echo "🔨 Building all components..."
    echo "Building MCP server..."
    cd mcp-server && npm run build
    cd ..
    echo "Building static site..."
    cd site-generator && npm run build
    cd ..
    echo "✅ All builds complete!"
    ;;
  "deploy")
    echo "🚀 Deploying to GitHub Pages..."
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
  "test")
    echo "🧪 Testing MCP server capabilities..."
    cd mcp-server
    npx tsx src/test.ts
    ;;
  *)
    echo "Usage: $0 {mcp|site|build|deploy|test}"
    echo ""
    echo "Commands:"
    echo "  mcp     - Start MCP server in development mode"
    echo "  site    - Build and preview static site locally"
    echo "  build   - Build both MCP server and static site"
    echo "  deploy  - Commit and push changes (triggers GitHub Pages)"
    echo "  test    - Test MCP server capabilities"
    echo ""
    echo "Examples:"
    echo "  $0 site    # Preview your website locally"
    echo "  $0 deploy  # Push changes and update GitHub Pages"
    exit 1
    ;;
esac
