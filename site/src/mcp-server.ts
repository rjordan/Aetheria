#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  CallToolRequest,
  ReadResourceRequest,
} from '@modelcontextprotocol/sdk/types.js'
import puppeteer from 'puppeteer'

interface AetheriaResource {
  uri: string;
  mimeType: string;
  name: string;
}

class AetheriaIntegratedMCPServer {
  private server: Server
  private browser: any = null
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
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
  }

  private getAvailablePages(): string[] {
    // Static list of known pages - could be made dynamic
    return ['magic', 'classes', 'equipment', 'politics', 'alignment', 'religion', 'relationships']
  }

  private async renderPageContent(pageName: string): Promise<string> {
    try {
      await this.initBrowser()

      const page = await this.browser.newPage()

      // Navigate to the page with hash routing
      const url = `${this.siteUrl}/#/${pageName}`
      console.error(`Rendering page: ${url}`)

      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })

      // Wait for SolidJS to render
      await page.waitForSelector('main', { timeout: 15000 })

      // Give it a moment for dynamic content to load
      await page.waitForTimeout(2000)

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

      await page.close()

      const title = pageName.charAt(0).toUpperCase() + pageName.slice(1)
      return `# ${title} in Aetheria

${content || 'No content extracted'}
`
    } catch (error) {
      console.error(`Error rendering ${pageName}:`, error)
      return `Error rendering ${pageName}: ${error}`
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
        const query = ((args as any)?.query as string)?.toLowerCase() || ''
        const results: string[] = []

        // Search in rendered page content
        const pages = this.getAvailablePages()
        for (const page of pages) {
          const content = await this.renderPageContent(page)
          if (content.toLowerCase().includes(query)) {
            results.push(`Found in ${page} page`)
          }
        }

        return {
          content: [
            {
              type: 'text',
              text: results.length > 0
                ? `Search results for "${query}":\\n${results.join('\\n')}`
                : `No results found for "${query}"`,
            },
          ],
        }
      }

      throw new Error(`Unknown tool: ${name}`)
    })
  }

  async start() {
    const transport = new StdioServerTransport()
    await this.server.connect(transport)
    console.error(`Aetheria MCP Server (Puppeteer) running on stdio - Site: ${this.siteUrl}`)
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close()
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
