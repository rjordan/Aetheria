# Aetheria MCP Server - HTTP Streaming Transport

The Aetheria MCP (Model Context Protocol) server now uses HTTP streaming transport instead of stdio, making it easier to integrate with web applications and HTTP clients.

## Starting the Server

```bash
cd site
npm run mcp
```

The server will start on port 3001 and bind to all network interfaces (0.0.0.0) by default. You can customize the configuration with environment variables:

```bash
# Change port
MCP_PORT=8080 npm run mcp

# Bind to specific interface (localhost only)
MCP_HOST=127.0.0.1 npm run mcp

# Bind to all interfaces (default)
MCP_HOST=0.0.0.0 npm run mcp

# Custom port and host
MCP_HOST=192.168.1.100 MCP_PORT=8080 npm run mcp
```

## Network Access

By default, the server binds to `0.0.0.0:3001`, making it accessible from:
- **Local machine**: `http://localhost:3001`
- **Local network**: `http://[your-ip]:3001`
- **Docker/containers**: `http://0.0.0.0:3001`

If you want to restrict access to localhost only, set `MCP_HOST=127.0.0.1`.

## Endpoints

### SSE (Server-Sent Events) Endpoint
- **URL**: `http://localhost:3001`
- **Method**: GET
- **Headers**: `Accept: text/event-stream`
- **Use case**: For persistent connections and real-time streaming

### JSON-RPC Endpoint
- **URL**: `http://localhost:3001`
- **Method**: POST
- **Headers**:
  - `Content-Type: application/json`
  - `Accept: application/json, text/event-stream`

## Example Usage

### 1. Initialize the MCP Server

```bash
curl -X POST http://localhost:3001 \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "capabilities": {},
      "clientInfo": {
        "name": "your-client",
        "version": "1.0.0"
      }
    }
  }'
```

### 2. List Available Resources

```bash
curl -X POST http://localhost:3001 \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "resources/list",
    "params": {}
  }'
```

### 3. Read a Resource

```bash
curl -X POST http://localhost:3001 \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "resources/read",
    "params": {
      "uri": "aetheria://pages/magic"
    }
  }'
```

### 4. Use Search Tool

```bash
curl -X POST http://localhost:3001 \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{
    "jsonrpc": "2.0",
    "id": 4,
    "method": "tools/call",
    "params": {
      "name": "search_aetheria_pages",
      "arguments": {
        "query": "magic schools"
      }
    }
  }'
```

## Features

- **Session Management**: Each connection gets a unique session ID for state management
- **CORS Enabled**: The server allows cross-origin requests for web integration
- **SSE Streaming**: Real-time event streaming for persistent connections
- **JSON-RPC**: Standard JSON-RPC 2.0 protocol for request/response
- **Puppeteer Integration**: Renders live page content from the Aetheria website
- **Dynamic Resources**: Access to all Aetheria pages (magic, classes, equipment, etc.)
- **Search Capability**: Search across all rendered page content

## Available Resources

The server provides access to the following Aetheria pages:
- `aetheria://pages/magic` - Magic system information
- `aetheria://pages/classes` - Character classes
- `aetheria://pages/equipment` - Equipment and items
- `aetheria://pages/politics` - Political systems
- `aetheria://pages/alignment` - Alignment system
- `aetheria://pages/religion` - Religious information
- `aetheria://pages/relationships` - Character relationships

## Available Tools

- `search_aetheria_pages` - Search across all Aetheria content for specific terms

## Technical Details

- **Transport**: HTTP Streaming (SSE + JSON-RPC)
- **Protocol**: Model Context Protocol (MCP) 2024-11-05
- **Session**: UUID-based session management
- **Rendering**: Puppeteer for dynamic content extraction
- **CORS**: Enabled for cross-origin access
- **Port**: 3001 (configurable via MCP_PORT)

The server automatically handles session initialization, cleanup, and provides both streaming and request/response modes depending on the client needs.
