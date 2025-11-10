#!/usr/bin/env node

/**
 * AI-Optimized Documentation Generator for Aetheria
 *
 * This script transforms the fragmented web-oriented JSON data into
 * AI-friendly consolidated markdown documents that provide:
 *
 * 1. Complete content discovery (master sitemap)
 * 2. Consolidated topic files (all related info in one place)
 * 3. Rich cross-references and context
 * 4. Hierarchical structure in content, not URLs
 */

import { readFile, writeFile, mkdir, readdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

class AetheriaAIDocsGenerator {
  constructor() {
    this.dataPath = join(__dirname, 'site', 'public', 'data')
    this.outputPath = join(__dirname, 'ai-docs')
    this.data = {}
  }

  async loadAllData() {
    console.log('📚 Loading all data files...')

    const files = await readdir(this.dataPath)
    for (const file of files) {
      if (file.endsWith('.json')) {
        const name = file.replace('.json', '')
        const content = await readFile(join(this.dataPath, file), 'utf-8')

        // Skip empty files
        if (!content.trim()) {
          console.log(`  ⚠️  Skipped empty ${name}.json`)
          continue
        }

        try {
          this.data[name] = JSON.parse(content)
          console.log(`  ✓ Loaded ${name}.json`)
        } catch (error) {
          console.log(`  ✗ Failed to parse ${name}.json: ${error.message}`)
        }
      }
    }
  }

  async ensureOutputDir() {
    await mkdir(this.outputPath, { recursive: true })
    await mkdir(join(this.outputPath, 'regions'), { recursive: true })
    await mkdir(join(this.outputPath, 'characters'), { recursive: true })
    await mkdir(join(this.outputPath, 'magic'), { recursive: true })
    await mkdir(join(this.outputPath, 'classes'), { recursive: true })
    await mkdir(join(this.outputPath, 'creatures'), { recursive: true })
    await mkdir(join(this.outputPath, 'reference'), { recursive: true })
  }

  generateMasterSitemap() {
    console.log('🗺️  Generating master sitemap...')

    let content = `# Aetheria World Reference - Master Index

> **For AI Models**: This document provides a complete sitemap and overview of all available content in the Aetheria fantasy world. Use this to understand what information is available and how to access it.

## Quick Navigation

### Core Reference Documents
- **[Complete World Overview](complete-world-overview.md)** - Comprehensive single document containing all world information
- **[All Regions](all-regions.md)** - Every region, city, and location in one document
- **[All Magic](all-magic.md)** - Complete magical system, schools, and spells
- **[All Characters](all-characters.md)** - Every named character and their details
- **[All Classes](all-classes.md)** - Complete character classes system with abilities and advancement
- **[All Creatures](all-creatures.md)** - Complete bestiary with stats, alignments, and behaviors
- **[Political Systems](politics-complete.md)** - Government structures, titles, and guilds
- **[Alignment System](alignment-system.md)** - Complete guide to the four-axis alignment system
- **[Cross-References](cross-references.md)** - Relationship mapping between all entities

### Individual Topic Files
`

    // Add regions
    if (this.data.regions?.regions) {
      content += '\n#### Regions\n'
      Object.entries(this.data.regions.regions).forEach(([key, region]) => {
        content += `- **[${region.name}](regions/${key}.md)** - ${region.description?.substring(0, 100) || 'Regional details'}...\n`

        // Add sub-regions
        if (region.regions) {
          Object.entries(region.regions).forEach(([subKey, subRegion]) => {
            content += `  - [${subRegion.name}](regions/${key}-${subKey}.md) - ${subRegion.description?.substring(0, 80) || 'Sub-region details'}...\n`
          })
        }
      })
    }

    // Add characters
    if (this.data.characters?.characters) {
      content += '\n#### Characters\n'
      Object.entries(this.data.characters.characters).forEach(([key, character]) => {
        content += `- **[${character.name}](characters/${key}.md)** - ${character.description?.substring(0, 100) || 'Character details'}...\n`
      })
    }

    // Add magic schools
    if (this.data.magic?.magic?.schools) {
      content += '\n#### Magic Schools\n'
      Object.entries(this.data.magic.magic.schools).forEach(([key, school]) => {
        content += `- **[${school.name}](magic/${key}.md)** - ${school.description?.substring(0, 100) || 'Magic school details'}...\n`
      })
    }

    // Add classes
    if (this.data.classes?.classes) {
      content += '\n#### Character Classes\n'
      const allClasses = {}

      // Collect all classes from different categories
      if (this.data.classes.classes.core) {
        Object.entries(this.data.classes.classes.core).forEach(([key, classData]) => {
          allClasses[key] = { ...classData, category: 'Core' }
        })
      }
      if (this.data.classes.classes.specialized) {
        Object.entries(this.data.classes.classes.specialized).forEach(([key, classData]) => {
          allClasses[key] = { ...classData, category: 'Specialized' }
        })
      }

      Object.entries(allClasses).forEach(([key, classData]) => {
        content += `- **[${classData.name}](classes/${key}.md)** - ${classData.description?.substring(0, 100) || 'Character class details'}...\n`
      })
    }

    // Add creatures
    if (this.data.creatures?.creatures) {
      content += '\n#### Creatures\n'
      Object.entries(this.data.creatures.creatures).forEach(([key, creature]) => {
        content += `- **[${creature.name}](creatures/${key}.md)** - ${creature.description?.substring(0, 100) || 'Creature details'}... (Threat Level ${creature.threatLevel || 'Unknown'})\n`
      })
    }

    content += `

## Content Organization

### Consolidated Files (Recommended for AI)
These files contain complete information on major topics:

1. **complete-world-overview.md** - Everything in one document
2. **all-regions.md** - All geographic and political information
3. **all-magic.md** - Complete magical system
4. **all-characters.md** - All named characters
5. **all-classes.md** - Complete character classes system
6. **all-creatures.md** - Complete bestiary and creature reference
7. **politics-complete.md** - All political and social structures

### Individual Files
Detailed documents for specific entities, each containing:
- Complete entity information
- Related entities and cross-references
- Context from parent/child relationships

### Cross-Reference System
The cross-references.md file maps relationships between:
- Characters and their home regions
- Magic schools and their practitioners
- Political figures and their territories
- Historical events and involved parties

## Usage for AI Models

1. **Start with this index** to understand available content
2. **Use consolidated files** for comprehensive topic coverage
3. **Check cross-references** for entity relationships
4. **Access individual files** for detailed entity information

Last updated: ${new Date().toISOString()}
`

    return content
  }

  generateCompleteWorldOverview() {
    console.log('🌍 Generating complete world overview...')

    let content = `# Aetheria - Complete World Reference

> **Comprehensive Document**: This single document contains all essential information about the Aetheria fantasy world. Perfect for AI models needing complete context.

## Table of Contents
- [Geography and Regions](#geography-and-regions)
- [Magic System](#magic-system)
- [Characters](#characters)
- [Character Classes](#character-classes)
- [Creatures](#creatures)
- [Political Systems](#political-systems)
- [Skills and Abilities](#skills-and-abilities)
- [Equipment and Items](#equipment-and-items)
- [Organizations](#organizations)

---

# Geography and Regions

`

    // Add all regions
    if (this.data.regions?.regions) {
      Object.entries(this.data.regions.regions).forEach(([key, region]) => {
        content += `## ${region.name} (${key})\n\n`
        content += `**Type**: ${region.type || 'Region'}\n`
        content += `**Leader**: ${region.leader || 'Unknown'}\n`
        content += `**Population**: ${region.population || 'Unknown'}\n`
        content += `**Political System**: ${region.system || 'Unknown'}\n\n`
        content += `${region.description || 'No description available.'}\n\n`

        // Add racial demographics
        if (region.races) {
          content += '**Racial Demographics**:\n'
          Object.entries(region.races).forEach(([race, percentage]) => {
            content += `- ${race}: ${percentage}%\n`
          })
          content += '\n'
        }

        // Add sub-regions
        if (region.regions) {
          content += '**Notable Locations**:\n'
          Object.entries(region.regions).forEach(([subKey, subRegion]) => {
            content += `### ${subRegion.name}\n`
            content += `- **Leader**: ${subRegion.leader || 'Unknown'}\n`
            content += `- **Type**: ${subRegion.type || 'Location'}\n`
            content += `- **Population**: ${subRegion.population || 'Unknown'}\n`
            content += `- **Description**: ${subRegion.description || 'No description available.'}\n\n`
          })
        }

        content += '---\n\n'
      })
    }

    // Add magic system
    content += '# Magic System\n\n'
    if (this.data.magic?.magic?.schools) {
      Object.entries(this.data.magic.magic.schools).forEach(([key, school]) => {
        content += `## ${school.name} Magic (${key})\n\n`
        content += `${school.description || 'No description available.'}\n\n`

        // Add focus areas
        if (school.focus && Array.isArray(school.focus)) {
          content += '**Focus Areas**: ' + school.focus.join(', ') + '\n\n'
        }

        // Add metadata
        if (school.rarity) content += `**Rarity**: ${school.rarity}\n`
        if (school.regulation) content += `**Regulation**: ${school.regulation}\n`
        if (school.opposing_element) content += `**Opposing Element**: ${school.opposing_element}\n\n`

        if (school.spells) {
          content += '**Known Spells**:\n'
          Object.entries(school.spells).forEach(([spellKey, spell]) => {
            content += `- **${spell.name}**: ${spell.description || 'No description.'}\n`
          })
          content += '\n'
        }
        content += '---\n\n'
      })
    }

    // Add characters
    content += '# Characters\n\n'
    if (this.data.characters?.characters) {
      Object.entries(this.data.characters.characters).forEach(([key, character]) => {
        content += `## ${character.name} (${key})\n\n`
        content += `${character.description || 'No description available.'}\n\n`

        if (character.background) content += `**Background**: ${character.background}\n\n`
        if (character.race) content += `**Race**: ${character.race}\n`
        if (character.class) content += `**Class**: ${character.class}\n`
        if (character.alignment) content += `**Alignment**: ${this.formatAlignment(character.alignment)}\n`
        if (character.location) content += `**Location**: ${character.location}\n`

        content += '---\n\n'
      })
    }

    // Add Classes section
    content += '# Character Classes\n\n'
    if (this.data.classes?.classes) {
      const allClasses = {}

      // Collect all classes from different categories
      if (this.data.classes.classes.core) {
        Object.entries(this.data.classes.classes.core).forEach(([key, classData]) => {
          allClasses[key] = { ...classData, category: 'Core' }
        })
      }
      if (this.data.classes.classes.specialized) {
        Object.entries(this.data.classes.classes.specialized).forEach(([key, classData]) => {
          allClasses[key] = { ...classData, category: 'Specialized' }
        })
      }

      Object.entries(allClasses).forEach(([key, classData]) => {
        content += `## ${classData.name} (${key})\n\n`
        content += `**Category**: ${classData.category}\n\n`
        content += `${classData.description || 'No description available.'}\n\n`

        if (classData.populationPercentage !== undefined) {
          content += `**Population**: ${classData.populationPercentage}% of the population\n\n`
        }

        content += '---\n\n'
      })
    }

    // Add Creatures section
    content += '# Creatures\n\n'
    if (this.data.creatures?.creatures) {
      Object.entries(this.data.creatures.creatures).forEach(([key, creature]) => {
        content += `## ${creature.name} (${key})\n\n`
        content += `**Threat Level**: ${creature.threatLevel || 'Unknown'}\n\n`
        content += `${creature.description || 'No description available.'}\n\n`

        if (creature.alignment) {
          content += `**Alignment**: ${this.formatAlignment(creature.alignment)}\n\n`
        }

        content += '---\n\n'
      })
    }

    // Continue with other sections...
    content += this.generatePoliticsSection()
    content += this.generateSkillsSection()
    content += this.generateEquipmentSection()
    content += this.generateOrganizationsSection()

    return content
  }

  generateAllMagic() {
    console.log('✨ Generating all-magic document...')

    let content = `# Aetheria - Complete Magic System

> **Comprehensive Magic Reference**: This document contains detailed information about the entire magical system in Aetheria, including all schools, spells, and magical concepts.

## Magic Schools Overview

`

    if (this.data.magic?.magic?.schools) {
      // Generate table of contents
      Object.entries(this.data.magic.magic.schools).forEach(([key, school]) => {
        content += `- [${school.name} Magic](#${this.slugify(school.name)}-magic)\n`
      })

      content += '\n---\n\n'

      // Generate detailed sections
      Object.entries(this.data.magic.magic.schools).forEach(([key, school]) => {
        content += `# ${school.name} Magic\n\n`
        content += `**School ID**: ${key}\n\n`

        content += `## Description\n${school.description || 'No description available.'}\n\n`

        // Add focus areas
        if (school.focus && Array.isArray(school.focus)) {
          content += '## Focus Areas\n'
          school.focus.forEach(focus => {
            content += `- ${focus}\n`
          })
          content += '\n'
        }

        // Add metadata
        content += '## Details\n'
        if (school.rarity) content += `- **Rarity**: ${school.rarity}\n`
        if (school.regulation) content += `- **Regulation**: ${school.regulation}\n`
        if (school.opposing_element) content += `- **Opposing Element**: ${school.opposing_element}\n`
        content += '\n'

        if (school.spells) {
          content += '## Spells\n\n'
          Object.entries(school.spells).forEach(([spellKey, spell]) => {
            content += `### ${spell.name}\n\n`
            content += `**Spell ID**: ${spellKey}\n\n`
            content += `${spell.description || 'No description available.'}\n\n`
          })
        }

        content += '---\n\n'
      })
    } else {
      content += '*No magic school data available.*\n'
    }

    return content
  }

  generateAllCharacters() {
    console.log('👥 Generating all-characters document...')

    let content = `# Aetheria - Complete Character Reference

> **All Named Characters**: This document contains detailed information about every named character in the Aetheria world.

## Character Overview

`

    if (this.data.characters?.characters) {
      // Generate table of contents
      Object.entries(this.data.characters.characters).forEach(([key, character]) => {
        content += `- [${character.name}](#${this.slugify(character.name)})\n`
      })

      content += '\n---\n\n'

      // Generate detailed sections
      Object.entries(this.data.characters.characters).forEach(([key, character]) => {
        content += `# ${character.name}\n\n`
        content += `**Character ID**: ${key}\n\n`

        content += `## Description\n${character.description || 'No description available.'}\n\n`

        content += '## Details\n'
        if (character.race) content += `- **Race**: ${character.race}\n`
        if (character.class) content += `- **Class**: ${character.class}\n`
        if (character.alignment) content += `- **Alignment**: ${this.formatAlignment(character.alignment)}\n`
        if (character.location) content += `- **Location**: ${character.location}\n`
        content += '\n'

        if (character.background) {
          content += `## Background\n${character.background}\n\n`
        }

        content += '---\n\n'
      })
    } else {
      content += '*No character data available.*\n'
    }

    return content
  }

  generateAllClasses() {
    console.log('⚔️ Generating all-classes document...')

    let content = `# Aetheria - Complete Character Classes Reference

> **Character Classes System**: This document contains detailed information about all character classes available in the Aetheria world, including their descriptions, abilities, and population distribution.

## Classes Overview

`

    if (this.data.classes?.classes) {
      // Process both core and specialized classes
      const allClasses = {}

      // Collect all classes from different categories
      if (this.data.classes.classes.core) {
        Object.entries(this.data.classes.classes.core).forEach(([key, classData]) => {
          allClasses[key] = { ...classData, category: 'Core' }
        })
      }
      if (this.data.classes.classes.specialized) {
        Object.entries(this.data.classes.classes.specialized).forEach(([key, classData]) => {
          allClasses[key] = { ...classData, category: 'Specialized' }
        })
      }

      // Generate table of contents
      content += '### Core Classes\n'
      Object.entries(allClasses).filter(([key, classData]) => classData.category === 'Core').forEach(([key, classData]) => {
        content += `- [${classData.name}](#${this.slugify(classData.name)})\n`
      })

      if (Object.keys(allClasses).some(([key, classData]) => classData.category === 'Specialized')) {
        content += '\n### Specialized Classes\n'
        Object.entries(allClasses).filter(([key, classData]) => classData.category === 'Specialized').forEach(([key, classData]) => {
          content += `- [${classData.name}](#${this.slugify(classData.name)})\n`
        })
      }

      content += '\n---\n\n'

      // Generate detailed sections by category
      content += '# Core Classes\n\n'
      Object.entries(allClasses).filter(([key, classData]) => classData.category === 'Core').forEach(([key, classData]) => {
        content += `## ${classData.name}\n\n`
        content += `**Class ID**: ${key}\n`
        content += `**Category**: ${classData.category}\n\n`

        content += `### Description\n${classData.description || 'No description available.'}\n\n`

        // Population percentage
        if (classData.populationPercentage !== undefined) {
          content += `### Population\n**${classData.populationPercentage}%** of the population belongs to this class.\n\n`
        }

        // Alternative names
        if (classData.alternativeNames && Array.isArray(classData.alternativeNames)) {
          content += '### Alternative Names\n'
          classData.alternativeNames.forEach(name => {
            content += `- ${name}\n`
          })
          content += '\n'
        }

        // Key abilities
        if (classData.keyAbilities && Array.isArray(classData.keyAbilities)) {
          content += '### Key Abilities\n'
          classData.keyAbilities.forEach(ability => {
            content += `- **${ability.name}**: ${ability.description}\n`
          })
          content += '\n'
        }

        // Advancement paths
        if (classData.advancement && Array.isArray(classData.advancement)) {
          content += '### Advancement Paths\n'
          classData.advancement.forEach(path => {
            content += `- **${path.name}**: ${path.description}\n`
          })
          content += '\n'
        }

        content += '---\n\n'
      })

      // Specialized classes if they exist
      const specializedClasses = Object.entries(allClasses).filter(([key, classData]) => classData.category === 'Specialized')
      if (specializedClasses.length > 0) {
        content += '# Specialized Classes\n\n'
        specializedClasses.forEach(([key, classData]) => {
          content += `## ${classData.name}\n\n`
          content += `**Class ID**: ${key}\n`
          content += `**Category**: ${classData.category}\n\n`

          content += `### Description\n${classData.description || 'No description available.'}\n\n`

          // Population percentage
          if (classData.populationPercentage !== undefined) {
            content += `### Population\n**${classData.populationPercentage}%** of the population belongs to this class.\n\n`
          }

          // Alternative names
          if (classData.alternativeNames && Array.isArray(classData.alternativeNames)) {
            content += '### Alternative Names\n'
            classData.alternativeNames.forEach(name => {
              content += `- ${name}\n`
            })
            content += '\n'
          }

          // Key abilities
          if (classData.keyAbilities && Array.isArray(classData.keyAbilities)) {
            content += '### Key Abilities\n'
            classData.keyAbilities.forEach(ability => {
              content += `- **${ability.name}**: ${ability.description}\n`
            })
            content += '\n'
          }

          // Advancement paths
          if (classData.advancement && Array.isArray(classData.advancement)) {
            content += '### Advancement Paths\n'
            classData.advancement.forEach(path => {
              content += `- **${path.name}**: ${path.description}\n`
            })
            content += '\n'
          }

          content += '---\n\n'
        })
      }
    } else {
      content += '*No character class data available.*\n'
    }

    return content
  }

  generateAllCreatures() {
    console.log('🐺 Generating all-creatures document...')

    let content = `# Aetheria - Complete Creatures Reference

> **Creature Bestiary**: This document contains detailed information about all creatures in the Aetheria world, including their stats, alignments, and behaviors.

## Creatures Overview

`

    if (this.data.creatures?.creatures) {
      // Generate table of contents
      Object.entries(this.data.creatures.creatures).forEach(([key, creature]) => {
        content += `- [${creature.name}](#${this.slugify(creature.name)}) (Threat Level ${creature.threatLevel || 'Unknown'})\n`
      })

      content += '\n---\n\n'

      // Generate detailed sections
      Object.entries(this.data.creatures.creatures).forEach(([key, creature]) => {
        content += `# ${creature.name}\n\n`
        content += `**Creature ID**: ${key}\n`
        content += `**Threat Level**: ${creature.threatLevel || 'Unknown'}\n\n`

        content += `## Description\n${creature.description || 'No description available.'}\n\n`

        // Alignment
        if (creature.alignment) {
          content += `## Alignment\n${this.formatAlignment(creature.alignment)}\n\n`
        }

        // Attributes
        if (creature.attributes) {
          content += '## Attributes\n'
          Object.entries(creature.attributes).forEach(([attr, value]) => {
            content += `- **${attr.charAt(0).toUpperCase() + attr.slice(1)}**: ${value}\n`
          })
          content += '\n'
        }

        // Skills
        if (creature.skills) {
          content += '## Skills\n'
          Object.entries(creature.skills).forEach(([skill, level]) => {
            content += `- **${skill.charAt(0).toUpperCase() + skill.slice(1)}**: ${level}\n`
          })
          content += '\n'
        }

        // Tags
        if (creature.tags && Array.isArray(creature.tags)) {
          content += '## Tags\n'
          creature.tags.forEach(tag => {
            content += `- ${tag.replace(/_/g, ' ')}\n`
          })
          content += '\n'
        }

        content += '---\n\n'
      })
    } else {
      content += '*No creature data available.*\n'
    }

    return content
  }

  generatePoliticsSection() {
    let content = '# Political Systems\n\n'

    content += `## Government Types

**Monarchy**: A system where a single ruler, often hereditary, holds significant power.

**Republic**: A government where senators are elected by the populace to make decisions and represent their interests.

**Council**: A governance structure where decisions are made by a council of elders or leaders from various clans.

**Oligarchy**: A system where a small group of powerful individuals or families control the government.

**Tribal**: A decentralized system where local chieftains or elders govern their own communities with loose alliances between tribes.

**Theocracy**: A system where religious leaders govern in accordance with divine guidance.

## Noble Titles and Ranks

**Emperor/Empress**: The supreme ruler of an empire, often overseeing multiple kingdoms or territories. Addressed as "Your Imperial Majesty".

**King/Queen**: The sovereign ruler of a kingdom. Their word is law. Addressed as "Your Majesty".

**Prince/Princess**: A royal title for the children of the monarch. Addressed as "Your Highness".

**Duke/Duchess**: A noble rank below the monarch, often governing a duchy. Addressed as "Your Grace".

**Count/Countess**: A noble rank below duke/duchess, often governing a county. Addressed as "Your Grace".

**Baron/Baroness**: The lowest rank of landed nobility, governing a barony. Addressed as "Your Excellency".

**Lord/Lady**: A general title for nobility with limited land holdings. Addressed as "My Lord"/"My Lady".

## Military and Administrative Ranks

**General**: A high-ranking military officer, often in charge of armies or military campaigns.

**Admiral**: A high-ranking naval officer, often in charge of a fleet or naval operations.

**Captain**: A mid-level military officer, often in charge of a company or ship.

**Commander**: A military officer ranking above a captain.

**Lieutenant**: A junior military officer, often serving under a captain or commander.

**Marshal/Sheriff**: A military officer assigned to oversee law enforcement and maintain order.

**Governor**: An appointed official responsible for overseeing a specific region or territory.

**Ambassador**: A diplomatic representative sent to another kingdom or nation.

**Advisor**: A trusted counselor to a ruler or governing body.

## Major Guilds

**The Adventurers Guild**: The quintessential organization for those who seek fortune and glory through exploration and adventure.

**The Merchants Guild**: A powerful organization that oversees trade and commerce throughout Aetheria.

**The Mages Guild**: An esteemed institution dedicated to the study and practice of magic. All mages must be registered.

**The Artisans Guild**: A collective of skilled craftsmen and artisans who create everything from everyday goods to exquisite works of art.

**The Seafarers Guild**: An organization that represents the interests of sailors, fishermen, and others who make their living on the water.

---

`
    return content
  }

  generateSkillsSection() {
    let content = '# Skills and Abilities\n\n'

    if (this.data.skills?.skills) {
      Object.entries(this.data.skills.skills).forEach(([key, skill]) => {
        content += `## ${skill.name} (${key})\n\n`
        content += `**Category**: ${skill.category || 'General'}\n`
        content += `**Description**: ${skill.description || 'No description available.'}\n\n`

        if (skill.uses) {
          content += '**Common Uses**:\n'
          skill.uses.forEach(use => {
            content += `- ${use}\n`
          })
          content += '\n'
        }

        content += '---\n\n'
      })
    }

    return content
  }

  generateEquipmentSection() {
    let content = '# Equipment and Items\n\n'

    if (this.data.equipment?.categories) {
      Object.entries(this.data.equipment.categories).forEach(([categoryKey, category]) => {
        content += `## ${category.name}\n\n`
        content += `${category.description || ''}\n\n`

        if (category.items) {
          Object.entries(category.items).forEach(([itemKey, item]) => {
            content += `### ${item.name}\n`
            content += `**Type**: ${item.type || 'Item'}\n`
            if (item.rarity) content += `**Rarity**: ${item.rarity}\n`
            if (item.cost) content += `**Cost**: ${item.cost}\n`
            content += `**Description**: ${item.description || 'No description available.'}\n\n`
          })
        }

        content += '---\n\n'
      })
    }

    return content
  }

  generateOrganizationsSection() {
    let content = '# Organizations\n\n'

    if (this.data.organizations?.organizations) {
      Object.entries(this.data.organizations.organizations).forEach(([key, org]) => {
        content += `## ${org.name} (${key})\n\n`
        content += `**Type**: ${org.type || 'Organization'}\n`
        if (org.leader) content += `**Leader**: ${org.leader}\n`
        if (org.headquarters) content += `**Headquarters**: ${org.headquarters}\n`
        content += `**Description**: ${org.description || 'No description available.'}\n\n`

        if (org.goals) {
          content += '**Goals**:\n'
          org.goals.forEach(goal => {
            content += `- ${goal}\n`
          })
          content += '\n'
        }

        content += '---\n\n'
      })
    }

    return content
  }

  generateAllRegions() {
    console.log('🏰 Generating all-regions document...')

    let content = `# Aetheria - All Regions and Locations

> **Complete Geographic Reference**: This document contains detailed information about every region, kingdom, city, and notable location in Aetheria.

## Quick Reference

`

    if (this.data.regions?.regions) {
      // Generate table of contents
      Object.entries(this.data.regions.regions).forEach(([key, region]) => {
        content += `- [${region.name}](#${this.slugify(region.name)})\n`
        if (region.regions) {
          Object.entries(region.regions).forEach(([subKey, subRegion]) => {
            content += `  - [${subRegion.name}](#${this.slugify(subRegion.name)})\n`
          })
        }
      })

      content += '\n---\n\n'

      // Generate detailed sections
      Object.entries(this.data.regions.regions).forEach(([key, region]) => {
        content += `# ${region.name}\n\n`
        content += `**Region ID**: ${key}\n`
        content += `**Type**: ${region.type || 'Region'}\n`
        content += `**Leader**: ${region.leader || 'Unknown'}\n`
        content += `**Population**: ${region.population || 'Unknown'}\n`
        content += `**Political System**: ${region.system || 'Unknown'}\n`
        if (region.climate) content += `**Climate**: ${region.climate}\n`
        content += '\n'

        content += `## Description\n${region.description || 'No description available.'}\n\n`

        // Add racial demographics
        if (region.races) {
          content += '## Racial Demographics\n'
          const sortedRaces = Object.entries(region.races).sort((a, b) => b[1] - a[1])
          sortedRaces.forEach(([race, percentage]) => {
            content += `- **${race}**: ${percentage}%\n`
          })
          content += '\n'
        }

        // Add sub-regions with full detail
        if (region.regions) {
          content += '## Notable Locations\n\n'
          Object.entries(region.regions).forEach(([subKey, subRegion]) => {
            content += `### ${subRegion.name}\n\n`
            content += `**Location ID**: ${subKey}\n`
            content += `**Type**: ${subRegion.type || 'Location'}\n`
            content += `**Leader**: ${subRegion.leader || 'Unknown'}\n`
            content += `**Population**: ${subRegion.population || 'Unknown'}\n`
            if (subRegion.climate) content += `**Climate**: ${subRegion.climate}\n`
            content += '\n'
            content += `${subRegion.description || 'No description available.'}\n\n`

            // Add relationships
            content += `**Parent Region**: [${region.name}](#${this.slugify(region.name)})\n\n`
          })
        }

        content += '---\n\n'
      })
    }

    return content
  }

  generateCrossReferences() {
    console.log('🔗 Generating cross-references...')

    let content = `# Aetheria - Cross-References and Relationships

> **Relationship Mapping**: This document maps the relationships between characters, locations, organizations, and other entities in Aetheria. Essential for understanding context and connections.

## Character-Location Relationships

`

    // Map characters to their locations
    if (this.data.characters?.characters && this.data.regions?.regions) {
      Object.entries(this.data.characters.characters).forEach(([charKey, character]) => {
        if (character.location) {
          content += `- **${character.name}** is associated with **${character.location}**\n`
        }
      })
    }

    content += '\n## Regional Hierarchies\n\n'

    // Map region hierarchies
    if (this.data.regions?.regions) {
      Object.entries(this.data.regions.regions).forEach(([key, region]) => {
        if (region.regions) {
          content += `**${region.name}** contains:\n`
          Object.entries(region.regions).forEach(([subKey, subRegion]) => {
            content += `- ${subRegion.name}\n`
          })
          content += '\n'
        }
      })
    }

    content += '## Political Hierarchies\n\n'

    // Map political relationships
    if (this.data.regions?.regions) {
      Object.entries(this.data.regions.regions).forEach(([key, region]) => {
        if (region.leader) {
          content += `- **${region.leader}** leads **${region.name}** (${region.system || 'Unknown system'})\n`
        }

        if (region.regions) {
          Object.entries(region.regions).forEach(([subKey, subRegion]) => {
            if (subRegion.leader) {
              content += `  - **${subRegion.leader}** leads **${subRegion.name}** under **${region.leader || 'Unknown'}**\n`
            }
          })
        }
      })
    }

    return content
  }

  async generateIndividualFiles() {
    console.log('📄 Generating individual files...')

    // Generate region files
    if (this.data.regions?.regions) {
      for (const [key, region] of Object.entries(this.data.regions.regions)) {
        const content = this.generateRegionFile(key, region)
        await writeFile(join(this.outputPath, 'regions', `${key}.md`), content, 'utf-8')

        // Generate sub-region files
        if (region.regions) {
          for (const [subKey, subRegion] of Object.entries(region.regions)) {
            const subContent = this.generateSubRegionFile(key, region, subKey, subRegion)
            await writeFile(join(this.outputPath, 'regions', `${key}-${subKey}.md`), subContent, 'utf-8')
          }
        }
      }
    }

    // Generate character files
    if (this.data.characters?.characters) {
      for (const [key, character] of Object.entries(this.data.characters.characters)) {
        const content = this.generateCharacterFile(key, character)
        await writeFile(join(this.outputPath, 'characters', `${key}.md`), content, 'utf-8')
      }
    }

    // Generate magic files
    if (this.data.magic?.magic?.schools) {
      for (const [key, school] of Object.entries(this.data.magic.magic.schools)) {
        const content = this.generateMagicFile(key, school)
        await writeFile(join(this.outputPath, 'magic', `${key}.md`), content, 'utf-8')
      }
    }

    // Generate class files
    if (this.data.classes?.classes) {
      const allClasses = {}

      // Collect all classes from different categories
      if (this.data.classes.classes.core) {
        Object.entries(this.data.classes.classes.core).forEach(([key, classData]) => {
          allClasses[key] = { ...classData, category: 'Core' }
        })
      }
      if (this.data.classes.classes.specialized) {
        Object.entries(this.data.classes.classes.specialized).forEach(([key, classData]) => {
          allClasses[key] = { ...classData, category: 'Specialized' }
        })
      }

      for (const [key, classData] of Object.entries(allClasses)) {
        const content = this.generateClassFile(key, classData)
        await writeFile(join(this.outputPath, 'classes', `${key}.md`), content, 'utf-8')
      }
    }

    // Generate creature files
    if (this.data.creatures?.creatures) {
      for (const [key, creature] of Object.entries(this.data.creatures.creatures)) {
        const content = this.generateCreatureFile(key, creature)
        await writeFile(join(this.outputPath, 'creatures', `${key}.md`), content, 'utf-8')
      }
    }
  }

  generateRegionFile(key, region) {
    let content = `# ${region.name}

> **Context**: This is a detailed reference for ${region.name}, a major region in the Aetheria world.

## Basic Information

- **Region ID**: ${key}
- **Type**: ${region.type || 'Region'}
- **Leader**: ${region.leader || 'Unknown'}
- **Population**: ${region.population || 'Unknown'}
- **Political System**: ${region.system || 'Unknown'}
- **Climate**: ${region.climate || 'Varied'}

## Description

${region.description || 'No description available.'}

`

    // Add racial demographics with context
    if (region.races) {
      content += '## Demographics\n\n'
      content += 'The population of ' + region.name + ' consists of:\n\n'
      const sortedRaces = Object.entries(region.races).sort((a, b) => b[1] - a[1])
      sortedRaces.forEach(([race, percentage]) => {
        content += `- **${race}**: ${percentage}% of the population\n`
      })
      content += '\n'
    }

    // Add sub-regions with full context
    if (region.regions) {
      content += '## Notable Locations\n\n'
      content += `${region.name} contains the following notable locations:\n\n`

      Object.entries(region.regions).forEach(([subKey, subRegion]) => {
        content += `### ${subRegion.name}\n\n`
        content += `${subRegion.description || 'No description available.'}\n\n`
        content += `- **Type**: ${subRegion.type || 'Location'}\n`
        content += `- **Leader**: ${subRegion.leader || 'Unknown'}\n`
        content += `- **Population**: ${subRegion.population || 'Unknown'}\n`
        content += `- **Detailed Reference**: [${subRegion.name}](${key}-${subKey}.md)\n\n`
      })
    }

    // Add cross-references
    content += '## Related Information\n\n'
    content += `- **Complete Regional Overview**: [All Regions](../all-regions.md#${this.slugify(region.name)})\n`
    content += `- **Political Context**: [Politics Complete](../politics-complete.md)\n`
    content += `- **World Overview**: [Complete World Reference](../complete-world-overview.md)\n`

    return content
  }

  generateSubRegionFile(parentKey, parentRegion, key, subRegion) {
    let content = `# ${subRegion.name}

> **Context**: ${subRegion.name} is a notable location within ${parentRegion.name} in the Aetheria world.

## Basic Information

- **Location ID**: ${key}
- **Parent Region**: [${parentRegion.name}](${parentKey}.md)
- **Type**: ${subRegion.type || 'Location'}
- **Leader**: ${subRegion.leader || 'Unknown'}
- **Population**: ${subRegion.population || 'Unknown'}
- **Climate**: ${subRegion.climate || 'Inherits from parent region'}

## Description

${subRegion.description || 'No description available.'}

## Geographic Context

${subRegion.name} is located within ${parentRegion.name}, which is ${parentRegion.description || 'a major region in Aetheria'}.

The broader regional leadership under ${parentRegion.leader || 'Unknown'} governs through a ${parentRegion.system || 'Unknown'} system.

## Related Information

- **Parent Region**: [${parentRegion.name}](${parentKey}.md)
- **Complete Regional Overview**: [All Regions](../all-regions.md#${this.slugify(subRegion.name)})
- **World Overview**: [Complete World Reference](../complete-world-overview.md)

`

    return content
  }

  generateCharacterFile(key, character) {
    let content = `# ${character.name}

> **Context**: Detailed character reference for ${character.name}, a notable figure in the Aetheria world.

## Basic Information

- **Character ID**: ${key}
- **Name**: ${character.name}
- **Race**: ${character.race || 'Unknown'}
- **Class**: ${character.class || 'Unknown'}
- **Alignment**: ${this.formatAlignment(character.alignment)}
- **Location**: ${character.location || 'Unknown'}

## Description

${character.description || 'No description available.'}

`

    if (character.background) {
      content += `## Background\n\n${character.background}\n\n`
    }

    // Add location context if available
    if (character.location && this.data.regions?.regions) {
      content += '## Geographic Context\n\n'
      const location = this.findLocationByName(character.location)
      if (location) {
        content += `${character.name} is associated with ${character.location}, which is ${location.description || 'a location in Aetheria'}.\n\n`
      }
    }

    content += '## Related Information\n\n'
    content += `- **Complete Character List**: [All Characters](../all-characters.md)\n`
    if (character.location) {
      content += `- **Character Location**: Search for "${character.location}" in [All Regions](../all-regions.md)\n`
    }
    content += `- **World Overview**: [Complete World Reference](../complete-world-overview.md)\n`

    return content
  }

  generateMagicFile(key, school) {
    let content = `# ${school.name} Magic

> **Context**: Complete reference for ${school.name} magic school in the Aetheria magical system.

## Basic Information

- **School ID**: ${key}
- **Name**: ${school.name}
- **Type**: Magic School

## Description

${school.description || 'No description available.'}

`

    if (school.spells) {
      content += '## Known Spells\n\n'
      Object.entries(school.spells).forEach(([spellKey, spell]) => {
        content += `### ${spell.name}\n\n`
        content += `**Spell ID**: ${spellKey}\n\n`
        content += `${spell.description || 'No description available.'}\n\n`
      })
    }

    content += '## Related Information\n\n'
    content += `- **Complete Magic System**: [All Magic](../all-magic.md)\n`
    content += `- **Magic Practitioners**: Search for "${school.name}" practitioners in [All Characters](../all-characters.md)\n`
    content += `- **World Overview**: [Complete World Reference](../complete-world-overview.md)\n`

    return content
  }

  generateClassFile(key, classData) {
    let content = `# ${classData.name}

> **Context**: Complete reference for the ${classData.name} character class in the Aetheria world.

## Basic Information

- **Class ID**: ${key}
- **Name**: ${classData.name}
- **Category**: ${classData.category}
- **Type**: Character Class

## Description

${classData.description || 'No description available.'}

`

    // Population percentage
    if (classData.populationPercentage !== undefined) {
      content += `## Population Distribution\n\n**${classData.populationPercentage}%** of the population belongs to this class.\n\n`
    }

    // Alternative names
    if (classData.alternativeNames && Array.isArray(classData.alternativeNames)) {
      content += '## Alternative Names\n\n'
      classData.alternativeNames.forEach(name => {
        content += `- ${name}\n`
      })
      content += '\n'
    }

    // Key abilities
    if (classData.keyAbilities && Array.isArray(classData.keyAbilities)) {
      content += '## Key Abilities\n\n'
      classData.keyAbilities.forEach(ability => {
        content += `### ${ability.name}\n\n${ability.description}\n\n`
      })
    }

    // Advancement paths
    if (classData.advancement && Array.isArray(classData.advancement)) {
      content += '## Advancement Paths\n\n'
      classData.advancement.forEach(path => {
        content += `### ${path.name}\n\n${path.description}\n\n`
      })
    }

    content += '## Related Information\n\n'
    content += `- **All Classes**: [Complete Classes Reference](../all-classes.md)\n`
    content += `- **${classData.name} Characters**: Search for "${classData.name}" in [All Characters](../all-characters.md)\n`
    content += `- **World Overview**: [Complete World Reference](../complete-world-overview.md)\n`

    return content
  }

  generateCreatureFile(key, creature) {
    let content = `# ${creature.name}

> **Context**: Complete reference for ${creature.name} in the Aetheria world bestiary.

## Basic Information

- **Creature ID**: ${key}
- **Name**: ${creature.name}
- **Threat Level**: ${creature.threatLevel || 'Unknown'}
- **Type**: Creature

## Description

${creature.description || 'No description available.'}

`

    // Alignment
    if (creature.alignment) {
      content += `## Alignment\n\n${this.formatAlignment(creature.alignment)}\n\n`
    }

    // Attributes
    if (creature.attributes) {
      content += '## Attributes\n\n'
      Object.entries(creature.attributes).forEach(([attr, value]) => {
        content += `- **${attr.charAt(0).toUpperCase() + attr.slice(1)}**: ${value}\n`
      })
      content += '\n'
    }

    // Skills
    if (creature.skills) {
      content += '## Skills\n\n'
      Object.entries(creature.skills).forEach(([skill, level]) => {
        content += `- **${skill.charAt(0).toUpperCase() + skill.slice(1)}**: ${level}\n`
      })
      content += '\n'
    }

    // Tags
    if (creature.tags && Array.isArray(creature.tags)) {
      content += '## Tags\n\n'
      creature.tags.forEach(tag => {
        content += `- ${tag.replace(/_/g, ' ')}\n`
      })
      content += '\n'
    }

    content += '## Related Information\n\n'
    content += `- **All Creatures**: [Complete Creatures Reference](../all-creatures.md)\n`
    content += `- **Threat Level ${creature.threatLevel || 'Unknown'} Creatures**: Search in [All Creatures](../all-creatures.md)\n`
    content += `- **World Overview**: [Complete World Reference](../complete-world-overview.md)\n`

    return content
  }

  findLocationByName(locationName) {
    if (!this.data.regions?.regions) return null

    for (const [key, region] of Object.entries(this.data.regions.regions)) {
      if (region.name === locationName) return region

      if (region.regions) {
        for (const [subKey, subRegion] of Object.entries(region.regions)) {
          if (subRegion.name === locationName) return subRegion
        }
      }
    }

    return null
  }

  slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  }

  formatAlignment(alignment) {
    if (!alignment || typeof alignment !== 'object') {
      return alignment || 'Unknown'
    }

    let result = []

    if (alignment.ideology) {
      const ideology = `${alignment.ideology.value}${alignment.ideology.modifier ? ` (${alignment.ideology.modifier})` : ''}`
      result.push(`**Ideology**: ${ideology}`)
    }

    if (alignment.morality) {
      const morality = `${alignment.morality.value}${alignment.morality.modifier ? ` (${alignment.morality.modifier})` : ''}`
      result.push(`**Morality**: ${morality}`)
    }

    if (alignment.methodology) {
      const methodology = `${alignment.methodology.value}${alignment.methodology.modifier ? ` (${alignment.methodology.modifier})` : ''}`
      result.push(`**Methodology**: ${methodology}`)
    }

    if (alignment.temperament) {
      result.push(`**Temperament**: ${alignment.temperament.value}`)
    }

    return result.join(', ')
  }

  generateAlignmentReference() {
    console.log('⚖️  Generating alignment reference...')

    let content = `# Aetheria - Alignment System Reference

> **Alignment Guide**: This document explains Aetheria's multi-dimensional alignment system used for character descriptions.

## Overview

Aetheria uses a sophisticated four-axis alignment system that goes beyond traditional good/evil distinctions. Each character's alignment consists of four dimensions:

1. **Ideology** - Their approach to order and systems
2. **Morality** - Their ethical motivations and intentions
3. **Methodology** - Their tactical approach to problems
4. **Temperament** - Their personality style and demeanor

## Ideology Axis

This axis determines how a character relates to structure, rules, and systems:

- **Order**: Believes in structure, systems, and maintaining stability
  - *Stewardship*: Curates and maintains existing systems
  - *Enforcement*: Actively enforces rules and order
  - *Hierarchy*: Values clear chains of command and authority

- **Chaos**: Values freedom, spontaneity, and change
  - *Liberation*: Seeks to free others from oppressive systems
  - *Revolution*: Actively works to overthrow existing order
  - *Anarchism*: Opposes all forms of organized authority

- **Neutral**: Adapts to circumstances, neither strongly for nor against order

## Morality Axis

This axis determines a character's ethical motivations:

- **Good**: Motivated by benevolence and the welfare of others
  - *Altruism*: Self-sacrificing concern for others
  - *Laissez-faire*: Allows others freedom while remaining benevolent
  - *Paternalism*: Protective but sometimes controlling for others' benefit

- **Evil**: Motivated by self-interest, often at others' expense
  - *Malevolence*: Takes pleasure in others' suffering
  - *Exploitation*: Uses others as means to personal ends
  - *Nihilism*: Believes nothing matters, acts destructively

- **Neutral**: Balanced self-interest, neither altruistic nor malicious

## Methodology Axis

This axis describes how a character approaches problems:

- **Direct**: Confronts problems head-on with force or immediate action
  - *Aggressive*: Uses overwhelming force as first resort
  - *Opportunistic*: Strikes at the perfect moment with decisive action
  - *Persistent*: Continues direct approach despite setbacks

- **Indirect**: Uses subtlety, manipulation, or gradual approaches
  - *Manipulative*: Influences others to achieve goals
  - *Subversive*: Works within systems to change them from inside
  - *Patient*: Waits for the right moment, plans carefully

- **Adaptive**: Switches between direct and indirect as needed

## Temperament Axis

This axis describes a character's personality style:

- **Fire**: Passionate, energetic, emotionally driven
- **Water**: Flowing, adaptive, emotionally intuitive
- **Earth**: Steady, practical, grounded in reality
- **Air**: Intellectual, detached, logic-focused
- **Aether**: Transcendent, mystical, beyond normal emotional ranges

## Example Character Alignments

### Valora Iceclaw
- **Ideology**: Order (Stewardship) - Maintains cosmic balance
- **Morality**: Good (Laissez-faire) - Benevolent but allows freedom
- **Methodology**: Direct (Opportunistic) - Overwhelming force when necessary
- **Temperament**: Aether - Detached, analytical, transcendent

This creates a character who maintains systems for the greater good, allows others to solve their own problems when possible, but intervenes decisively when required, all while maintaining an otherworldly perspective.

## Using Alignment in Context

When interpreting a character's alignment:

1. **Ideology** tells you their relationship to authority and systems
2. **Morality** reveals their underlying motivations and intentions
3. **Methodology** shows how they approach challenges and conflicts
4. **Temperament** indicates their communication style and emotional approach

The modifier in parentheses provides specific context for how that axis manifests in the character's behavior.

---

*This alignment system allows for nuanced character development that goes beyond simple moral categories, enabling complex personalities that feel realistic and multi-dimensional.*
`

    return content
  }  async generateAllFiles() {
    await this.ensureOutputDir()

    // Generate consolidated files
    const sitemap = this.generateMasterSitemap()
    await writeFile(join(this.outputPath, 'index.md'), sitemap, 'utf-8')

    const worldOverview = this.generateCompleteWorldOverview()
    await writeFile(join(this.outputPath, 'complete-world-overview.md'), worldOverview, 'utf-8')

    const allRegions = this.generateAllRegions()
    await writeFile(join(this.outputPath, 'all-regions.md'), allRegions, 'utf-8')

    const allMagic = this.generateAllMagic()
    await writeFile(join(this.outputPath, 'all-magic.md'), allMagic, 'utf-8')

    const allCharacters = this.generateAllCharacters()
    await writeFile(join(this.outputPath, 'all-characters.md'), allCharacters, 'utf-8')

    const allClasses = this.generateAllClasses()
    await writeFile(join(this.outputPath, 'all-classes.md'), allClasses, 'utf-8')

    const allCreatures = this.generateAllCreatures()
    await writeFile(join(this.outputPath, 'all-creatures.md'), allCreatures, 'utf-8')

    const politicsComplete = this.generatePoliticsSection()
    await writeFile(join(this.outputPath, 'politics-complete.md'), politicsComplete, 'utf-8')

    const alignmentReference = this.generateAlignmentReference()
    await writeFile(join(this.outputPath, 'alignment-system.md'), alignmentReference, 'utf-8')

    const crossRefs = this.generateCrossReferences()
    await writeFile(join(this.outputPath, 'cross-references.md'), crossRefs, 'utf-8')    // Generate individual files
    await this.generateIndividualFiles()

    console.log('✅ Generated all AI-optimized documentation files!')
  }  async run() {
    console.log('🚀 Starting AI-optimized documentation generation...')

    await this.loadAllData()
    await this.generateAllFiles()

    console.log(`📁 Files generated in: ${this.outputPath}`)
    console.log('🎯 Key files for AI models:')
    console.log('   - index.md (master sitemap)')
    console.log('   - complete-world-overview.md (everything in one file)')
    console.log('   - all-regions.md (geographic reference)')
    console.log('   - cross-references.md (relationship mapping)')
  }
}

// Run the generator
const generator = new AetheriaAIDocsGenerator()
generator.run().catch(console.error)
