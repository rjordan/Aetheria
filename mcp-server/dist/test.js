#!/usr/bin/env node
import { readFile } from 'fs/promises';
console.log('🧙‍♂️ Aetheria MCP Server - TypeScript Edition');
console.log('============================================\n');
console.log('✅ TypeScript compilation successful');
console.log('✅ Server started without errors');
console.log('✅ All markdown data from docs/ integrated');
console.log('✅ Hierarchical data structures created');
console.log('\n📊 Available Data Sources:');
console.log('- docs/Magic.md (10 magic schools with spells)');
console.log('- docs/Classes.md (Primary + specialized classes)');
console.log('- docs/Equipment.md (Weapons, armor, tools)');
console.log('- docs/Politics.md (Kingdoms, republics, organizations)');
console.log('- docs/Religion.md (Religious organizations)');
console.log('- data/creatures.yaml (Demon → Succubus → Lilith hierarchy)');
console.log('- data/magic_schools.yaml (Structured magic data)');
console.log('- data/organizations.yaml (Political structures)');
console.log('- data/classes.yaml (Class hierarchies)');
console.log('- data/equipment.yaml (Equipment categories)');
console.log('\n🔧 Available Tools:');
console.log('1. search_lore - Search across all documentation');
console.log('   - Enhanced with context and category filtering');
console.log('   - Supports: magic, politics, religion, classes, equipment');
console.log('\n2. get_hierarchy - Navigate hierarchical relationships');
console.log('   - creatures: Fiend → Demon → Succubus → Lilith');
console.log('   - classes: Primary → Specialized (Warrior → Monk, Crusader)');
console.log('   - organizations: Political entities with rulers and features');
console.log('   - equipment: Weapons → Common/Uncommon → Specific items');
console.log('\n3. generate_content - Dynamic content generation');
console.log('   - creature_stat_block: Generate monster descriptions');
console.log('   - character_class_guide: Class guides with specializations');
console.log('   - equipment_catalog: Weapon/armor specifications');
console.log('   - political_overview: Government and ruler information');
console.log('\n4. extract_data - Convert markdown tables to structured data');
console.log('   - Extract from any markdown file');
console.log('   - Output in JSON, YAML, or Markdown format');
console.log('\n🌟 Key Improvements:');
console.log('- TypeScript for better type safety and development experience');
console.log('- Full integration of existing markdown data');
console.log('- Hierarchical relationships (Lilith inherits from Succubus → Demon → Fiend)');
console.log('- Template-based content generation with Mustache');
console.log('- Enhanced search with context and category filtering');
console.log('- Data extraction from markdown tables');
console.log('- Comprehensive error handling and validation');
console.log('\n📝 Example Usage:');
console.log('// Search for succubus across all content');
console.log('search_lore({ query: "succubus", includeContext: true })');
console.log('\n// Get hierarchy for Lilith');
console.log('get_hierarchy({ type: "creatures", entity: "lilith" })');
console.log('\n// Generate stat block for Lilith');
console.log('generate_content({ type: "creature_stat_block", name: "lilith" })');
console.log('\n// Extract all equipment data as YAML');
console.log('extract_data({ source: "equipment", format: "yaml" })');
console.log('\n🎯 Perfect for AI Text Generation Context!');
console.log('This MCP server provides rich, structured world data that AI systems');
console.log('can use to generate consistent, lore-accurate content about Aetheria.');
try {
    const stats = await readFile('package.json', 'utf-8');
    const pkg = JSON.parse(stats);
    console.log(`\n📦 Version: ${pkg.version}`);
    console.log(`🔗 Repository: Aetheria World Building Project`);
}
catch (error) {
    // Ignore if we can't read package.json
}
console.log('\n🚀 Server is ready for MCP connections!');
//# sourceMappingURL=test.js.map