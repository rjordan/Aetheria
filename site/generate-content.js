#!/usr/bin/env node

// Content Generator for Aetheria MCP
// Generates static markdown content from JSON data and page structures

import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

interface ContentPage {
  name: string
  title: string
  description: string
  generator: () => Promise<string>
}

class AetheriaContentGenerator {
  private outputDir = 'generated-content'

  async ensureOutputDir() {
    if (!existsSync(this.outputDir)) {
      await mkdir(this.outputDir, { recursive: true })
    }
  }

  async loadJsonData(filename: string) {
    try {
      const path = join('public', 'data', filename)
      const content = await readFile(path, 'utf-8')
      return JSON.parse(content)
    } catch (error) {
      console.error(`Error loading ${filename}:`, error)
      return null
    }
  }

  async generateClassesContent(): Promise<string> {
    const classesData = await this.loadJsonData('classes.json')
    if (!classesData?.classes) return '# Classes\n\nNo class data available.'

    let content = `# Character Classes in Aetheria

The world of Aetheria features diverse character classes, each with unique abilities and roles in society.

## Overview

Character classes in Aetheria are divided into base classes and specialized variants. Each class represents a different approach to life, combat, and social interaction.

## Base Classes

`

    for (const [classId, classData] of Object.entries(classesData.classes.base)) {
      const cls = classData as any
      content += `### ${cls.name}

**Description:** ${cls.description}

**Population:** ${cls.populationPercentage}% of the population

`
      if (cls.alternativeNames?.length > 0) {
        content += `**Alternative Names:** ${cls.alternativeNames.join(', ')}

`
      }

      if (cls.subclasses && Object.keys(cls.subclasses).length > 0) {
        content += `**Specializations:**
`
        for (const [subId, subData] of Object.entries(cls.subclasses)) {
          const sub = subData as any
          content += `- **${sub.name}**: ${sub.description}
`
        }
        content += '\n'
      }

      if (cls.skills && Object.keys(cls.skills).length > 0) {
        content += `**Key Skills:**
`
        for (const [skillName, skillRank] of Object.entries(cls.skills)) {
          content += `- ${skillName}: ${skillRank}
`
        }
        content += '\n'
      }

      content += '---\n\n'
    }

    return content
  }

  async generateMagicContent(): Promise<string> {
    const magicData = await this.loadJsonData('magic.json')
    if (!magicData?.schools) return '# Magic\n\nNo magic data available.'

    let content = `# Magic System in Aetheria

Magic in Aetheria is organized into distinct schools, each with its own philosophy, methods, and applications.

## Magic Schools

`

    for (const [schoolId, schoolData] of Object.entries(magicData.schools)) {
      const school = schoolData as any
      content += `### ${school.name}

**Description:** ${school.description}

**Philosophy:** ${school.philosophy}

**Practitioners:** ${school.practitioners}

**Key Applications:**
`
      if (school.applications) {
        for (const app of school.applications) {
          content += `- ${app}
`
        }
      }

      if (school.notableSpells && school.notableSpells.length > 0) {
        content += `
**Notable Spells:**
`
        for (const spell of school.notableSpells) {
          content += `- **${spell.name}**: ${spell.description}
`
        }
      }

      content += '\n---\n\n'
    }

    return content
  }

  async generateCreaturesContent(): Promise<string> {
    const creaturesData = await this.loadJsonData('creatures.json')
    if (!creaturesData?.creatures) return '# Creatures\n\nNo creature data available.'

    let content = `# Creatures of Aetheria

The world of Aetheria is populated by diverse creatures, from common animals to legendary beasts.

## Known Creatures

`

    for (const [creatureId, creatureData] of Object.entries(creaturesData.creatures)) {
      const creature = creatureData as any
      content += `### ${creature.name}

**Description:** ${creature.description}

**Threat Level:** ${creature.threatLevel}

**Attributes:**
- Strength: ${creature.attributes.strength}
- Agility: ${creature.attributes.agility}
- Constitution: ${creature.attributes.constitution}
- Intelligence: ${creature.attributes.intelligence}
- Willpower: ${creature.attributes.willpower}
- Charisma: ${creature.attributes.charisma}

`

      if (creature.skills && Object.keys(creature.skills).length > 0) {
        content += `**Skills:**
`
        for (const [skillName, skillRank] of Object.entries(creature.skills)) {
          content += `- ${skillName}: ${skillRank}
`
        }
        content += '\n'
      }

      if (creature.tags && creature.tags.length > 0) {
        content += `**Tags:** ${creature.tags.join(', ')}

`
      }

      content += '---\n\n'
    }

    return content
  }

