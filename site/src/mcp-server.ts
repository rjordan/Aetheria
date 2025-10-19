#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  CallToolRequest,
  ListResourcesRequest,
  ReadResourceRequest,
  ListToolsRequest,
} from '@modelcontextprotocol/sdk/types.js'

// Import our SolidJS data
import {
  magicSchoolsData,
  classesData,
  equipmentData,
  organizationsData,
  creaturesData,
  siteData,
} from './data/index.js'

interface AetheriaResource {
  uri: string;
  mimeType: string;
  name: string;
}

interface GenerationParameters {
  format?: 'markdown' | 'json' | 'html';
  [key: string]: any;
}

class AetheriaIntegratedMCPServer {
  private server: Server

  constructor() {
    this.server = new Server(
      {
        name: 'aetheria-integrated-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      },
    )

    this.setupHandlers()
  }

  private setupHandlers(): void {
    this.server.setRequestHandler(ListResourcesRequestSchema, async (request: ListResourcesRequest) => {
      const resources: AetheriaResource[] = [
        {
          uri: 'aetheria://data/magic_schools',
          mimeType: 'application/json',
          name: 'Magic Schools',
        },
        {
          uri: 'aetheria://data/classes',
          mimeType: 'application/json',
          name: 'Character Classes',
        },
        {
          uri: 'aetheria://data/equipment',
          mimeType: 'application/json',
          name: 'Equipment',
        },
        {
          uri: 'aetheria://data/organizations',
          mimeType: 'application/json',
          name: 'Organizations',
        },
        {
          uri: 'aetheria://data/creatures',
          mimeType: 'application/json',
          name: 'Creatures',
        },
        {
          uri: 'aetheria://data/site',
          mimeType: 'application/json',
          name: 'Site Configuration',
        },
      ]

      return { resources }
    })

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request: ReadResourceRequest) => {
      const { uri } = request.params

      let data: any
      switch (uri) {
        case 'aetheria://data/magic_schools':
          data = magicSchoolsData
          break
        case 'aetheria://data/classes':
          data = classesData
          break
        case 'aetheria://data/equipment':
          data = equipmentData
          break
        case 'aetheria://data/organizations':
          data = organizationsData
          break
        case 'aetheria://data/creatures':
          data = creaturesData
          break
        case 'aetheria://data/site':
          data = siteData
          break
        default:
          throw new Error(`Unknown resource: ${uri}`)
      }

      return {
        contents: [{
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(data, null, 2),
        }],
      }
    })

