import { createResource, Suspense, Show } from "solid-js"
import { EquipmentItemData, fetchEquipmentData, OfflineError } from "@data/index"
import ResponsiveTable, { TableColumn } from "../components/ResponsiveTable"

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

  // Define column configurations for each table
  const weaponColumns: TableColumn[] = [
    { key: 'name', label: 'Name', priority: 'high' },
    { key: 'type', label: 'Type', priority: 'high' },
    { key: 'damageType', label: 'Damage', priority: 'medium' },
    { key: 'description', label: 'Description', priority: 'high' },
    { key: 'alternateNames', label: 'Alternate Names', priority: 'low' }
  ]

  const armorColumns: TableColumn[] = [
    { key: 'name', label: 'Name', priority: 'high' },
    { key: 'type', label: 'Type', priority: 'high' },
    {
      key: 'protection',
      label: 'Protection',
      priority: 'medium',
      render: (value) => {
        if (!value || typeof value !== 'object') return ''
        return Object.entries(value).map(([key, val]) => `${key}: ${val}`).join(', ')
      }
    },
    { key: 'description', label: 'Description', priority: 'high' },
    { key: 'alternateNames', label: 'Alternate Names', priority: 'low' }
  ]

  const miscColumns: TableColumn[] = [
    { key: 'name', label: 'Name', priority: 'high' },
    { key: 'type', label: 'Type', priority: 'high' },
    { key: 'rarity', label: 'Rarity', priority: 'low' },
    { key: 'slot', label: 'Slot', priority: 'low' },
    { key: 'function', label: 'Function', priority: 'medium' },
    { key: 'description', label: 'Description', priority: 'high' },
    { key: 'alternateNames', label: 'Alternate Names', priority: 'low' }
  ]

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
          <ResponsiveTable
            columns={weaponColumns}
            data={weapons()}
            className="weapons-table"
          />

          <h2>Armor & Shields</h2>
          <ResponsiveTable
            columns={armorColumns}
            data={armorShields()}
            className="armor-table"
          />

          <h2>Other Equipment & Items</h2>
          <ResponsiveTable
            columns={miscColumns}
            data={miscellaneousItems() || []}
            className="misc-table"
          />
        </Show>
      </Suspense>
    </div>
  )
}

export default Equipment