  async generateEquipmentContent(): Promise<string> {
    const equipmentData = await this.loadJsonData('equipment.json')
    if (!equipmentData?.equipment) return '# Equipment\n\nNo equipment data available.'

    let content = `# Equipment in Aetheria

The world of Aetheria features various types of equipment, from weapons and armor to magical artifacts.

## Equipment Categories

`

    for (const [categoryId, categoryData] of Object.entries(equipmentData.equipment)) {
      const category = categoryData as any
      content += `### ${categoryId.charAt(0).toUpperCase() + categoryId.slice(1)}

`
      for (const [itemId, itemData] of Object.entries(category)) {
        const item = itemData as any
        content += `#### ${item.name}

**Description:** ${item.description}

`
        if (item.damage) content += `**Damage:** ${item.damage}\n`
        if (item.armor) content += `**Armor:** ${item.armor}\n`
        if (item.range) content += `**Range:** ${item.range}\n`
        if (item.weight) content += `**Weight:** ${item.weight}\n`
        if (item.cost) content += `**Cost:** ${item.cost}\n`

        if (item.properties && item.properties.length > 0) {
          content += `**Properties:** ${item.properties.join(', ')}\n`
        }

        content += '\n'
      }

      content += '---\n\n'
    }

    return content
  }

  async generatePoliticsContent(): Promise<string> {
    const orgData = await this.loadJsonData('organizations.json')
    if (!orgData?.organizations) return '# Politics\n\nNo political data available.'

    let content = `# Political Systems in Aetheria

The political landscape of Aetheria is shaped by various organizations, from noble houses to merchant guilds.

## Organizations

`

    for (const [orgId, orgData] of Object.entries(orgData.organizations)) {
      const org = orgData as any
      content += `### ${org.name}

**Type:** ${org.type}

**Description:** ${org.description}

**Influence:** ${org.influence}

**Territory:** ${org.territory}

`
      if (org.leadership) {
        content += `**Leadership:** ${org.leadership}

`
      }

      if (org.goals && org.goals.length > 0) {
        content += `**Goals:**
`
        for (const goal of org.goals) {
          content += `- ${goal}
`
        }
        content += '\n'
      }

      content += '---\n\n'
    }

    return content
  }

  async generateAllContent() {
    console.log('🔄 Generating static content for Aetheria MCP...')

    await this.ensureOutputDir()

    const pages: ContentPage[] = [
      {
        name: 'classes',
        title: 'Character Classes',
        description: 'Information about character classes in Aetheria',
        generator: () => this.generateClassesContent()
      },
      {
        name: 'magic',
        title: 'Magic System',
        description: 'Details about magic schools and spells',
        generator: () => this.generateMagicContent()
      },
      {
        name: 'creatures',
        title: 'Creatures',
        description: 'Bestiary of creatures in Aetheria',
        generator: () => this.generateCreaturesContent()
      },
      {
        name: 'equipment',
        title: 'Equipment',
        description: 'Weapons, armor, and other equipment',
        generator: () => this.generateEquipmentContent()
      },
      {
        name: 'politics',
        title: 'Political Systems',
        description: 'Organizations and political structures',
        generator: () => this.generatePoliticsContent()
      }
    ]

    for (const page of pages) {
      try {
        console.log(`📝 Generating ${page.name} content...`)
        const content = await page.generator()
        const filename = join(this.outputDir, `${page.name}.md`)
        await writeFile(filename, content, 'utf-8')
        console.log(`✅ Generated ${filename}`)
      } catch (error) {
        console.error(`❌ Error generating ${page.name}:`, error)
      }
    }

    // Generate index file
    const indexContent = `# Aetheria World Reference

This directory contains comprehensive information about the world of Aetheria.

## Available Content

${pages.map(page => `- [${page.title}](${page.name}.md) - ${page.description}`).join('\n')}

Generated on: ${new Date().toISOString()}
`

    await writeFile(join(this.outputDir, 'index.md'), indexContent, 'utf-8')
    console.log('✅ Generated index.md')
    console.log('🎉 Content generation complete!')
  }
}

// Run the generator
const generator = new AetheriaContentGenerator()
generator.generateAllContent().catch(console.error)
