# Aetheria MCP Server (TypeScript Edition)

A comprehensive Model Context Protocol (MCP) server for the Aetheria fantasy world building project. Built with TypeScript for enhanced type safety and developer experience, this server provides AI systems with rich, structured access to world lore, hierarchical data, and dynamic content generation.

## Features

- **📝 Static Resource Access**: Serve all markdown documentation files from `docs/`
- **🌳 Hierarchical Data**: Navigate complex relationships (e.g., Demon → Succubus → Lilith)
- **🔍 Advanced Search**: Query lore across categories with context
- **⚡ Dynamic Content Generation**: Generate stat blocks, descriptions, and guides
- **📊 Data Extraction**: Convert markdown tables to structured formats
- **🎯 AI-Optimized**: Designed specifically for AI text generation context
- **🔒 Type Safety**: Full TypeScript implementation with comprehensive types

## Installation

```bash
cd mcp-server
npm install
```

## Usage

### Development Mode (with hot reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Build Only
```bash
npm run build
```

## Available Tools

### 1. `search_lore`
Search through Aetheria documentation with advanced filtering.

**Parameters:**
- `query` (required): Search term
- `category` (optional): Filter by category (magic, politics, religion, classes, equipment, alignment, anime, all)
- `includeContext` (optional): Include surrounding context for matches (default: true)
- `maxResults` (optional): Maximum number of results (default: 10)

**Example:**
```json
{
  "tool": "search_lore",
  "arguments": {
    "query": "succubus",
    "category": "magic",
    "includeContext": true,
    "maxResults": 5
  }
}
```

### 2. `get_hierarchy`
Retrieve hierarchical data with relationship navigation.

**Parameters:**
- `type` (required): Hierarchy type (creatures, organizations, magic_schools, locations, classes, equipment)
- `entity` (optional): Specific entity to find
- `includeChildren` (optional): Include child entities (default: true)
- `includeParents` (optional): Include parent entities (default: true)

**Example:**
```json
{
  "tool": "get_hierarchy",
  "arguments": {
    "type": "creatures",
    "entity": "lilith",
    "includeChildren": true,
    "includeParents": true
  }
}
```

### 3. `generate_content`
Generate dynamic content using templates and hierarchical data.

**Parameters:**
- `type` (required): Content type (creature_stat_block, magic_school_description, character_class_guide, equipment_catalog, political_overview, location_description, character_profile)
- `name` (required): Entity name
- `parameters` (optional): Additional generation parameters

**Example:**
```json
{
  "tool": "generate_content",
  "arguments": {
    "type": "creature_stat_block",
    "name": "lilith",
    "parameters": {
      "includeHierarchy": true,
      "format": "markdown"
    }
  }
}
```

### 4. `extract_data`
Extract structured data from markdown tables and content.

**Parameters:**
- `source` (required): Source document (magic, politics, classes, equipment, religion, alignment, anime)
- `dataType` (optional): Data type to extract (tables, lists, definitions, all)
- `format` (optional): Output format (json, yaml, markdown)

**Example:**
```json
{
  "tool": "extract_data",
  "arguments": {
    "source": "equipment",
    "dataType": "tables",
    "format": "yaml"
  }
}
```

## Data Structure

### Creatures Hierarchy
Complex taxonomy supporting inheritance:
```
creatures/
├── fiends/
│   ├── demons/
│   │   ├── succubus/
│   │   │   └── lilith (unique entity)
│   │   └── balor/
│   └── devils/
│       └── pit_fiend/
├── celestials/
│   └── angels/
│       └── solar/
└── undead/
    ├── corporeal_undead/
    │   ├── vampire/
    │   └── lich/
    └── incorporeal_undead/
        └── ghost/
```

### Magic Schools Hierarchy
Organized by magical traditions:
```
magic_schools/
├── elemental/
│   ├── earth/ (opposing: air)
│   ├── air/ (opposing: earth)
│   ├── fire/ (opposing: water)
│   ├── water/ (opposing: fire)
│   └── aether/
├── divine/
│   ├── light/ (opposing: dark)
│   └── dark/ (opposing: light)
├── primal/
│   └── spirit/
└── arcane/
    ├── mind/ (heavily regulated)
    └── time/ (strongly regulated)
```