    this.server.setRequestHandler(ListToolsRequestSchema, async (request: ListToolsRequest) => {
      return {
        tools: [
          {
            name: 'get_magic_school',
            description: 'Get detailed information about a specific magic school',
            inputSchema: {
              type: 'object',
              properties: {
                school_key: {
                  type: 'string',
                  description: 'The key/identifier of the magic school',
                },
                format: {
                  type: 'string',
                  description: 'Output format',
                  enum: ['markdown', 'json', 'html'],
                  default: 'markdown',
                },
              },
              required: ['school_key'],
            },
          },
          {
            name: 'list_magic_schools',
            description: 'List all available magic schools with summary information',
            inputSchema: {
              type: 'object',
              properties: {
                format: {
                  type: 'string',
                  description: 'Output format',
                  enum: ['markdown', 'json', 'html'],
                  default: 'markdown',
                },
              },
            },
          },
          {
            name: 'get_character_class',
            description: 'Get detailed information about a character class',
            inputSchema: {
              type: 'object',
              properties: {
                class_key: {
                  type: 'string',
                  description: 'The key/identifier of the character class',
                },
                format: {
                  type: 'string',
                  description: 'Output format',
                  enum: ['markdown', 'json', 'html'],
                  default: 'markdown',
                },
              },
              required: ['class_key'],
            },
          },
          {
            name: 'search_equipment',
            description: 'Search for equipment by name or category',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search term for equipment name',
                },
                category: {
                  type: 'string',
                  description: 'Equipment category to search in',
                  enum: ['weapons', 'armor_and_shields', 'miscellaneous'],
                },
                format: {
                  type: 'string',
                  description: 'Output format',
                  enum: ['markdown', 'json', 'html'],
                  default: 'markdown',
                },
              },
            },
          },
        ],
      }
    })

    this.server.setRequestHandler(CallToolRequestSchema, async (request: CallToolRequest) => {
      const { name, arguments: args } = request.params

      if (!args) {
        throw new Error('No arguments provided')
      }

      switch (name) {
        case 'get_magic_school':
          return await this.getMagicSchool(args.school_key as string, args.format as string)
        case 'list_magic_schools':
          return await this.listMagicSchools(args.format as string)
        case 'get_character_class':
          return await this.getCharacterClass(args.class_key as string, args.format as string)
        case 'search_equipment':
          return await this.searchEquipment(args.query as string, args.category as string, args.format as string)
        default:
          throw new Error(`Unknown tool: ${name}`)
      }
    })
  }

  private async getMagicSchool(schoolKey: string, format: string = 'markdown'): Promise<any> {
    const school = (magicSchoolsData as any).magic_schools[schoolKey]

    if (!school) {
      return {
        content: [{
          type: 'text',
          text: `Magic school '${schoolKey}' not found. Available schools: ${Object.keys((magicSchoolsData as any).magic_schools).join(', ')}`,
        }],
      }
    }

    let content: string

    if (format === 'json') {
      content = JSON.stringify(school, null, 2)
    } else if (format === 'html') {
      content = this.renderMagicSchoolHtml(schoolKey, school)
    } else {
      content = this.renderMagicSchoolMarkdown(schoolKey, school)
    }

    return {
      content: [{
        type: 'text',
        text: content,
      }],
    }
  }

  private async listMagicSchools(format: string = 'markdown'): Promise<any> {
    const schools = (magicSchoolsData as any).magic_schools

    if (format === 'json') {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(schools, null, 2),
        }],
      }
    }

    let content = '# Magic Schools of Aetheria\n\n'

    Object.entries(schools).forEach(([key, school]: [string, any]) => {
      content += `## ${school.name}\n`
      content += `**Key:** ${key}\n`
      content += `**Description:** ${school.description}\n`
      if (school.focus) {
        const focusDisplay = Array.isArray(school.focus) ? school.focus.join(', ') : school.focus
        content += `**Focus:** ${focusDisplay}\n`
      }
      if (school.regulation) {
        content += `**Regulation:** ${school.regulation}\n`
      }
      content += '\n---\n\n'
    })

    return {
      content: [{
        type: 'text',
        text: content,
      }],
    }
  }

  private async getCharacterClass(classKey: string, format: string = 'markdown'): Promise<any> {
    const characterClass = (classesData as any)[classKey]

    if (!characterClass) {
      return {
        content: [{
          type: 'text',
          text: `Character class '${classKey}' not found. Available classes: ${Object.keys(classesData as any).join(', ')}`,
        }],
      }
    }

    let content: string

    if (format === 'json') {
      content = JSON.stringify(characterClass, null, 2)
    } else {
      content = `# ${characterClass.name} Class\n\n`
      content += `${characterClass.description}\n\n`
      if (characterClass.alternative_names) {
        content += `**Alternative Names:** ${characterClass.alternative_names}\n\n`
      }
      if (characterClass.weapons_armor) {
        content += `**Weapons & Armor:** ${characterClass.weapons_armor}\n\n`
      }
    }

    return {
      content: [{
        type: 'text',
        text: content,
      }],
    }
  }

  private async searchEquipment(query?: string, category?: string, format: string = 'markdown'): Promise<any> {
    const equipment = (equipmentData as any).equipment
    let results: any[] = []

    const searchInCategory = (categoryData: any, categoryName: string) => {
      Object.entries(categoryData).forEach(([key, item]: [string, any]) => {
        if (!query || key.toLowerCase().includes(query.toLowerCase()) ||
            (item.name && item.name.toLowerCase().includes(query.toLowerCase()))) {
          results.push({ key, category: categoryName, ...item })
        }
      })
    }

    if (category) {
      if (equipment[category]) {
        searchInCategory(equipment[category], category)
      }
    } else {
      Object.entries(equipment).forEach(([catName, catData]) => {
        searchInCategory(catData, catName)
      })
    }

    if (format === 'json') {
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(results, null, 2),
        }],
      }
    }

    let content = '# Equipment Search Results\n\n'
    if (query) content += `**Search Query:** ${query}\n`
    if (category) content += `**Category:** ${category}\n`
    content += `**Results Found:** ${results.length}\n\n`

    results.forEach(item => {
      content += `## ${item.name || item.key}\n`
      content += `**Category:** ${item.category}\n`
      if (item.description) content += `**Description:** ${item.description}\n`
      if (item.damage) content += `**Damage:** ${item.damage}\n`
      if (item.properties) content += `**Properties:** ${Array.isArray(item.properties) ? item.properties.join(', ') : item.properties}\n`
      content += '\n---\n\n'
    })

    return {
      content: [{
        type: 'text',
        text: content,
      }],
    }
  }

  private renderMagicSchoolMarkdown(key: string, school: any): string {
    let content = `# ${school.name}\n\n`
    content += `**School Key:** ${key}\n\n`
    content += `${school.description}\n\n`
    content += '## School Information\n\n'

    if (school.focus) {
      content += '### Focus Areas\n'
      if (Array.isArray(school.focus)) {
        content += school.focus.map((f: string) => `- ${f}`).join('\n') + '\n\n'
      } else {
        content += `- ${school.focus}\n\n`
      }
    }

    if (school.regulation) {
      content += `**Regulation Status:** ${school.regulation}\n\n`
    }

    if (school.opposing_element) {
      content += `**Opposing Element:** ${school.opposing_element}\n\n`
    }

    content += '---\n*Magic school from the Aetheria world*\n'
    return content
  }

  private renderMagicSchoolHtml(key: string, school: any): string {
    // This simulates what the SolidJS component would render
    let html = '<div>'
    html += `<h1>${school.name} Magic School</h1>`
    html += `<p><strong>School Key:</strong> ${key}</p>`
    html += `<p>${school.description}</p>`
    html += '<h2>School Information</h2>'

    if (school.focus) {
      html += '<h3>Focus Areas</h3><ul>'
      if (Array.isArray(school.focus)) {
        html += school.focus.map((f: string) => `<li>${f}</li>`).join('')
      } else {
        html += `<li>${school.focus}</li>`
      }
      html += '</ul>'
    }

    if (school.regulation) {
      html += `<p><strong>Regulation Status:</strong> ${school.regulation}</p>`
    }

    if (school.opposing_element) {
      html += `<p><strong>Opposing Element:</strong> ${school.opposing_element}</p>`
    }

    html += '<hr><p><em>Magic school from the Aetheria world</em></p>'
    html += '</div>'

    return html
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport()
    await this.server.connect(transport)
    console.error('Aetheria Integrated MCP server running on stdio')
  }
}

const server = new AetheriaIntegratedMCPServer()
server.run().catch(console.error)
