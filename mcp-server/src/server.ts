#!/usr/bin/env node

/**
 * Aetheria MCP Server
 *
 * A Model Context Protocol server that serves static Aetheria world
 * reference documentation as markdown files.
 *
 * Features:
 * - Dual endpoints: JSON responses on / and SSE streaming on /sse
 * - Single resource: get_aetheria_page
 * - Serves pre-generated markdown files
 * - No dynamic crawling or browser automation
 * - Fast, reliable, and lightweight
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { readFile, access } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { createServer } from 'http'
import { randomUUID } from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

class AetheriaMCPServer {
  private server: Server
  private docsPath: string
  private httpTransport?: StreamableHTTPServerTransport

  constructor() {
    this.server = new Server(
      {
        name: 'aetheria-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          resources: {
            subscribe: true,
            listChanged: true,
          },
          tools: {
            listChanged: true,
          },
        },
      }
    )

    // Path to the docs directory (in dist after build)
    this.docsPath = join(__dirname, 'docs')

    this.setupHandlers()
  }

  private setupHandlers() {
    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'aetheria://page',
            mimeType: 'text/markdown',
            name: 'Aetheria World Reference Page',
            description: 'Get any page from the Aetheria world reference documentation'
          }
        ]
      }
    })

    // Read a specific resource
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params

      if (uri === 'aetheria://page') {
        // Default to index page
        return {
          contents: [
            {
              uri,
              mimeType: 'text/markdown',
              text: await this.getPage('index')
            }
          ]
        }
      }

      throw new Error(`Resource not found: ${uri}`)
    })

    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_aetheria_page',
            description: 'Get a specific page from the Aetheria world reference documentation. Returns the index page if no path is provided or if the requested page is not found.',
            inputSchema: {
              type: 'object',
              properties: {
                path: {
                  type: 'string',
                  description: 'Path to the page (e.g., "magic/fire", "characters/valora_iceclaw"). Defaults to "index" for the main page. If page not found, falls back to index.',
                  default: 'index'
                }
              },
              additionalProperties: false
            }
          }
        ]
      }
    })

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params

      if (name === 'get_aetheria_page') {
        const path = (args?.path as string) || 'index'

        try {
          const content = await this.getPage(path)
          return {
            content: [
              {
                type: 'text',
                text: content
              }
            ]
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error'
          return {
            content: [
              {
                type: 'text',
                text: `Error loading page "${path}": ${errorMessage}`
              }
            ],
            isError: true
          }
        }
      }

      throw new Error(`Tool not found: ${name}`)
    })
  }

  private async getPage(path: string): Promise<string> {
    // Handle empty or undefined path by defaulting to index
    if (!path || path.trim() === '') {
      path = 'index'
    }

    // Sanitize the path to prevent directory traversal
    const safePath = path.replace(/\.\./g, '').replace(/^\/+/, '')

    // Add .md extension if not present
    const filename = safePath.endsWith('.md') ? safePath : `${safePath}.md`
    const filePath = join(this.docsPath, filename)

    try {
      // Check if file exists
      await access(filePath)

      // Read and return the file content
      const content = await readFile(filePath, 'utf-8')
      return content
    } catch (error) {
      // If the file is not found, fallback to index page
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        if (safePath !== 'index.md' && safePath !== 'index') {
          console.error(`Page not found: "${path}", falling back to index`)
          try {
            const indexPath = join(this.docsPath, 'index.md')
            await access(indexPath)
            const content = await readFile(indexPath, 'utf-8')

            // Prepend a note about the fallback
            const fallbackNote = `# Aetheria World Reference\n\n> **Note**: The requested page "${path}" was not found. Showing the main index page instead.\n\n---\n\n`
            return fallbackNote + content
          } catch (indexError) {
            throw new Error(`Page not found: "${path}" and fallback to index failed. Available pages can be found in the README.md index.`)
          }
        }
        throw new Error(`Page not found: "${path}". Available pages can be found in the README.md index.`)
      }
      throw error
    }
  }

  // Handle JSON-RPC message and return response
  async handleJsonRpcMessage(message: any): Promise<any> {
    try {
      const { method, params, id } = message

      switch (method) {
        case 'initialize':
          return {
            jsonrpc: '2.0',
            id,
            result: {
              protocolVersion: '2024-11-05',
              capabilities: {
                resources: {
                  subscribe: true,
                  listChanged: true,
                },
                tools: {
                  listChanged: true,
                },
              },
              serverInfo: {
                name: 'aetheria-mcp-server',
                version: '1.0.0',
              },
            },
          }

        case 'tools/list':
          return {
            jsonrpc: '2.0',
            id,
            result: {
              tools: [
                {
                  name: 'get_aetheria_page',
                  description: 'Get a specific page from the Aetheria world reference documentation. Returns the index page if no path is provided or if the requested page is not found.',
                  inputSchema: {
                    type: 'object',
                    properties: {
                      path: {
                        type: 'string',
                        description: 'Path to the page (e.g., "magic/fire", "characters/valora_iceclaw"). Defaults to "index" for the main page. If page not found, falls back to index.',
                        default: 'index'
                      }
                    },
                    additionalProperties: false
                  }
                }
              ]
            }
          }

        case 'resources/list':
          return {
            jsonrpc: '2.0',
            id,
            result: {
              resources: [
                {
                  uri: 'aetheria://page',
                  mimeType: 'text/markdown',
                  name: 'Aetheria World Reference Page',
                  description: 'Get any page from the Aetheria world reference documentation'
                }
              ]
            }
          }

        case 'tools/call':
          if (params?.name === 'get_aetheria_page') {
            const path = params.arguments?.path || 'index'
            try {
              const content = await this.getPage(path)
              return {
                jsonrpc: '2.0',
                id,
                result: {
                  content: [
                    {
                      type: 'text',
                      text: content
                    }
                  ]
                }
              }
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Unknown error'
              return {
                jsonrpc: '2.0',
                id,
                result: {
                  content: [
                    {
                      type: 'text',
                      text: `Error loading page "${path}": ${errorMessage}`
                    }
                  ],
                  isError: true
                }
              }
            }
          }
          throw new Error(`Tool not found: ${params?.name}`)

        case 'resources/read':
          if (params?.uri === 'aetheria://page') {
            const content = await this.getPage('index')
            return {
              jsonrpc: '2.0',
              id,
              result: {
                contents: [
                  {
                    uri: params.uri,
                    mimeType: 'text/markdown',
                    text: content
                  }
                ]
              }
            }
          }
          throw new Error(`Resource not found: ${params?.uri}`)

        default:
          throw new Error(`Method not found: ${method}`)
      }
    } catch (error) {
      return {
        jsonrpc: '2.0',
        id: message.id || null,
        error: {
          code: -32000,
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }
  }

  async run() {
    // Check if we should run stdio mode
    const useStdio = !process.env.MCP_HOST && !process.env.MCP_PORT

    if (useStdio) {
      await this.runStdioMode()
    } else {
      await this.runHttpMode()
    }
  }

  async runStdioMode() {
    const transport = new StdioServerTransport()
    await this.server.connect(transport)
    console.error('Aetheria MCP Server running on stdio')
  }

  async runHttpMode() {
    const host = process.env.MCP_HOST || '127.0.0.1'
    const port = parseInt(process.env.MCP_PORT || '3000', 10)

    // Create HTTP transport for SSE endpoint
    this.httpTransport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      enableJsonResponse: false, // Use SSE streaming
    })

    // Connect the server to the transport for SSE endpoint
    await this.server.connect(this.httpTransport)

    const httpServer = createServer(async (req, res) => {
      console.error(`Incoming request: ${req.method} ${req.url}`)

      // Handle CORS preflight requests
      if (req.method === 'OPTIONS') {
        console.error('Handling CORS preflight request')
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-mcp-session-id',
          'Access-Control-Max-Age': '86400',
        })
        res.end()
        return
      }

      // Add CORS headers to all responses
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-mcp-session-id')

      // Route based on path
      const url = new URL(req.url || '/', `http://${req.headers.host}`)

      if (url.pathname === '/sse') {
        // Handle SSE streaming endpoint
        await this.handleSSEEndpoint(req, res)
      } else if (url.pathname === '/') {
        // Handle JSON endpoint
        await this.handleJSONEndpoint(req, res)
      } else {
        // Unknown endpoint
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Not found. Use / for JSON or /sse for streaming.' }))
      }
    })

    httpServer.listen(port, host, () => {
      console.error(`Aetheria MCP Server running on http://${host}:${port}`)
      console.error(`- JSON endpoint: http://${host}:${port}/`)
      console.error(`- SSE streaming: http://${host}:${port}/sse`)
    })

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      console.error('Shutting down server...')
      httpServer.close(() => {
        process.exit(0)
      })
    })
  }

  async handleSSEEndpoint(req: any, res: any) {
    console.error('Handling SSE endpoint')

    // Parse request body for POST requests
    let parsedBody: unknown = undefined
    if (req.method === 'POST') {
      console.error('Parsing POST request body')
      const chunks: Buffer[] = []
      for await (const chunk of req) {
        chunks.push(chunk)
      }
      const body = Buffer.concat(chunks).toString()
      if (body) {
        try {
          parsedBody = JSON.parse(body)
          console.error('Parsed body:', JSON.stringify(parsedBody, null, 2))
        } catch (error) {
          console.error('JSON parse error:', error)
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Invalid JSON' }))
          return
        }
      }
    }

    // Handle the request with the SSE transport
    try {
      console.error('Handling request with SSE transport')
      await this.httpTransport!.handleRequest(req, res, parsedBody)
      console.error('Request handled successfully')
    } catch (error) {
      console.error('Error handling SSE request:', error)
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Internal server error' }))
      }
    }
  }

  async handleJSONEndpoint(req: any, res: any) {
    console.error('Handling JSON endpoint')

    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({
        error: 'Method not allowed. Use POST.',
        endpoints: {
          json: 'POST /',
          sse: 'GET/POST /sse'
        }
      }))
      return
    }

    // Parse request body
    const chunks: Buffer[] = []
    for await (const chunk of req) {
      chunks.push(chunk)
    }
    const body = Buffer.concat(chunks).toString()

    if (!body) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Request body required' }))
      return
    }

    let parsedBody: any
    try {
      parsedBody = JSON.parse(body)
      console.error('Parsed body:', JSON.stringify(parsedBody, null, 2))
    } catch (error) {
      console.error('JSON parse error:', error)
      res.writeHead(400, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'Invalid JSON' }))
      return
    }

    // Handle the JSON-RPC request
    try {
      const response = await this.handleJsonRpcMessage(parsedBody)
      console.error('JSON response length:', JSON.stringify(response).length)

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(response))
    } catch (error) {
      console.error('Error handling JSON request:', error)
      const errorResponse = {
        jsonrpc: '2.0',
        id: parsedBody?.id || null,
        error: {
          code: -32000,
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      }
      res.writeHead(500, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(errorResponse))
    }
  }
}

// Start the server
const server = new AetheriaMCPServer()
server.run().catch(console.error)
