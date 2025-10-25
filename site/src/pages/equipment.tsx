import { createResource, For, Suspense, Show } from "solid-js"
import { EquipmentItemData, fetchEquipmentData, OfflineError } from "@data/index"

function Equipment() {
  const [equipmentData] = createResource(fetchEquipmentData)

  // Check for offline errors
  const isOfflineError = () => equipmentData.error instanceof OfflineError

  const weapons = (): EquipmentItemData[] => {
    const data = equipmentData()
    if (!data) return []
    return Object.entries(data.equipment.weapons).map(([key, item]: [string, EquipmentItemData]) => ({
      key,
      ...item,
    })).sort((a, b) => a.name.localeCompare(b.name))
  }

  const armorShields = (): EquipmentItemData[] => {
    const data = equipmentData()
    if (!data) return []
    return Object.entries(data.equipment.armor_and_shields).map(([key, item]: [string, EquipmentItemData]) => ({
      key,
      ...item,
    })).sort((a, b) => {
      if (a.type[0] !== b.type[0]) {
        return a.type[0].localeCompare(b.type[0])
      }
      return a.name.localeCompare(b.name)
    })
  }

  const miscellaneousItems = (): EquipmentItemData[] => {
    const data = equipmentData()
    if (!data) return []

    return Object.entries(data.equipment.miscellaneous || {}).map(([key, item]: [string, EquipmentItemData]) => ({
      key,
      ...item,
    })).sort((a, b) => a.name.localeCompare(b.name))
  }

  return (
    <div class="equipment-page">
      <h1>Equipment & Items</h1>
      <p>Information about equipment, weapons, and magical items in Aetheria.</p>

      <Suspense
        fallback={
          <div class="loading-state">
            <Show when={isOfflineError()} fallback={<div>Loading equipment data...</div>}>
              <div class="offline-error">
                <h3>📱 Offline Mode</h3>
                <p>Equipment data is not available offline. Please check your connection.</p>
              </div>
            </Show>
          </div>
        }
      >
        <Show when={!isOfflineError()} fallback={
          <div class="offline-error">
            <h3>📱 Offline Mode</h3>
            <p>Equipment data is not available offline. Please check your connection.</p>
            <p>You can still browse the information above, but the interactive equipment tables require an internet connection.</p>
          </div>
        }>
          <h2>Weapons</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Damage</th>
            <th>Description</th>
            <th>Alternate Names</th>
          </tr>
        </thead>
        <tbody>
          <For each={weapons()}>
            {(weapon) => (
              <tr>
                <td>{weapon.name}</td>
                <td>{weapon.type.join(', ')}</td>
                <td>{weapon.damageType?.join(', ')}</td>
                <td>{weapon.description}</td>
                <td>{weapon.alternateNames?.join(', ') || ''}</td>
              </tr>
            )}
          </For>
        </tbody>
      </table>

      <h2>Armor & Shields</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Protection</th>
            <th>Description</th>
            <th>Alternate Names</th>
          </tr>
        </thead>
        <tbody>
          <For each={armorShields()}>
            {(item) => (
              <tr>
                <td>{item.name}</td>
                <td>{item.type.join(', ')}</td>
                <td>{Object.entries(item.protection || {}).map(([key, value]) => (
                  <div>
                    {key}: {value}
                  </div>
                ))}</td>
                <td>{item.description}</td>
                <td>{item.alternateNames?.join(', ') || ''}</td>
              </tr>
            )}
          </For>
        </tbody>
      </table>

      <h2>Other Equipment & Items</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Rarity</th>
            <th>Slot</th>
            <th>Function</th>
            <th>Description</th>
            <th>Alternate Names</th>
          </tr>
        </thead>
        <tbody>
          <For each={miscellaneousItems() || []}>
            {(item) => (
              <tr>
                <td>{item.name}</td>
                <td>{item.type?.join(', ') || ''}</td>
                <td>{item.rarity || ''}</td>
                <td>{item.slot || ''}</td>
                <td>{item.function || ''}</td>
                <td>{item.description}</td>
                <td>{item.alternateNames?.join(', ') || ''}</td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
        </Show>
      </Suspense>
    </div>
  )
}

export default Equipment
