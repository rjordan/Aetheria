#!/bin/bash

# Aetheria Development Helper Script

set -e

echo "🌍 Aetheria World Builder"
echo "========================"

case "$1" in
  "mcp")
    echo "🤖 Starting integrated MCP Server..."
    cd site
    npm run build:mcp && npm run mcp
    ;;
  "mcp-old")
    echo "🤖 Starting legacy MCP Server..."
    cd mcp-server
    npm run dev
    ;;
  "site")
    echo "🌐 Starting SolidJS development server..."
    cd site
    npm run dev
    ;;
  "build")
    echo "🔨 Building all components..."
    echo "Building SolidJS site..."
    cd site && npm run build:github
    cd ..
    echo "Building integrated MCP server..."
    cd site && npm run build:mcp
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
  "clean")
    echo "� Cleaning up old MCP server..."
    rm -rf mcp-server
    echo "✅ Old MCP server removed!"
    ;;
  *)
    echo "Usage: $0 {mcp|site|build|deploy|clean}"
    echo ""
    echo "Commands:"
    echo "  mcp     - Start integrated MCP server (shares SolidJS data)"
    echo "  site    - Start SolidJS development server"
    echo "  build   - Build both SolidJS site and MCP server"
    echo "  deploy  - Build and push to GitHub Pages"
    echo "  clean   - Remove old MCP server directory"
    echo ""
    echo "Examples:"
    echo "  $0 site    # Start SolidJS dev server"
    echo "  $0 mcp     # Start MCP server with shared data"
    echo "  $0 deploy  # Build and deploy to GitHub Pages"
    exit 1
    ;;
esac
