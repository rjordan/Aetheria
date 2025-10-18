# Aetheria Static Site Generator

This generates a complete static website from your Aetheria world data that can be deployed to GitHub Pages.

## Quick Start

```bash
# Install dependencies
npm install

# Generate the static site
npm run build

# Preview locally
npm run preview
```

## What It Generates

The generator creates a complete static website with:

### 🏠 **Home Page**
- Overview of the world
- Quick navigation to documentation and data
- Statistics about your content

### 📚 **Documentation Section**
- All markdown files from `../docs/` converted to HTML
- Clean, readable formatting with syntax highlighting
- Cross-references and navigation

### 📊 **Data Browser**
- Interactive pages for each data type (creatures, classes, etc.)
- Individual entity pages with properties and relationships
- Hierarchical navigation showing inheritance trees
- Beautiful visual representation of your YAML data

### 🎨 **Features**
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Clean UI**: Professional styling with gradient headers and card layouts
- **Navigation**: Breadcrumbs, menus, and cross-links
- **Search-Friendly**: Generates sitemap.xml for SEO
- **Fast Loading**: Optimized static HTML with minimal CSS

## File Structure

```
dist/
├── index.html              # Home page
├── sitemap.xml             # SEO sitemap
├── css/
│   └── style.css          # All styles
├── docs/                  # Documentation pages
│   ├── index.html         # Docs overview
│   ├── magic.html         # Magic.md → HTML
│   ├── politics.html      # Politics.md → HTML
│   └── ...
└── data/                  # Data browser
    ├── index.html         # Data overview
    ├── creatures/
    │   ├── index.html     # Creatures overview with hierarchy
    │   ├── lilith.html    # Individual entity pages
    │   └── ...
    ├── classes/
    ├── equipment/
    ├── magic_schools/
    └── organizations/
```

## GitHub Pages Deployment

### Automatic Deployment

The included GitHub Actions workflow (`.github/workflows/deploy-pages.yml`) automatically:

1. **Triggers** on every push to main branch
2. **Builds** the static site using this generator
3. **Deploys** to GitHub Pages automatically
4. **Makes available** at `https://yourusername.github.io/Aetheria`

### Manual Setup

If you need to set up GitHub Pages manually:

1. Go to your repository Settings
2. Navigate to Pages section
3. Set Source to "GitHub Actions"
4. The workflow will handle the rest

## Development

### Local Preview
```bash
npm run preview
# Opens http://localhost:8000
```

### Build Process
```bash
npm run build
```

The build process:
1. Compiles TypeScript to JavaScript
2. Runs the generator to create static HTML
3. Outputs everything to `dist/`

### Customization

#### Styling
Edit the CSS in `src/generator.ts` in the `generateCSS()` method to customize:
- Colors and themes
- Layout and typography
- Responsive breakpoints
- Component styling

#### Templates
The generator uses inline HTML templates. You can modify:
- Page structure in `generatePageHTML()`
- Entity card layouts
- Navigation and breadcrumbs
- Content organization

#### Data Processing
Customize how your YAML data is processed:
- Entity property display
- Hierarchy visualization
- Cross-references and links
- Search and navigation

## Integration with Existing Tools

### MCP Server
The static site complements your MCP server:
- **MCP**: AI integration and dynamic queries
- **Static Site**: Human-readable documentation and browsing

### Data Sources
Uses the same data sources for consistency:
- `../data/` - YAML hierarchical data
- `../docs/` - Markdown documentation
- `../templates/` - Template files (referenced but not used in current version)

## Content Features

### 📖 **Documentation Conversion**
- Converts all markdown files to beautiful HTML
- Preserves frontmatter and metadata
- Handles tables, code blocks, and formatting
- Maintains links and references

### 🌳 **Hierarchy Visualization**
- Shows entity relationships clearly
- Parent-child navigation
- Inheritance trees (Fiend → Demon → Succubus → Lilith)
- Cross-references between related entities

### 📱 **Mobile-Friendly**
- Responsive grid layouts
- Touch-friendly navigation
- Optimized for all screen sizes
- Fast loading on mobile connections

### 🔍 **SEO Optimized**
- Generates sitemap.xml
- Proper HTML metadata
- Semantic markup
- Clean URLs

## Use Cases

### 🌐 **Public Documentation**
Share your world with players, readers, or collaborators via a public website.

### 📚 **Reference Material**
Create a searchable, browsable reference for your world-building.

### 🎮 **Game Master Resources**
Quick access to world information during gaming sessions.

### 📝 **Content Organization**
Visual overview of your world's complexity and relationships.

## Examples

Your generated site will include pages like:

- **Home**: Overview with quick stats and navigation
- **Magic**: Your magic system documentation with spell schools
- **Creatures**: Browsable hierarchy from Fiends down to specific demons
- **Politics**: Government structures and political entities
- **Classes**: Character classes with specializations
- **Equipment**: Weapons, armor, and tools with properties

Each page maintains consistent styling and navigation while preserving the rich relationships in your data.

## Technical Details

- **TypeScript**: Type-safe generation process
- **No Runtime Dependencies**: Pure static HTML/CSS
- **GitHub Actions**: Automated deployment
- **SEO Ready**: Sitemap and meta tags included
- **Fast**: Optimized for quick loading
- **Accessible**: Semantic HTML and good contrast

Your Aetheria world data becomes a beautiful, professional website that anyone can explore! 🌍✨
