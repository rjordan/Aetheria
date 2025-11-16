# Content Directory

This directory contains **narrative and instructional content** for the Aetheria world, written in Markdown format.

## Purpose

The `/content` directory is part of a **hybrid content management approach**:

- **`/content/*.md`** - Prose, explanations, lore, and instructional text (single source of truth)
- **`/site/public/data/*.json`** - Structured data for lists, stats, and attributes (single source of truth)

## Why This Structure?

### Markdown (in `/content`) is best for:
- ✅ Prose and narrative content
- ✅ Explanatory text and lore
- ✅ How-to guides and instructions
- ✅ Easy to edit and maintain
- ✅ Version control friendly

### JSON (in `/site/public/data`) is best for:
- ✅ Structured, repeating data (creatures, regions, characters)
- ✅ Schema validation and consistency
- ✅ Programmatic iteration (loops, filters, sorting)
- ✅ Easier to catch missing fields

## Current Content Files

- **`religion-intro.md`** - Overview of gods and religion in Aetheria
- **`character-creation.md`** - Step-by-step guide to creating characters
- **`political-systems.md`** - Government types, titles, guilds, and ranks

## How It Works

1. **Edit content here** - Update markdown files in `/content`
2. **Edit data in JSON** - Update structured data in `/site/public/data`
3. **Generate AI docs** - Run `node generate-ai-docs.js` to:
   - Read markdown from `/content`
   - Read JSON from `/site/public/data`
   - Combine both into comprehensive AI-optimized documentation in `/ai-docs`
4. **Website uses JSON** - The website reads directly from `/site/public/data` for dynamic content

## Adding New Content

### For narrative/instructional content:
1. Create a new `.md` file in `/content`
2. Update `generate-ai-docs.js` to load and use it
3. Regenerate docs with `node generate-ai-docs.js`

### For structured data:
1. Create or update `.json` file in `/site/public/data`
2. Update `generate-ai-docs.js` if needed for new data structure
3. Regenerate docs with `node generate-ai-docs.js`

## Single Source of Truth

The AI docs in `/ai-docs` are **generated artifacts**, not sources. Always edit:
- Content → `/content/*.md`
- Data → `/site/public/data/*.json`

Never edit files in `/ai-docs` directly - they will be overwritten on the next generation.
