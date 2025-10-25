import { createSignal, onMount } from 'solid-js'
import { pwaManager } from '../sw-manager'

function OfflineIndicator() {
  const [isOnline, setIsOnline] = createSignal(navigator.onLine)

  onMount(() => {
    // Register for online/offline events
    pwaManager.onOfflineChange((online) => {
      setIsOnline(online)
    })
  })

  return (
    <span class={`online-status ${isOnline() ? 'online' : 'offline'}`}>
      {isOnline() ? 'Online' : 'Offline'}
    </span>
  )
}

export default OfflineIndicator
