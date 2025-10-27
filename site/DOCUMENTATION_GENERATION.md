# Aetheria Documentation Generation

This directory contains tools to generate comprehensive reference documents from the Aetheria GitHub Pages site, providing direct downloadable content for AI model contexts.

## Overview

This approach generates static markdown documents that can be directly downloaded and used in any AI model's context. The documentation is generated from the live GitHub Pages deployment at https://rjordan.github.io/Aetheria.

## Available Scripts

### Documentation Generation

Generates modular documentation from the live GitHub Pages site:

```bash
node crawl-github-pages.js
```

**What it does:**
- Crawls the live GitHub Pages site
- Discovers all main pages and subpages (like magic schools)
- Generates individual markdown files for each page
- Creates cross-linked navigation between related sections
- Produces a master index with usage instructions

**Output:**
- Individual `.md` files for each page (e.g., `magic.md`, `classes.md`)
- Magic school pages (e.g., `magic-fire.md`, `magic-aether.md`)
- Master index (`README.md`) with complete navigation
- All files include cross-links and navigation

## Automated Releases

Documentation generation is also automated via GitHub Actions:

- **Manual Release**: Trigger via GitHub Actions to create versioned releases
- **Auto-testing**: PRs automatically test documentation generation
- **ZIP Archives**: Complete documentation packages for easy download
- **Professional Releases**: Detailed release notes and usage instructions

See `.github/workflows/README.md` for complete automation documentation.

## Generated Content

The generated documents are organized as individual markdown files with cross-navigation:

### Main Sections
- **index.md** - Home page and world introduction
- **classes.md** - All character classes and abilities
- **magic.md** - Schools of magic and general magical theory
- **equipment.md** - Weapons, armor, and magical artifacts
- **creatures.md** - Bestiary with creatures and monsters
- **politics.md** - Organizations, factions, and governance
- **alignment.md** - Moral and ethical frameworks
- **religion.md** - Gods, beliefs, and spiritual practices
- **relationships.md** - Character connections and social dynamics
- **skills.md** - Available skills and their applications

### Magic School Subsections
- **magic-fire.md**, **magic-water.md**, etc. - Detailed spell lists for each school
- Complete spell descriptions with specialist requirements
- Elemental focuses and opposing elements
- Regulation status for each school

### Master Index
- **README.md** - Complete file index and usage instructions
- Statistics on all generated files
- Recommended loading patterns for AI models
- Usage examples for different scenarios

## Document Features

### Modular Structure
- Each file is self-contained and context-friendly
- Cross-linked navigation between related sections
- Optimal file sizes for AI context windows (1KB-16KB each)
- No monolithic documents that exceed context limits

### Rich Formatting
- Structured markdown with proper headings
- Formatted tables for stats and equipment
- Navigation sections with current page indicators
- Source URLs and generation timestamps

## Usage Scenarios

### For AI Model Context
1. Download the generated .txt or .md file
2. Add it to your AI model's context/knowledge base
3. Reference Aetheria world information without MCP

### For Documentation
1. Use the markdown files for human-readable reference
2. Host them on wikis or documentation sites
3. Convert to other formats (PDF, HTML, etc.)

### For Development
1. Use as source material for game development
2. Reference for consistency in world-building
3. Extract specific sections for focused contexts

## Technical Details

### Content Extraction
- Uses Puppeteer for reliable JavaScript rendering
- Waits for dynamic content to load fully
- Extracts structured information from tables and cards
- Preserves formatting and hierarchy

### Output Quality
- **Word Count:** ~11,000 words (GitHub Pages version)
- **File Size:** ~70KB markdown, ~60KB plain text
- **Coverage:** All major world systems and content
- **Format:** Clean, structured, AI-friendly

### Reliability
- No runtime dependencies for generated files
- No server requirements for consumption
- Version-controlled documentation
- Consistent output format

## Comparison with MCP Approach

| Aspect | MCP Server | Static Documents |
|--------|------------|------------------|
| **Setup** | Complex server + client | Simple script execution |
| **Dependencies** | Runtime server, network | None after generation |
| **Reliability** | Network/server dependent | 100% reliable |
| **Speed** | Real-time but slower | Instant access |
| **Compatibility** | MCP-compatible tools only | Universal |
| **Maintenance** | Ongoing server management | Regenerate as needed |

## Regeneration

Documents should be regenerated when:
- Website content is updated
- New pages or sections are added
- Data structures change
- You want the latest information

Simply run the appropriate script to get updated documentation.

## File Management

Generated files are timestamped and stored in `generated-docs/`:
- Latest files can be identified by timestamp
- Previous versions are preserved for comparison
- Easy to track changes over time

## Integration Tips

### For AI Assistants
- Use the plain text version for maximum token efficiency
- The markdown version provides better structure for complex queries
- Both contain identical information

### For Workflows
- Integrate generation into CI/CD pipelines
- Automatically update documentation on site deploys
- Version control the generated files for change tracking

---

This approach provides a practical, reliable solution for making Aetheria world information accessible to AI models and human users without the complexity of MCP servers.
