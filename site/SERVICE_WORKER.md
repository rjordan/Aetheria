# PWA Implementation with vite-plugin-pwa

## Overview

The Aetheria site now uses `vite-plugin-pwa` with Workbox for intelligent caching and offline functionality, providing a robust PWA experience.

## Features

### ✅ **Offline Support**
- Site works offline with cached data
- Graceful fallback when data isn't cached
- Visual indicators for online/offline status

### ✅ **Intelligent Caching**
- **Static Assets**: Cache-first strategy (CSS, JS, images)
- **Data Files**: Network-first with cache fallback (fresh data preferred)
- **Pages**: Network-first with cache fallback

### ✅ **Cache Management**
- Automatic cache versioning and cleanup
- Programmatic cache clearing
- Cache status inspection for debugging

## Architecture

### PWA Plugin (`vite-plugin-pwa`)
- Automatic service worker generation with Workbox
- Handles all caching strategies automatically
- Provides offline fallbacks and PWA manifest

### PWA Manager (`/src/sw-manager.ts`)
- TypeScript interface for PWA functionality
- Handles registration and updates via plugin
- Provides simplified cache management

### Data Loading (`/src/data/index.ts`)
- Removed in-memory cache
- Service worker handles all caching
- Offline error handling with custom `OfflineError`

### UI Components
- `OfflineIndicator`: Shows online/offline status
- Enhanced error states for offline scenarios

## Usage

### Basic Data Loading
```typescript
import { fetchMagicData } from '@data/index'

try {
  const data = await fetchMagicData()
  // Use data normally
} catch (error) {
  if (error instanceof OfflineError) {
    // Handle offline scenario
  }
}
```

### Cache Management
```typescript
import { clearDataCache, getOfflineStatus } from '@data/index'

// Clear specific data cache
await clearDataCache('magic')

// Clear all data cache
await clearDataCache()

// Get offline status and cache info
const status = await getOfflineStatus()
console.log(status.online, status.caches)
```

### Development Helpers
```javascript
// Available in dev mode
window.swManager.getCacheStatus()
window.swManager.clearCache('magic')
```

## Cache Strategies

### 1. Static Assets (Cache First)
- CSS, JS, images, fonts
- Served from cache immediately
- Updated when cache expires

### 2. Data Files (Network First)
- JSON data files from `/data/`
- Fresh data preferred when online
- Cached data when offline

### 3. Pages (Network First)
- HTML pages and API endpoints
- Fresh content when online
- Cached content when offline

## Benefits Over In-Memory Cache

| Feature | In-Memory Cache | Service Worker |
|---------|----------------|----------------|
| **Persistence** | Lost on page reload | Persists across sessions |
| **Offline Support** | None | Full offline functionality |
| **Cache Size** | Limited by memory | Larger persistent storage |
| **Strategies** | Simple TTL | Multiple strategies |
| **Browser Support** | All browsers | Modern browsers |
| **Asset Caching** | Data only | Data + static assets |

## Browser Support

- ✅ Chrome 45+
- ✅ Firefox 44+
- ✅ Safari 10+
- ✅ Edge 17+
- ❌ IE (not supported)

## Development vs Production

- **Development**: Service worker registration disabled by default
- **Production**: Automatic service worker registration
- **Debug Mode**: `window.swManager` available in dev mode

## Cache Storage

The service worker creates three cache buckets:
- `aetheria-v1-static`: Static assets (CSS, JS, images)
- `aetheria-v1-data`: JSON data files
- `aetheria-v1-runtime`: Dynamic content and pages

Cache version automatically increments to handle updates.
