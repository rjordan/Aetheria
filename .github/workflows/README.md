# GitHub Actions for Aetheria Documentation

This directory contains GitHub Actions workflows for automatically generating and releasing the Aetheria world reference documentation.

## Workflows

### 🚀 Release Documentation (`release-docs.yml`)

**Trigger:** Manual workflow dispatch
**Purpose:** Generate documentation and create a versioned GitHub release

#### Usage:
1. Go to **Actions** → **Generate and Release Documentation**
2. Click **Run workflow**
3. Enter a version tag (e.g., `v1.0.0`, `v2.1.0`)
4. Optionally mark as pre-release
5. Click **Run workflow**

#### What it does:
- ✅ Crawls the live GitHub Pages site
- ✅ Generates individual markdown files for each page
- ✅ Validates all required files are created
- ✅ Creates a metadata file with generation details
- ✅ Packages everything into a ZIP archive
- ✅ Creates a GitHub release with detailed description
- ✅ Attaches the ZIP file to the release

#### Output:
- **GitHub Release** with version tag
- **ZIP Archive**: `aetheria-docs-{version}.zip`
- **Release Notes** with file statistics and usage instructions

---

### 🧪 Test Documentation Generation (`test-docs.yml`)

**Trigger:** Manual dispatch or PR changes to crawler/workflows
**Purpose:** Test documentation generation without creating a release

#### Usage:
- **Manual**: Go to **Actions** → **Test Documentation Generation** → **Run workflow**
- **Automatic**: Triggered on PRs that modify the crawler or workflows

#### What it does:
- ✅ Generates documentation from live site
- ✅ Validates file structure and content
- ✅ Checks file sizes and counts
- ✅ Reports statistics and any issues
- ✅ Uploads generated files as artifacts (7-day retention)

#### Output:
- **Artifacts**: Generated markdown files for download/inspection
- **Logs**: Detailed validation and statistics

## Release Process

### Recommended Versioning:
- **Major versions** (v1.0.0, v2.0.0): Significant world updates or structural changes
- **Minor versions** (v1.1.0, v1.2.0): New content, additional pages, or feature improvements
- **Patch versions** (v1.0.1, v1.0.2): Bug fixes, formatting improvements, or small updates

### Example Release Workflow:
1. **Test First**: Run the test workflow to verify generation works
2. **Create Release**: Use the release workflow with appropriate version
3. **Verify**: Check the created release and download/test the ZIP file
4. **Announce**: Share the release link for others to download

## Archive Contents

Each release ZIP contains:
- **README.md** - Master index and navigation
- **Main sections** - Core world documentation (10 files)
- **Subsections** - Detailed pages like magic schools (10+ files)
- **RELEASE_INFO.md** - Generation metadata and usage instructions

## Benefits

### For Users:
- 📦 **Easy Download**: Single ZIP with everything
- 🏷️ **Versioned**: Track changes and updates over time
- 📋 **Complete Index**: Know exactly what's included
- 🤖 **AI Ready**: Optimized for AI model contexts

### For Maintainers:
- 🔄 **Automated**: No manual documentation generation
- ✅ **Validated**: Automatic checks ensure quality
- 📊 **Tracked**: GitHub releases provide download metrics
- 🔗 **Linked**: Direct connection to source commits

## File Structure

```
.github/workflows/
├── release-docs.yml    # Main release workflow
├── test-docs.yml       # Testing workflow
└── README.md          # This documentation
```

## Troubleshooting

### Common Issues:
- **Puppeteer fails**: Usually resolved by the comprehensive dependency installation
- **Missing files**: Check if the live site is accessible and pages are loading
- **Large files**: Verify the crawler isn't including unintended content
- **Permission errors**: Ensure GITHUB_TOKEN has appropriate permissions

### Debugging:
1. Run the test workflow first to identify issues
2. Check the action logs for specific error messages
3. Verify the live GitHub Pages site is functioning
4. Test the crawler locally if needed

## Future Enhancements

Potential improvements:
- **Scheduled releases**: Automatic releases on a schedule
- **Diff reports**: Compare changes between versions
- **Multiple formats**: PDF or HTML generation
- **Notification**: Slack/Discord notifications for new releases
- **CDN upload**: Automatically publish to a CDN
