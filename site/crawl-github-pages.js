#!/usr/bin/env node

// Generate documentation from the live GitHub Pages site
// This version crawls the actual deployed site at https://rjordan.github.io/Aetheria
//
// SECURITY FEATURES:
// - Only crawls pages within the Aetheria GitHub Pages domain
// - Validates all page paths to prevent URL injection attacks
// - Only follows hash-based routes (#/path), never external URLs
// - Regex validation ensures paths contain only safe characters
// - Prevents directory traversal attacks with .. detection
// - Blocks javascript:, data:, and other potentially dangerous protocols

import puppeteer from 'puppeteer'
import { writeFile, mkdir, rm } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

class AetheriaGitHubPagesCrawler {
  constructor() {
    this.browser = null
    this.baseUrl = 'https://rjordan.github.io/Aetheria'
    this.outputDir = 'generated-docs'

    // SECURITY: Validate our expected domain
    if (!this.baseUrl.startsWith('https://rjordan.github.io/Aetheria')) {
      throw new Error('Security error: Invalid base URL detected')
    }
  }

  async init() {
    console.log('🚀 Launching browser...')
    this.browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
        '--disable-gpu'
      ]
    })

    // Clean and recreate output directory to prevent dangling files
    console.log('🧹 Cleaning output directory...')
    if (existsSync(this.outputDir)) {
      await rm(this.outputDir, { recursive: true, force: true })
    }
    await mkdir(this.outputDir, { recursive: true })
  }

  async crawlPage(pagePath, pageTitle) {
    console.log(`📄 Crawling ${pageTitle} (${pagePath})...`)

    const page = await this.browser.newPage()

    try {
      // SECURITY: Validate pagePath to prevent URL injection
      if (pagePath && (
        pagePath.includes('://') ||
        pagePath.includes('javascript:') ||
        pagePath.includes('data:') ||
        pagePath.includes('..') ||
        !/^[a-zA-Z0-9\/_-]*$/.test(pagePath)
      )) {
        throw new Error(`Invalid page path detected: ${pagePath}`)
      }      const url = pagePath ? `${this.baseUrl}/#/${pagePath}` : this.baseUrl
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 20000 })

      // Wait for content to load
      await page.waitForSelector('main', { timeout: 15000 })
      await new Promise(resolve => setTimeout(resolve, 3000)) // Give more time for dynamic content

      // Extract clean text content with structure
      const content = await page.evaluate(() => {
        const main = document.querySelector('main')
        if (!main) return 'No content found'

        function extractContent(element) {
          let text = ''

          for (const child of element.children) {
            const tagName = child.tagName.toLowerCase()

            // Handle headings
            if (tagName.match(/^h[1-6]$/)) {
              const level = '#'.repeat(parseInt(tagName[1]) + 1)
              text += `\n${level} ${child.textContent.trim()}\n\n`
            }
            // Handle paragraphs
            else if (tagName === 'p') {
              const textContent = child.textContent.trim()
              if (textContent && textContent.length > 5) {
                text += `${textContent}\n\n`
              }
            }
            // Handle lists
            else if (tagName === 'ul' || tagName === 'ol') {
              for (const li of child.querySelectorAll('li')) {
                const liText = li.textContent.trim()
                if (liText) {
                  text += `- ${liText}\n`
                }
              }
              text += '\n'
            }
            // Handle tables (for stats, equipment, etc.)
            else if (tagName === 'table') {
              const headers = Array.from(child.querySelectorAll('th')).map(th => th.textContent.trim())
              if (headers.length > 0) {
                text += `\n| ${headers.join(' | ')} |\n`
                text += `|${headers.map(() => '-------').join('|')}|\n`
              }

              const rows = child.querySelectorAll('tr')
              for (const row of rows) {
                const cells = Array.from(row.querySelectorAll('td')).map(td => td.textContent.trim())
                if (cells.length > 0) {
                  text += `| ${cells.join(' | ')} |\n`
                }
              }
              text += '\n'
            }
            // Handle definition lists
            else if (tagName === 'dl') {
              const items = child.querySelectorAll('dt, dd')
              let currentTerm = ''
              for (const item of items) {
                if (item.tagName.toLowerCase() === 'dt') {
                  currentTerm = item.textContent.trim()
                } else if (item.tagName.toLowerCase() === 'dd' && currentTerm) {
                  text += `**${currentTerm}:** ${item.textContent.trim()}\n\n`
                  currentTerm = ''
                }
              }
            }
            // Handle cards and content sections
            else if (tagName === 'div') {
              const className = child.className || ''
              if (className.includes('entity-card') || className.includes('content-card') ||
                  className.includes('skill-item') || className.includes('class-info') ||
                  className.includes('equipment-item')) {

                // Extract structured information from cards
                const title = child.querySelector('h1, h2, h3, h4, .title, .name')?.textContent?.trim()
                const description = child.querySelector('.description, .content, p')?.textContent?.trim()

                if (title) {
                  text += `\n### ${title}\n\n`
                }
                if (description && description !== title) {
                  text += `${description}\n\n`
                }

                // Extract additional card content
                text += extractContent(child)
              } else if (child.children.length > 0) {
                text += extractContent(child)
              } else {
                const textContent = child.textContent.trim()
                if (textContent && textContent.length > 10 && !textContent.includes('Loading')) {
                  text += `${textContent}\n\n`
                }
              }
            }
            // Recurse into other elements
            else if (child.children.length > 0) {
              text += extractContent(child)
            }
            // Handle direct text content
            else {
              const textContent = child.textContent.trim()
              if (textContent && textContent.length > 5 && !textContent.includes('Loading')) {
                text += `${textContent}\n\n`
              }
            }
          }

          return text
        }

        return extractContent(main)
          .replace(/\n\s*\n\s*\n/g, '\n\n') // Clean up extra newlines
          .replace(/Loading[^\n]*/g, '') // Remove loading messages
          .trim()
      })

      return content

    } catch (error) {
      console.error(`❌ Error crawling ${pagePath}:`, error.message)
      return `# ${pageTitle}\n\nError loading content: ${error.message}`
    } finally {
      await page.close()
    }
  }

  async discoverLinks(pagePath) {
    console.log(`🔍 Discovering links on ${pagePath || 'home'}...`)

    const page = await this.browser.newPage()
    const links = []

    try {
      const url = pagePath ? `${this.baseUrl}/#/${pagePath}` : this.baseUrl
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 20000 })

      // Wait for content to load
      await page.waitForSelector('main', { timeout: 15000 })
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Extract links that look like subpages - SECURITY: Only internal hash routes
      const foundLinks = await page.evaluate((baseUrl) => {
        const links = []
        const anchors = document.querySelectorAll('a[href*="#/"]')

        for (const anchor of anchors) {
          const href = anchor.getAttribute('href')
          const text = anchor.textContent.trim()

          if (href && href.includes('#/') && text && text.length > 0) {
            // SECURITY CHECK: Ensure this is a hash route, not an external URL
            if (href.startsWith('#/')) {
              // Extract the path after #/
              const path = href.split('#/')[1]

              // SECURITY: Only allow paths that don't contain URLs, protocols, or suspicious characters
              if (path &&
                  !path.includes('http') &&
                  !path.includes('://') &&
                  !path.includes('javascript:') &&
                  !path.includes('data:') &&
                  !path.includes('..') &&
                  path.length > 0 &&
                  /^[a-zA-Z0-9\/_-]+$/.test(path)) {                links.push({
                  path: path,
                  title: text,
                  fullHref: href
                })
              }
            }
          }
        }

        return links
      }, this.baseUrl)

      // Filter out duplicates and main navigation
      const uniqueLinks = foundLinks.filter((link, index, self) =>
        index === self.findIndex(l => l.path === link.path) &&
        !['', 'home', 'classes', 'magic', 'equipment', 'creatures', 'politics', 'alignment', 'religion', 'relationships', 'skills'].includes(link.path.toLowerCase())
      )

      console.log(`Found ${uniqueLinks.length} subpage links on ${pagePath || 'home'}`)
      return uniqueLinks

    } catch (error) {
      console.error(`❌ Error discovering links on ${pagePath}:`, error.message)
      return []
    } finally {
      await page.close()
    }
  }

  async discoverEntityPages() {
    console.log('🔍 Discovering entity pages from data files...')

    const entityPages = []

    try {
      // Discover characters
      const charactersUrl = `${this.baseUrl}/data/characters.json`
      const charactersResponse = await fetch(charactersUrl)
      if (charactersResponse.ok) {
        const charactersData = await charactersResponse.json()
        const characterIds = Object.keys(charactersData.characters || {})

        for (const id of characterIds) {
          const character = charactersData.characters[id]
          entityPages.push({
            path: `characters/${id}`,
            title: character.name || id,
            subtitle: `Character: ${character.race || 'Unknown'} ${character.class || 'Character'}`,
            filename: `characters/${id}.md`,
            type: 'character'
          })
        }
        console.log(`Found ${characterIds.length} characters`)
      }

      // Discover creatures
      const creaturesUrl = `${this.baseUrl}/data/creatures.json`
      const creaturesResponse = await fetch(creaturesUrl)
      if (creaturesResponse.ok) {
        const creaturesData = await creaturesResponse.json()
        const creatureIds = Object.keys(creaturesData.creatures || {})

        for (const id of creatureIds) {
          const creature = creaturesData.creatures[id]
          entityPages.push({
            path: `creatures/${id}`,
            title: creature.name || id,
            subtitle: `Creature: Threat Level ${creature.threatLevel || 'Unknown'}`,
            filename: `creatures/${id}.md`,
            type: 'creature'
          })
        }
        console.log(`Found ${creatureIds.length} creatures`)
      }

    } catch (error) {
      console.error('❌ Error discovering entity pages:', error.message)
    }

    console.log(`📋 Total entity pages discovered: ${entityPages.length}`)
    return entityPages
  }

  async generateDocuments() {
    console.log('🔄 Generating individual markdown files for each page...')

    // Define main pages
    const mainPages = [
      { path: '', title: 'Home', subtitle: 'Introduction to Aetheria', filename: 'index.md' },
      { path: 'classes', title: 'Character Classes', subtitle: 'Detailed information about all character classes', filename: 'classes.md' },
      { path: 'magic', title: 'Magic System', subtitle: 'Schools of magic, spells, and magical theory', filename: 'magic.md' },
      { path: 'equipment', title: 'Equipment & Items', subtitle: 'Weapons, armor, and magical artifacts', filename: 'equipment.md' },
      { path: 'politics', title: 'Political Systems', subtitle: 'Organizations, factions, and governance', filename: 'politics.md' },
      { path: 'alignment', title: 'Alignment System', subtitle: 'Moral and ethical frameworks', filename: 'alignment.md' },
      { path: 'religion', title: 'Religion & Deities', subtitle: 'Gods, beliefs, and spiritual practices', filename: 'religion.md' },
      { path: 'relationships', title: 'Character Relationships', subtitle: 'Social connections and interactions', filename: 'relationships.md' },
      { path: 'skills', title: 'Skills System', subtitle: 'Available skills and their applications', filename: 'skills.md' }
    ]

    // Discover all subpages
    console.log('🔍 Phase 1: Discovering all subpages...')
    const allSubpages = []

    for (const mainPage of mainPages) {
      if (mainPage.path) { // Skip home page for link discovery
        const subpages = await this.discoverLinks(mainPage.path)
        for (const subpage of subpages) {
          allSubpages.push({
            ...subpage,
            parentPage: mainPage.path,
            parentTitle: mainPage.title,
            subtitle: `Detailed information from ${mainPage.title}`,
            filename: `${subpage.path}.md`
          })
        }
      }
    }

    console.log(`📋 Found ${allSubpages.length} total subpages to crawl`)

    // Discover entity pages (characters and creatures)
    console.log('🔍 Phase 2: Discovering entity pages...')
    const entityPages = await this.discoverEntityPages()

    // Combine main pages, subpages, and entity pages
    const allPages = [...mainPages, ...allSubpages, ...entityPages]

    // Generate individual files
    console.log('📄 Phase 3: Generating individual markdown files...')
    const generatedFiles = []

    for (const pageInfo of allPages) {
      try {
        console.log(`📝 Generating ${pageInfo.filename}...`)

        const content = await this.crawlPage(pageInfo.path, pageInfo.title)

        // Generate markdown with navigation links
        const markdown = this.generatePageMarkdown(pageInfo, content, allPages)

        // Save individual file (create directory if needed)
        const filePath = join(this.outputDir, pageInfo.filename)
        const fileDir = join(filePath, '..')
        if (!existsSync(fileDir)) {
          await mkdir(fileDir, { recursive: true })
        }
        await writeFile(filePath, markdown, 'utf-8')

        generatedFiles.push({
          path: filePath,
          filename: pageInfo.filename,
          title: pageInfo.title,
          size: markdown.length
        })

      } catch (error) {
        console.error(`❌ Failed to generate ${pageInfo.filename}:`, error.message)

        // Generate error file
        const errorMarkdown = this.generateErrorPage(pageInfo, error.message, allPages)
        const filePath = join(this.outputDir, pageInfo.filename)
        const fileDir = join(filePath, '..')
        if (!existsSync(fileDir)) {
          await mkdir(fileDir, { recursive: true })
        }
        await writeFile(filePath, errorMarkdown, 'utf-8')

        generatedFiles.push({
          path: filePath,
          filename: pageInfo.filename,
          title: pageInfo.title,
          size: errorMarkdown.length,
          error: true
        })
      }
    }

    // Generate index file with links to all pages
    console.log('📋 Generating master index...')
    const indexMarkdown = this.generateIndexPage(mainPages, allSubpages, entityPages, generatedFiles)
    const indexPath = join(this.outputDir, 'README.md')
    await writeFile(indexPath, indexMarkdown, 'utf-8')

    generatedFiles.push({
      path: indexPath,
      filename: 'README.md',
      title: 'Master Index',
      size: indexMarkdown.length
    })

    return generatedFiles
  }

  generatePageMarkdown(pageInfo, content, allPages) {
    const timestamp = new Date().toLocaleString()
    const navigation = this.generateNavigation(pageInfo, allPages)

    // Calculate relative path to README.md
    const currentDepth = (pageInfo.filename.match(/\//g) || []).length
    const relativePrefix = currentDepth > 0 ? '../'.repeat(currentDepth) : ''

    return `# ${pageInfo.title}

*Generated on: ${timestamp}*
*Source: ${this.baseUrl}${pageInfo.path ? `/#/${pageInfo.path}` : ''}*

${navigation}

---

${content}

---

${navigation}

*This document is part of the Aetheria World Reference. See [${relativePrefix}README.md](${relativePrefix}README.md) for the complete index.*
`
  }

  generateErrorPage(pageInfo, errorMessage, allPages) {
    const timestamp = new Date().toLocaleString()
    const navigation = this.generateNavigation(pageInfo, allPages)

    // Calculate relative path to README.md
    const currentDepth = (pageInfo.filename.match(/\//g) || []).length
    const relativePrefix = currentDepth > 0 ? '../'.repeat(currentDepth) : ''

    return `# ${pageInfo.title}

*Generated on: ${timestamp}*
*Source: ${this.baseUrl}${pageInfo.path ? `/#/${pageInfo.path}` : ''}*

${navigation}

---

## ⚠️ Content Unavailable

**Error:** ${errorMessage}

*${pageInfo.subtitle || 'Content could not be loaded for this section.'}*

This page could not be generated due to an error. Please check the source website or try regenerating the documentation.

---

${navigation}

*This document is part of the Aetheria World Reference. See [${relativePrefix}README.md](${relativePrefix}README.md) for the complete index.*
`
  }

  generateNavigation(currentPage, allPages) {
    const mainPages = allPages.filter(p => !p.parentPage && !p.type)
    const subpages = allPages.filter(p => p.parentPage)
    const entityPages = allPages.filter(p => p.type)

    // Calculate relative path prefix based on current page depth
    const currentDepth = (currentPage.filename.match(/\//g) || []).length
    const relativePrefix = currentDepth > 0 ? '../'.repeat(currentDepth) : ''

    let nav = '## Navigation\n\n'

    // Main sections
    nav += '### Main Sections\n'
    for (const page of mainPages) {
      const link = relativePrefix + page.filename
      const current = page.path === currentPage.path ? ' *(current)*' : ''
      nav += `- [${page.title}](${link})${current}\n`
    }

    // Subpages for current parent (if applicable)
    if (currentPage.parentPage || subpages.some(p => p.parentPage === currentPage.path)) {
      const parentPath = currentPage.parentPage || currentPage.path
      const relatedSubpages = subpages.filter(p => p.parentPage === parentPath)

      if (relatedSubpages.length > 0) {
        nav += `\n### ${currentPage.parentTitle || currentPage.title} Subsections\n`
        for (const page of relatedSubpages) {
          const link = relativePrefix + page.filename
          const current = page.path === currentPage.path ? ' *(current)*' : ''
          nav += `- [${page.title}](${link})${current}\n`
        }
      }
    }

    // Entity sections (characters and creatures) - show a few examples
    const characters = entityPages.filter(p => p.type === 'character')
    const creatures = entityPages.filter(p => p.type === 'creature')

    if (characters.length > 0 || creatures.length > 0) {
      nav += `\n### Entity Pages\n`

      if (characters.length > 0) {
        nav += `**Characters** (${characters.length} total)\n`
        // Show first 3 characters as examples
        const exampleCharacters = characters.slice(0, 3)
        for (const char of exampleCharacters) {
          const current = char.path === currentPage.path ? ' *(current)*' : ''
          nav += `- [${char.title}](${relativePrefix}${char.filename})${current}\n`
        }
        if (characters.length > 3) {
          nav += `- ... and ${characters.length - 3} more characters\n`
        }
      }

      if (creatures.length > 0) {
        nav += `\n**Creatures** (${creatures.length} total)\n`
        // Show first 3 creatures as examples
        const exampleCreatures = creatures.slice(0, 3)
        for (const creature of exampleCreatures) {
          const current = creature.path === currentPage.path ? ' *(current)*' : ''
          nav += `- [${creature.title}](${relativePrefix}${creature.filename})${current}\n`
        }
        if (creatures.length > 3) {
          nav += `- ... and ${creatures.length - 3} more creatures\n`
        }
      }
    }

    nav += `\n[📋 Complete Index](${relativePrefix}README.md)\n`

    return nav
  }

  generateIndexPage(mainPages, subpages, entityPages, generatedFiles) {
    const timestamp = new Date().toLocaleString()
    const totalSize = generatedFiles.reduce((sum, file) => sum + file.size, 0)
    const errorCount = generatedFiles.filter(f => f.error).length

    const characters = entityPages.filter(p => p.type === 'character')
    const creatures = entityPages.filter(p => p.type === 'creature')

    return `# Aetheria World Reference - Complete Index

*Generated on: ${timestamp}*
*Source: ${this.baseUrl}*

This directory contains individual markdown files for each section of the Aetheria world reference. Each file is self-contained and includes navigation links to related sections.

## Statistics

- **Total Files:** ${generatedFiles.length}
- **Total Size:** ${Math.round(totalSize / 1024)} KB
- **Main Sections:** ${mainPages.length}
- **Subsections:** ${subpages.length}
- **Characters:** ${characters.length}
- **Creatures:** ${creatures.length}
- **Errors:** ${errorCount}

## Main Sections

${mainPages.map(page => {
  const file = generatedFiles.find(f => f.filename === page.filename)
  const size = file ? `(${Math.round(file.size / 1024)} KB)` : ''
  const status = file?.error ? ' ⚠️' : ' ✅'
  return `- [${page.title}](${page.filename}) - ${page.subtitle} ${size}${status}`
}).join('\n')}

## Detailed Subsections

${subpages.map(page => {
  const file = generatedFiles.find(f => f.filename === page.filename)
  const size = file ? `(${Math.round(file.size / 1024)} KB)` : ''
  const status = file?.error ? ' ⚠️' : ' ✅'
  return `- [${page.title}](${page.filename}) - From ${page.parentTitle} ${size}${status}`
}).join('\n')}

## Characters

${characters.map(page => {
  const file = generatedFiles.find(f => f.filename === page.filename)
  const size = file ? `(${Math.round(file.size / 1024)} KB)` : ''
  const status = file?.error ? ' ⚠️' : ' ✅'
  return `- [${page.title}](${page.filename}) - ${page.subtitle} ${size}${status}`
}).join('\n')}

## Creatures

${creatures.map(page => {
  const file = generatedFiles.find(f => f.filename === page.filename)
  const size = file ? `(${Math.round(file.size / 1024)} KB)` : ''
  const status = file?.error ? ' ⚠️' : ' ✅'
  return `- [${page.title}](${page.filename}) - ${page.subtitle} ${size}${status}`
}).join('\n')}

## Usage for AI Models

Each markdown file can be loaded individually into an AI model's context:

1. **For general questions:** Start with [index.md](index.md)
2. **For specific topics:** Load the relevant main section file
3. **For detailed information:** Load both the main section and related subsections
4. **For magic system:** Load [magic.md](magic.md) plus any specific school files (e.g., [magic-fire.md](magic-fire.md))

### Recommended Loading Patterns

- **Character Creation:** [classes.md](classes.md) + [skills.md](skills.md) + [alignment.md](alignment.md)
- **Magic System:** [magic.md](magic.md) + relevant school files
- **World Building:** [politics.md](politics.md) + [religion.md](religion.md) + [relationships.md](relationships.md)
- **Combat/Items:** [equipment.md](equipment.md) + [creatures.md](creatures.md)

## Recommended Markdown Viewers

For the best reading experience on different platforms:

### Windows
- **[Obsidian](https://obsidian.md/)** (Free) - Excellent for interconnected documents, shows relationships between pages
- **[MarkText](https://github.com/marktext/marktext)** (Free) - Clean, real-time preview editor
- **[Typora](https://typora.io/)** (Paid) - Premium WYSIWYG markdown editor with beautiful rendering

### Cross-Platform
- **[Zettlr](https://www.zettlr.com/)** (Free) - Academic-focused with great cross-reference support
- **[Joplin](https://joplinapp.org/)** (Free) - Note-taking app with excellent markdown support

### Web-Based
- **GitHub** - View files directly in your browser at the repository
- **GitLab/Gitea** - If you prefer other Git platforms

**Recommendation:** Obsidian is particularly good for this documentation because it can visualize the connections between characters, magic schools, and world elements as an interactive graph.

## MCP Server Integration

These files are designed to be served by the MCP server as static content, eliminating the need for dynamic page crawling.

---

*This index provides access to the complete Aetheria world reference in modular, context-friendly format.*
`
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close()
    }
  }
}

// Main execution
async function main() {
  const crawler = new AetheriaGitHubPagesCrawler()

  try {
    await crawler.init()
    const generatedFiles = await crawler.generateDocuments()

    console.log('\n🎉 Individual markdown file generation complete!')
    console.log(`� Generated ${generatedFiles.length} files:`)

    const totalSize = generatedFiles.reduce((sum, file) => sum + file.size, 0)
    const errorCount = generatedFiles.filter(f => f.error).length

    for (const file of generatedFiles) {
      const status = file.error ? '❌' : '✅'
      const size = `(${Math.round(file.size / 1024)} KB)`
      console.log(`   ${status} ${file.filename} ${size}`)
    }

    console.log(`\n📊 Total size: ${Math.round(totalSize / 1024)} KB`)
    if (errorCount > 0) {
      console.log(`⚠️  ${errorCount} files had errors`)
    }

    console.log('\n💡 Each file is self-contained with navigation links!')
    console.log('� See README.md for the complete index and usage instructions.')
    console.log('🔗 Perfect for modular AI context loading!')

  } catch (error) {
    console.error('❌ Generation failed:', error)
  } finally {
    await crawler.cleanup()
  }
}

main().catch(console.error)
