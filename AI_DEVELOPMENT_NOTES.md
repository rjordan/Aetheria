# AI Development Notes
*Persistent notes for AI assistants working on the Aetheria project*

## 🎨 CSS/SCSS Styling Guidelines

### **CRITICAL: CSS Architecture Pattern**
**ALWAYS follow this hierarchy when organizing SCSS:**

1. **Variables** - All SCSS variables at the top
2. **Element Styles** - Base typography and layout elements (`p`, `h1-h6`, `a`, `button`, `table`, etc.)
3. **Class-Based Overrides** - Component and utility classes (`.container`, `.responsive-table`, etc.)
4. **Media Queries** - Responsive styles at the end

### **Styling Philosophy**
- **Element-first styling** - Set base styles on HTML elements
- **Classes for overrides** - Use classes for variations and components
- **IDs as last resort** - Avoid ID selectors (maintain low specificity)
- **Proper nesting** - Use SCSS nesting logically, don't over-nest

### **Active States & Accessibility**
- **Always specify text color** on hover/active states (e.g., `color: $white`)
- **Include .active class** styling for navigation elements
- **Enhanced :active states** with background changes and visual feedback
- **High contrast** - Ensure readable text on all backgrounds

### **SCSS Best Practices**
- **Meaningful variable names** - Use semantic naming like `$primary-color`, `$text-color`
- **Consistent color palette** - Stick to defined variables
- **Modern syntax** - Prefer newer SCSS functions when possible (though legacy OK for now)

## 📱 Responsive Design Patterns

### **Table Responsiveness**
- **ResponsiveTable component** - Use JavaScript-controlled responsive tables instead of CSS-only
- **Priority-based columns** - Hide less important columns first on smaller screens
- **Card layout fallback** - Switch to card layout for mobile when needed

### **Mobile-First Approach**
- **Base styles** work on mobile
- **Progressive enhancement** for larger screens
- **Touch-friendly** interactive elements

## 🏗️ Component Architecture

### **SolidJS Patterns**
- **TypeScript interfaces** for component props
- **Reactive data** with createSignal/createMemo
- **Clean separation** between data and presentation

### **UI Components**
- **OfflineIndicator** - Simple text status in footer showing "Online" or "Offline"
  - **Responsive design** - Breaks to new line on mobile screens
  - **Enhanced visibility** - Larger text and padding on small screens
  - **Color-coded status** - Green for online, yellow/orange for offline
- **ResponsiveTable** - JavaScript-controlled responsive tables
- **Layout** - Main layout component with header, nav, main, footer structure
  - **Responsive footer** - Stacks content vertically on mobile
  - **Mobile-first design** - Proper text sizing and spacing

### **File Organization**
- **Element styles first** in SCSS
- **Component-specific classes** grouped logically
- **Responsive styles** at the end of file

## 🚀 Build & Performance

### **Current Metrics** *(as of October 2025)*
- **CSS bundle size**: ~12.44 kB (reduced from 16.36 kB via reorganization)
- **JS bundle size**: ~122.54 kB
- **Build tool**: Vite 7.1.10
- **SCSS compiler**: Dart Sass (with deprecation warnings for old color functions)

### **Performance Considerations**
- **Smaller CSS bundles** through proper organization
- **Efficient selectors** - element selectors are faster than class selectors
- **Minimal specificity** wars through proper hierarchy

## 🔧 Development Workflow

### **When Making CSS Changes**
1. **Check current structure** before editing
2. **Follow the hierarchy** - element → class → media queries
3. **Test build** after major changes
4. **Verify contrast** on active/hover states
5. **CRITICAL: Avoid duplicate media queries** - Consolidate responsive styles

### **Common Pitfalls to Avoid**
- **Duplicate @media blocks** - Always merge styles with same breakpoint
- **Conflicting responsive styles** - Check for existing media queries before adding new ones
- **Breaking mobile-first approach** - Maintain consistent breakpoint strategy

### **File Structure Maintained**
```
/site/src/
  ├── index.scss (main stylesheet - KEEP ORGANIZED!)
  ├── components/ (SolidJS components)
  └── pages/ (page components using ResponsiveTable)
```

## 📝 Known Issues & Technical Debt

### **SCSS Deprecation Warnings**
- `lighten()` and `darken()` functions deprecated
- Should eventually migrate to `color.adjust()` or `color.scale()`
- Not critical - still works, just shows warnings

### **Responsive Table Pages**
- **Converted to ResponsiveTable**: equipment.tsx, magic.tsx, classes.tsx, religion.tsx
- **Still need conversion**: alignment.tsx, politics.tsx, relationships.tsx (if they have tables)

## 🎯 Future Considerations

### **Potential Improvements**
- **Modern SCSS functions** - Update deprecated color functions
- **CSS custom properties** - Consider CSS variables for theming
- **Component CSS** - Evaluate CSS modules or styled-components if needed

### **Accessibility Enhancements**
- **Focus states** - Ensure keyboard navigation is clear
- **Color contrast** - Verify WCAG compliance
- **Screen reader** - Test with assistive technologies

---

*Last updated: October 25, 2025*
*Remember: This file helps maintain consistency across AI sessions!*
