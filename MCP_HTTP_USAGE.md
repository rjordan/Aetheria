# Aetheria MCP Server - HTTP Access Guide

The Aetheria MCP (Model Context Protocol) server serves static world reference documentation as markdown files. It supports both stdio and HTTP transports.

## Starting the Server

### Development Mode (stdio transport)
```bash
cd mcp-server
npm run dev
```

### HTTP Mode (for web integration)
```bash
cd mcp-server
npm run build
npm run start-http
```

The HTTP server will start on port 3000 and bind to all network interfaces (0.0.0.0) by default. You can customize with environment variables:

```bash
# Change port
MCP_PORT=8080 npm run start-http

# Bind to specific interface (localhost only)
MCP_HOST=127.0.0.1 npm run start-http

# Custom port and host
MCP_HOST=192.168.1.100 MCP_PORT=8080 npm run start-http
```

## Network Access

By default, the HTTP server binds to `0.0.0.0:3000`, making it accessible from:
- **Local machine**: `http://localhost:3000`
- **Local network**: `http://[your-ip]:3000`
- **Docker/containers**: `http://0.0.0.0:3000`

## Endpoints

### SSE (Server-Sent Events) Endpoint
- **URL**: `http://localhost:3000`
- **Method**: GET
- **Headers**: `Accept: text/event-stream`

### JSON-RPC Endpoint
- **URL**: `http://localhost:3000`
- **Method**: POST
- **Headers**: `Content-Type: application/json`

## Example Usage

### 1. Initialize the MCP Server

```bash
curl -X POST http://localhost:3000 \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "capabilities": {},
      "clientInfo": {
        "name": "aetheria-client",
        "version": "1.0.0"
      }
    }
  }'
```

### 2. List Available Resources

```bash
curl -X POST http://localhost:3000 \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "resources/list",
    "params": {}
  }'
```

### 3. Read a Resource

```bash
curl -X POST http://localhost:3000 \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "resources/read",
    "params": {
      "uri": "aetheria://page",
      "arguments": {
        "page": "magic"
      }
    }
  }'
```

### 4. List Available Tools

```bash
curl -X POST http://localhost:3000 \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 4,
    "method": "tools/list",
    "params": {}
  }'
```

### 5. Use Search Tool

```bash
curl -X POST http://localhost:3000 \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 5,
    "method": "tools/call",
    "params": {
      "name": "search_pages",
      "arguments": {
        "query": "magic schools",
        "maxResults": 10
      }
    }
  }'
```

## Features

- **Static File Serving**: Fast, reliable markdown file serving
- **Session Management**: UUID-based session tracking
- **CORS Enabled**: Cross-origin requests supported
- **Dual Transport**: Both stdio and HTTP transport options
- **Documentation Generation**: Serves pre-generated markdown docs
- **Search Capability**: Full-text search across all content

## Available Resources

The server provides a single resource endpoint:
- `aetheria://page` - Get any page from the Aetheria world reference

Available pages include:
- `alignment` - Character alignment system
- `classes` - Character classes and specializations
- `equipment` - Weapons, armor, and items
- `magic` - Magic schools and spells
- `politics` - Political systems and organizations
- `religion` - Deities and religious systems
- `relationships` - Character relationships
- `skills` - Skills and abilities
- `index` - Main overview page

## Available Tools

- `search_pages` - Search across all Aetheria documentation
- `get_page_hierarchy` - Get structured page hierarchy
- `generate_character_sheet` - Generate character sheets (if available)
- `extract_entities` - Extract specific entity types

## Technical Details

- **Architecture**: Simple file-based serving (no browser automation)
- **Protocol**: Model Context Protocol (MCP) 2024-11-05
- **Transport**: HTTP Streaming + stdio options
- **Performance**: Fast static file serving
- **Dependencies**: Minimal (no Puppeteer, no heavy frameworks)
- **Data Source**: Pre-generated markdown files in `/docs` directory
- **Port**: 3000 (configurable via MCP_PORT)

## Development Workflow

1. **Generate docs**: Content is generated from the SolidJS site
2. **Build server**: `npm run build` compiles TypeScript
3. **Start server**: `npm run start-http` for HTTP access
4. **Test**: Use curl commands above to verify functionality

The server is lightweight, fast, and reliable - perfect for AI model integration without the complexity of browser automation.