### Classes Hierarchy
From primary archetypes to specializations:
```
classes/
├── warrior/ → monk, crusader, lancer
├── mage/ → warlock, necromancer, enchanter
├── rogue/ → shadowblade, ranger, bard
└── priest/ → druid
```

### Political Organizations
Real government data from Politics.md:
```
organizations/
├── kingdoms/ → eldoria, iceclaw, drakoria, sylvandell, demon_lands, bone_sands
├── republics/ → valtoria
├── theocracies/ → lumina
├── councils/ → karak_dur
├── oligarchies/ → free_cities
└── anarchies/ → twilight_archipelago
```

## Integration with Existing Data

The server automatically integrates all existing markdown files:

- **Magic.md**: 10 magic schools with complete spell lists and regulations
- **Classes.md**: Primary and specialized character classes with equipment
- **Equipment.md**: Comprehensive weapon, armor, and tool catalogs
- **Politics.md**: Detailed political entities with rulers and features
- **Religion.md**: Religious organizations and beliefs
- **Alignment.md**: Character alignment systems
- **Anime.md**: Relationship archetypes

## Templates

Dynamic content generation uses Mustache templates in `templates/`:

- `creature_stat_block.md`: Monster descriptions with abilities and weaknesses
- `character_class_guide.md`: Class guides with specializations and equipment
- `equipment_catalog.md`: Weapon/armor specifications with properties
- `political_overview.md`: Government information with rulers and features
- `magic_school.md`: Magic school descriptions with regulations and spells

## TypeScript Benefits

- **Type Safety**: Comprehensive interfaces for all data structures
- **Better IDE Support**: IntelliSense, auto-completion, and error detection
- **Refactoring Safety**: Confident code modifications with compile-time checks
- **Documentation**: Self-documenting code with type annotations
- **Error Prevention**: Catch errors at compile time rather than runtime

## File Structure

```
mcp-server/
├── src/
│   ├── index.ts          # Main TypeScript server
│   └── test.ts           # Capability demonstration
├── dist/                 # Compiled JavaScript (auto-generated)
├── data/                 # Hierarchical YAML data
│   ├── creatures.yaml    # Creature taxonomies
│   ├── magic_schools.yaml# Magic school hierarchies
│   ├── organizations.yaml# Political structures
│   ├── classes.yaml      # Class hierarchies
│   └── equipment.yaml    # Equipment categories
├── templates/            # Mustache templates
│   ├── creature_stat_block.md
│   ├── character_class_guide.md
│   ├── equipment_catalog.md
│   ├── political_overview.md
│   └── magic_school.md
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## Development

### Adding New Hierarchical Data

Create or modify YAML files in `data/` following the pattern:

```yaml
entities:
  parent_category:
    type: "Parent Type"
    description: "Description"
    children:
      child_category:
        name: "Child Name"
        type: "Child Type"
        parent: "Parent Type"
        # ... additional properties
```

### Adding New Templates

Create Mustache templates in `templates/` for new content types. Templates support:
- Variable substitution: `{{variable}}`
- Conditional sections: `{{#condition}}...{{/condition}}`
- Lists: `{{#list}}{{.}}{{/list}}`
- Object iteration: `{{#object}}{{key}}: {{value}}{{/object}}`

### Adding New Tools

Extend the `ListToolsRequestSchema` handler and add corresponding methods to the `AetheriaMCPServer` class.

## AI Integration

This MCP server is specifically designed for AI text generation systems:

- **Rich Context**: Hierarchical relationships provide inheritance and context
- **Structured Data**: Clean, typed interfaces for reliable data access
- **Dynamic Generation**: Template-based content creation
- **Flexible Search**: Multi-faceted search with context preservation
- **Lore Consistency**: Centralized data ensures consistent world building

Perfect for:
- Story generation with consistent world details
- Character creation with proper class hierarchies
- Combat scenarios with accurate equipment data
- Political intrigue with real government structures
- Magic systems with proper regulations and relationships

## Version History

- **1.0.0**: TypeScript implementation with full markdown integration
- Enhanced hierarchical data structures
- Advanced search and generation capabilities
- Comprehensive template system
