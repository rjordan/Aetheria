import { createSignal, onMount } from 'solid-js'
import { pwaManager } from '../sw-manager'

function OfflineIndicator() {
  const [isOnline, setIsOnline] = createSignal(navigator.onLine)
  const [showIndicator, setShowIndicator] = createSignal(false)
  const [updateAvailable, setUpdateAvailable] = createSignal(false)

  onMount(() => {
    // Register for online/offline events
    pwaManager.onOfflineChange((online) => {
      setIsOnline(online)

      // Show indicator briefly when status changes
      setShowIndicator(true)
      setTimeout(() => setShowIndicator(false), 5000)
    })

    // Show indicator on initial offline state
    if (!navigator.onLine) {
      setShowIndicator(true)
    }

    // Check for PWA update status
    if (pwaManager.updateAvailable) {
      setUpdateAvailable(true)
      setShowIndicator(true)
    }
  })

  const handleUpdateClick = () => {
    pwaManager.updateServiceWorker()
    setUpdateAvailable(false)
    setShowIndicator(false)
  }

  return (
    <div
      class={`offline-indicator ${showIndicator() ? 'visible' : ''} ${
        updateAvailable() ? 'update-available' : isOnline() ? 'online' : 'offline'
      }`}
    >
      <div class="indicator-content">
        {updateAvailable() ? (
          <>
            <span class="status-icon">🔄</span>
            <span class="status-text">Update available</span>
            <button class="update-button" onClick={handleUpdateClick}>
              Update
            </button>
          </>
        ) : isOnline() ? (
          <>
            <span class="status-icon">🌐</span>
            <span class="status-text">Back online</span>
          </>
        ) : (
          <>
            <span class="status-icon">📱</span>
            <span class="status-text">Offline mode - cached data available</span>
          </>
        )}
      </div>
    </div>
  )
}

export default OfflineIndicator
