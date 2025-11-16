import { createResource, createMemo, Show } from 'solid-js'
import { fetchReligionData, OfflineError } from '@data/index'
import ResponsiveTable, { TableColumn } from '../components/ResponsiveTable'

function Religion() {
  // Load deity data from JSON
  const [religionData] = createResource(fetchReligionData)

  // Sort deities alphabetically by name
  const sortedDeities = createMemo(() => {
    const data = religionData()
    if (!data?.deities) return []
    return [...data.deities].sort((a, b) => a.name.localeCompare(b.name))
  })

  // Check for offline errors
  const isOfflineError = () => religionData.error instanceof OfflineError

  // Column configuration for deity table
  const deityColumns: TableColumn[] = [
    { key: 'name', label: 'Deity', priority: 'high' },
    { key: 'domains', label: 'Domains', priority: 'high' },
    { key: 'alignment', label: 'Alignment', priority: 'medium' },
    { key: 'description', label: 'Description', priority: 'high' }
  ]

  return (
    <div class="religion-page">
      <h1>Religions & Deities</h1>
      <p>Aetheria is home to a pantheon of gods and goddesses, each representing different aspects of life and nature. Worship of these deities is widespread, with temples and shrines dedicated to them found throughout the land. Gods and goddesses have domains and portfolios they oversee, and their followers often seek their favor through prayer, offerings, and rituals. Few are truly good or evil, simply powerful beings embodying different aspects of existence. Note that while powerful and near omnipotent in their domains, gods in Aetheria are not all-powerful nor infallible. They suffer from human-like flaws and limitations, and their actions can have unintended consequences, they tend to rely on their immortality to save them from their follies.</p>

      <Show
        when={!religionData.loading && !religionData.error}
        fallback={
          <div>
            <Show when={religionData.loading}>
              <p>Loading deity data...</p>
            </Show>
            <Show when={religionData.error && !isOfflineError()}>
              <p class="error">Error loading deity data. Please try again later.</p>
            </Show>
            <Show when={isOfflineError()}>
              <p class="offline-notice">
                You're currently offline. Deity information is not available without a connection.
              </p>
            </Show>
          </div>
        }
      >
        <Show when={sortedDeities().length > 0}>
          <ResponsiveTable
            columns={deityColumns}
            data={sortedDeities()}
            className="deities-table"
          />
        </Show>
      </Show>
    </div>
  )
}

export default Religion
