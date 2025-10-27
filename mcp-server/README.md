# Aetheria MCP Server

A lightweight Model Context Protocol (MCP) server that serves static Aetheria world reference documentation. This server provides fast, reliable access to the complete Aetheria fantasy world documentation without requiring browser automation or network dependencies.

## Features

- **🚀 Ultra-lightweight**: Just file I/O, no browser automation
- **⚡ Fast**: Instant response times from static files
- **🔒 Secure**: No network dependencies or external crawling
- **📁 Organized**: Serves the complete structured documentation
- **🔄 Simple**: Single resource and tool for all content access

## Installation

```bash
# Install dependencies
npm install

# Build the server
npm run build

# Start the server (stdio mode - default)
npm start

# Start the server (HTTP mode on localhost:3000)
npm run start-http

# Or start with custom host/port
MCP_HOST=0.0.0.0 MCP_PORT=8080 npm start
```

## Configuration

The server can run in two modes:

### stdio Mode (Default)
- Uses standard input/output for MCP communication
- Compatible with MCP clients that expect stdio transport
- No network configuration needed

### HTTP Streaming Mode
- Uses Server-Sent Events (SSE) for streaming responses
- Supports CORS for web client access
- Environment variables:
  - `MCP_HOST`: Host to bind to (default: `127.0.0.1`, use `0.0.0.0` for all interfaces)
  - `MCP_PORT`: Port to listen on (default: `3000`)

## Usage

### MCP Resource

The server provides one resource:

- **`aetheria://page`** - Default access to the index page

### MCP Tool

The server provides one tool:

#### `get_aetheria_page`

Get any page from the Aetheria world reference documentation.

**Parameters:**
- `path` (string, optional): Path to the page. Defaults to "index".

**Examples:**

```json
// Get the main index
{
  "name": "get_aetheria_page"
}

// Get the magic system overview
{
  "name": "get_aetheria_page",
  "arguments": { "path": "magic" }
}

// Get a specific magic school
{
  "name": "get_aetheria_page",
  "arguments": { "path": "magic/fire" }
}

// Get a character page
{
  "name": "get_aetheria_page",
  "arguments": { "path": "characters/valora_iceclaw" }
}

// Get a creature page
{
  "name": "get_aetheria_page",
  "arguments": { "path": "creatures/wolf" }
}
```

## Available Content

The server provides access to:

### Main Sections
- `index` - Home page and world introduction
- `classes` - Character classes and abilities
- `magic` - Magic system overview
- `equipment` - Weapons, armor, and items
- `politics` - Organizations and factions
- `alignment` - Moral and ethical frameworks
- `religion` - Gods, beliefs, and spiritual practices
- `relationships` - Character connections and social dynamics
- `skills` - Available skills and applications

### Magic Schools
- `magic/aether` - Aether magic school
- `magic/air` - Air magic school
- `magic/dark` - Dark magic school
- `magic/earth` - Earth magic school
- `magic/fire` - Fire magic school
- `magic/light` - Light magic school
- `magic/mind` - Mind magic school
- `magic/spirit` - Spirit magic school
- `magic/time` - Time magic school
- `magic/water` - Water magic school

### Characters
- `characters/valora_iceclaw` - Valora Iceclaw character details
- `characters/aria-flameheart` - Aria Flameheart character details

### Creatures
- `creatures/wolf` - Wolf creature details

### Master Index
- `README` - Complete index with all available pages and usage instructions

## Documentation Updates

To update the documentation served by the MCP server:

```bash
# From the main Aetheria directory, generate fresh docs
cd ../site
npm run generate-docs

# Rebuild the MCP server (this will copy the latest docs)
cd ../mcp-server
npm run build
```

## Development

```bash
# Clean and build with latest docs
npm run clean
npm run build

# Build and run in development mode
npm run dev

# Clean build artifacts
npm run clean
```

## Configuration

The server runs on stdio transport by default, making it compatible with any MCP client. No additional configuration is required.

## Architecture

```
mcp-server/
├── src/
│   └── server.ts          # Main MCP server implementation
├── dist/                  # Compiled JavaScript + docs
│   ├── server.js          # Compiled server
│   └── docs/              # Static markdown documentation (copied during build)
│       ├── README.md      # Master index
│       ├── index.md       # Home page
│       ├── magic/         # Magic school pages
│       ├── characters/    # Character pages
│       └── creatures/     # Creature pages
├── test.js               # Comprehensive test suite
├── test-subdirs.js       # Subdirectory access tests
└── package.json          # Project configuration
```

## Benefits Over Dynamic Crawling

- **Reliability**: No network timeouts or browser issues
- **Speed**: Instant file access vs. slow page rendering
- **Simplicity**: ~150 lines vs. complex crawling logic
- **Portability**: Works anywhere with the markdown files
- **Maintenance**: Static files vs. dynamic site dependencies

## Release Packaging

This MCP server is designed to be packaged in releases either:

1. **Standalone**: Just the documentation files
2. **Complete**: MCP server + documentation files

The GitHub Actions workflows can be configured to create both types of releases.

## License

MIT License - see the main Aetheria project for details.
