#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  CallToolRequest,
  ReadResourceRequest,
} from '@modelcontextprotocol/sdk/types.js'
import { createServer } from 'http'
import { randomUUID } from 'crypto'
import { readFile } from 'fs/promises'
import { join } from 'path'
import puppeteer from 'puppeteer'

interface AetheriaResource {
  uri: string;
  mimeType: string;
  name: string;
}

class AetheriaIntegratedMCPServer {
  private server: Server
  private browser: any = null
  private httpServer: any = null
  private siteUrl: string

  constructor() {
    // Use either local dev server or GitHub Pages
    this.siteUrl = process.env.AETHERIA_SITE_URL || 'https://rjordan.github.io/Aetheria'

    this.server = new Server(
      {
        name: 'aetheria-integrated-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    )

    this.setupHandlers()
  }

  private async initBrowser(): Promise<void> {
    if (this.browser) return

    console.error('Launching headless browser...')
    try {
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-web-security',
          '--disable-features=VizDisplayCompositor',
          '--disable-gpu',
          '--no-first-run',
          '--no-default-browser-check',
          '--disable-dev-shm-usage'
        ]
      })
      console.error('Browser launched successfully')
    } catch (error) {
      console.error('Failed to launch browser:', error)
      throw error
    }
  }

  private getAvailablePages(): string[] {
    // Static list of known pages - could be made dynamic
    return ['magic', 'classes', 'equipment', 'politics', 'alignment', 'religion', 'relationships']
  }

  private async searchJsonData(query: string): Promise<string[]> {
    const results: string[] = []
    const dataFiles = ['classes.json', 'creatures.json', 'equipment.json', 'magic.json', 'organizations.json']

    for (const fileName of dataFiles) {
      try {
        // Use relative path from the site directory
        const filePath = join('public', 'data', fileName)
        const content = await readFile(filePath, 'utf-8')
        const data = JSON.parse(content)

        // Search in the JSON content
        const jsonString = JSON.stringify(data, null, 2).toLowerCase()
        if (jsonString.includes(query.toLowerCase())) {
          const dataType = fileName.replace('.json', '')
          results.push(`**${dataType.charAt(0).toUpperCase() + dataType.slice(1)} Data:** Found matches in JSON data`)
        }
      } catch (error) {
        console.error(`Error searching ${fileName}:`, error)
      }
    }

    return results
  }  private async renderPageContent(pageName: string): Promise<string> {
    let page = null
    try {
      await this.initBrowser()

      page = await this.browser.newPage()

      // Set reasonable timeouts and limits
      await page.setDefaultTimeout(15000)
      await page.setDefaultNavigationTimeout(15000)

      // Navigate to the page with hash routing
      const url = `${this.siteUrl}/#/${pageName}`
      console.error(`Rendering page: ${url}`)

      await page.goto(url, {
        waitUntil: 'networkidle0',
        timeout: 15000
      })

      // Wait for SolidJS to render
      await page.waitForSelector('main', { timeout: 10000 })

      // Give it a moment for dynamic content to load
      await page.waitForTimeout(1000)

      // Extract the content as clean text
      const content = await page.evaluate(() => {
        const main = document.querySelector('main')
        if (!main) return 'No main content found'

        // Function to extract text while preserving structure
        function extractTextWithStructure(element: Element): string {
          let result = ''

          for (const child of element.children) {
            const tagName = child.tagName.toLowerCase()

            // Add structural markers
            if (tagName === 'h1') result += '\\n# '
            else if (tagName === 'h2') result += '\\n## '
            else if (tagName === 'h3') result += '\\n### '
            else if (tagName === 'h4') result += '\\n#### '
            else if (tagName === 'p') result += '\\n\\n'
            else if (tagName === 'dt') result += '\\n**'
            else if (tagName === 'dd') result += '**: '
            else if (tagName === 'th') result += '\\n| '
            else if (tagName === 'td') result += ' | '
            else if (tagName === 'tr') result += '\\n'

            // Get text content
            if (child.children.length > 0) {
              result += extractTextWithStructure(child)
            } else {
              const text = child.textContent?.trim()
              if (text) result += text
            }

            // Close structural markers
            if (tagName === 'dt') result += '**'
            else if (tagName === 'p' || tagName.startsWith('h')) result += '\\n'
          }

          return result
        }

        return extractTextWithStructure(main)
          .replace(/\\n\\s*\\n\\s*\\n/g, '\\n\\n') // Clean up extra newlines
          .replace(/^\\s+|\\s+$/g, '') // Trim
          .trim()
      })

      const title = pageName.charAt(0).toUpperCase() + pageName.slice(1)
      return `# ${title} in Aetheria

${content || 'No content extracted'}
`
    } catch (error) {
      console.error(`Error rendering ${pageName}:`, error)
      return `Error rendering ${pageName}: ${error instanceof Error ? error.message : 'Unknown error'}`
    } finally {
      // Always close the page to prevent memory leaks
      if (page) {
        try {
          await page.close()
        } catch (closeError) {
          console.error(`Error closing page for ${pageName}:`, closeError)
        }
      }
    }
  }

  private async setupHandlers() {
    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      const pages = this.getAvailablePages()
      const resources: AetheriaResource[] = []

      // Rendered page content resources
      for (const page of pages) {
        resources.push({
          uri: `aetheria://pages/${page}`,
          mimeType: 'text/markdown',
          name: `${page.charAt(0).toUpperCase() + page.slice(1)} (Rendered Content)`,
        })
      }

      return { resources }
    })

    // Read resource content
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request: ReadResourceRequest) => {
      const { uri } = request.params
      let content: string
      const mimeType = 'text/markdown'

      if (uri.startsWith('aetheria://pages/')) {
        // Serve rendered page content using Puppeteer
        const pageName = uri.replace('aetheria://pages/', '')
        content = await this.renderPageContent(pageName)
      } else {
        throw new Error(`Unknown resource: ${uri}`)
      }

      return {
        contents: [{
          uri,
          mimeType,
          text: content,
        }],
      }
    })

    // Tool handlers
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'search_aetheria_pages',
            description: 'Search across rendered Aetheria pages for specific terms or concepts',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query to find relevant content',
                },
              },
              required: ['query'],
            },
          },
        ],
      }
    })

    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params

      if (name === 'search_aetheria_pages') {
        try {
          const query = ((args as any)?.query as string)?.toLowerCase() || ''
          if (!query.trim()) {
            return {
              content: [
                {
                  type: 'text',
                  text: 'Please provide a search query',
                },
              ],
            }
          }

          console.error(`Searching for: "${query}"`)
          const results: string[] = []

          // First, search in JSON data (faster and more reliable)
          try {
            const jsonResults = await this.searchJsonData(query)
            results.push(...jsonResults)
          } catch (error) {
            console.error('Error searching JSON data:', error)
          }

          // Then search in rendered pages (limit to avoid overwhelming)
          const pages = this.getAvailablePages().slice(0, 3) // Limit to first 3 pages
          let successfulSearches = 0
          const maxSearches = 2 // Further limit to prevent crashes

          // Process pages one at a time to avoid overwhelming the browser
          for (const page of pages) {
            if (successfulSearches >= maxSearches) break

            try {
              console.error(`Searching in ${page} page...`)

              // Add timeout for page rendering
              const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Page render timeout')), 10000)
              })

              const renderPromise = this.renderPageContent(page)
              const content = await Promise.race([renderPromise, timeoutPromise]) as string

              if (content.toLowerCase().includes(query)) {
                // Extract a snippet of context around the match
                const lowerContent = content.toLowerCase()
                const queryIndex = lowerContent.indexOf(query)
                const start = Math.max(0, queryIndex - 100)
                const end = Math.min(content.length, queryIndex + query.length + 100)
                const snippet = content.substring(start, end).trim()

                results.push(`**${page.charAt(0).toUpperCase() + page.slice(1)} Page:**\n...${snippet}...\n`)
                successfulSearches++
              }
            } catch (error) {
              console.error(`Error searching ${page}:`, error)
              // Don't add error results, just continue to next page
            }
          }

          const responseText = results.length > 0
            ? `Search results for "${query}":\n\n${results.join('\n')}`
            : `No results found for "${query}" in the searched content. Note: Only searched first few pages due to performance limits.`

          return {
            content: [
              {
                type: 'text',
                text: responseText,
              },
            ],
          }
        } catch (error) {
          console.error('Search tool error:', error)
          return {
            content: [
              {
                type: 'text',
                text: `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}. Try a different search term.`,
              },
            ],
          }
        }
      }

      throw new Error(`Unknown tool: ${name}`)
    })
  }

  async start() {
    const port = process.env.MCP_PORT ? parseInt(process.env.MCP_PORT) : 3001
    const host = process.env.MCP_HOST || '0.0.0.0'  // Bind to all interfaces by default

    // Create HTTP transport with session management
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (sessionId) => {
        console.error(`MCP session initialized: ${sessionId}`)
      },
      onsessionclosed: (sessionId) => {
        console.error(`MCP session closed: ${sessionId}`)
      }
    })

    // Create HTTP server
    const httpServer = createServer(async (req, res) => {
      // Enable CORS for browser access
      res.setHeader('Access-Control-Allow-Origin', '*')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept, Authorization, X-Session-ID')

      if (req.method === 'OPTIONS') {
        res.writeHead(200)
        res.end()
        return
      }

      // Parse request body for POST requests
      let body = null
      if (req.method === 'POST') {
        const chunks: Buffer[] = []
        req.on('data', (chunk) => chunks.push(chunk))
        req.on('end', () => {
          const rawBody = Buffer.concat(chunks).toString()
          try {
            body = JSON.parse(rawBody)
          } catch (e) {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Invalid JSON' }))
            return
          }
          transport.handleRequest(req, res, body)
        })
      } else {
        transport.handleRequest(req, res)
      }
    })

    // Connect the MCP server to the transport
    await this.server.connect(transport)

    // Start HTTP server
    httpServer.listen(port, host, () => {
      console.error(`Aetheria MCP Server running on HTTP ${host}:${port} - Site: ${this.siteUrl}`)
      console.error(`Access via: http://${host === '0.0.0.0' ? 'localhost' : host}:${port}`)
      console.error(`SSE endpoint: http://${host === '0.0.0.0' ? 'localhost' : host}:${port} (GET request)`)
      console.error(`JSON-RPC endpoint: http://${host === '0.0.0.0' ? 'localhost' : host}:${port} (POST request)`)
      if (host === '0.0.0.0') {
        console.error(`Also available on all network interfaces (0.0.0.0:${port})`)
      }
    })

    // Store server reference for cleanup
    this.httpServer = httpServer
  }  async cleanup() {
    if (this.browser) {
      await this.browser.close()
    }
    if (this.httpServer) {
      this.httpServer.close()
    }
  }
}

const server = new AetheriaIntegratedMCPServer()

// Cleanup on exit
process.on('SIGINT', async () => {
  await server.cleanup()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await server.cleanup()
  process.exit(0)
})

server.start().catch(console.error)
