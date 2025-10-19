/**
 * PWA Service Worker Manager using vite-plugin-pwa
 *
 * Simplified interface using the PWA plugin instead of manual service worker management
 */

import type { RegisterSWOptions } from 'vite-plugin-pwa/types'

interface PWAManager {
  updateAvailable: boolean
  offlineReady: boolean
  isOnline(): boolean
  onOfflineChange(callback: (online: boolean) => void): void
  checkForUpdates(): Promise<void>
  updateServiceWorker(): Promise<void>
}

class AetheriaPWAManager implements PWAManager {
  private onlineCallbacks: Array<(online: boolean) => void> = []
  private updateSW: ((reloadPage?: boolean) => Promise<void>) | undefined

  public updateAvailable = false
  public offlineReady = false

  constructor() {
    // Listen for online/offline events
    window.addEventListener('online', () => this.handleOnlineChange(true))
    window.addEventListener('offline', () => this.handleOnlineChange(false))

    // Initialize PWA registration
    this.initializePWA()
  }

  private async initializePWA() {
    // Dynamic import to avoid issues if PWA plugin isn't available
    try {
      const { registerSW } = await import('virtual:pwa-register')

      const swOptions: RegisterSWOptions = {
        onNeedRefresh: () => {
          console.log('[PWA] Update available')
          this.updateAvailable = true
          this.showUpdateNotification()
        },
        onOfflineReady: () => {
          console.log('[PWA] App ready to work offline')
          this.offlineReady = true
          this.showOfflineReadyNotification()
        },
        onRegistered: (registration) => {
          console.log('[PWA] Service worker registered:', registration)
        },
        onRegisterError: (error) => {
          console.error('[PWA] Service worker registration error:', error)
        }
      }

      this.updateSW = registerSW(swOptions)

    } catch (error) {
      console.warn('[PWA] PWA plugin not available, running without service worker')
    }
  }

  async checkForUpdates(): Promise<void> {
    // The PWA plugin handles this automatically with 'autoUpdate'
    // This method is kept for compatibility
    console.log('[PWA] Automatic updates enabled - manual check not needed')
  }

  async updateServiceWorker(): Promise<void> {
    if (this.updateSW) {
      await this.updateSW(true)
    }
  }

  isOnline(): boolean {
    return navigator.onLine
  }

  onOfflineChange(callback: (online: boolean) => void): void {
    this.onlineCallbacks.push(callback)
  }

  private handleOnlineChange(online: boolean): void {
    console.log('[PWA] Online status changed:', online)
    this.onlineCallbacks.forEach(callback => callback(online))
  }

  private showUpdateNotification(): void {
    // Enhanced notification - could be a custom UI component
    const message = 'A new version of Aetheria is available!'
    const action = 'Update now'

    if ('Notification' in window && Notification.permission === 'granted') {
      const notification = new Notification(message, {
        icon: '/pwa-192.png',
        badge: '/pwa-64.png',
        tag: 'update-available'
      })

      notification.onclick = () => {
        this.updateServiceWorker()
        notification.close()
      }
    } else {
      // Fallback to confirm dialog
      if (confirm(`${message} ${action}?`)) {
        this.updateServiceWorker()
      }
    }
  }

  private showOfflineReadyNotification(): void {
    console.log('[PWA] App is ready to work offline!')

    // Could show a toast notification here
    // For now, just log - the OfflineIndicator component handles UI
  }
}

// Export singleton instance
export const pwaManager = new AetheriaPWAManager()

// Legacy export for compatibility
export const swManager = pwaManager

// Development helper
if (import.meta.env.DEV) {
  // @ts-ignore
  window.pwaManager = pwaManager
  // @ts-ignore - Keep legacy name
  window.swManager = pwaManager
  console.log('[PWA] Development mode - pwaManager available globally')
}
