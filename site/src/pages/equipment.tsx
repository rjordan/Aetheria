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
          <div class="table-container table-responsive table-auto-cards">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th class="low-priority">Damage</th>
                  <th>Description</th>
                  <th class="low-priority">Alternate Names</th>
                </tr>
              </thead>
              <tbody>
                <For each={weapons()}>
                  {(weapon) => (
                    <tr>
                      <td data-label="Name">{weapon.name}</td>
                      <td data-label="Type">{weapon.type.join(', ')}</td>
                      <td data-label="Damage" class="low-priority">{weapon.damageType?.join(', ')}</td>
                      <td data-label="Description">{weapon.description}</td>
                      <td data-label="Alternate Names" class="low-priority">{weapon.alternateNames?.join(', ') || ''}</td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>

          <h2>Armor & Shields</h2>
          <div class="table-container table-responsive table-auto-cards">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th class="low-priority">Protection</th>
                  <th>Description</th>
                  <th class="low-priority">Alternate Names</th>
                </tr>
              </thead>
              <tbody>
                <For each={armorShields()}>
                  {(item) => (
                    <tr>
                      <td data-label="Name">{item.name}</td>
                      <td data-label="Type">{item.type.join(', ')}</td>
                      <td data-label="Protection" class="low-priority">{Object.entries(item.protection || {}).map(([key, value]) => (
                        <div>
                          {key}: {value}
                        </div>
                      ))}</td>
                      <td data-label="Description">{item.description}</td>
                      <td data-label="Alternate Names" class="low-priority">{item.alternateNames?.join(', ') || ''}</td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>

          <h2>Other Equipment & Items</h2>
          <div class="table-container table-responsive table-auto-cards">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th class="low-priority">Rarity</th>
                  <th class="low-priority">Slot</th>
                  <th class="low-priority">Function</th>
                  <th>Description</th>
                  <th class="low-priority">Alternate Names</th>
                </tr>
              </thead>
              <tbody>
                <For each={miscellaneousItems() || []}>
                  {(item) => (
                    <tr>
                      <td data-label="Name">{item.name}</td>
                      <td data-label="Type">{item.type?.join(', ') || ''}</td>
                      <td data-label="Rarity" class="low-priority">{item.rarity || ''}</td>
                      <td data-label="Slot" class="low-priority">{item.slot || ''}</td>
                      <td data-label="Function" class="low-priority">{item.function || ''}</td>
                      <td data-label="Description">{item.description}</td>
                      <td data-label="Alternate Names" class="low-priority">{item.alternateNames?.join(', ') || ''}</td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </Show>
      </Suspense>
    </div>
  )
}

export default Equipment
