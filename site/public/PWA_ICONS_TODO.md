# PWA Icons Placeholder

For now, we'll use simple SVG-based icons. In a real deployment, you'd want to:

1. Create proper PNG icons at the required sizes (64x64, 192x192, 512x512)
2. Design a maskable icon variant for Android
3. Add favicon.ico and apple-touch-icon.png

For development, the PWA plugin will work without these icons, but will show warnings.

To create proper icons:
1. Design a 512x512 icon representing Aetheria (maybe a fantasy world symbol)
2. Use an icon generator like https://realfavicongenerator.net/
3. Place the generated icons in the public/ directory

The current configuration assumes:
- pwa-64.png (64x64)
- pwa-192.png (192x192)
- pwa-512.png (512x512)
- favicon.ico
- apple-touch-icon.png
- masked-icon.svg
