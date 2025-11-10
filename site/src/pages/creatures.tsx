import { createResource, For, Suspense } from 'solid-js'
import EntityCard from '@/components/EntityCard'
import { fetchCreaturesData } from '@data/index'

// Helper function to format threat level display
const formatThreatLevel = (threatLevel: any) => {
  if (typeof threatLevel === 'string') {
    return threatLevel
  }
  if (typeof threatLevel === 'object' && threatLevel.range) {
    return threatLevel.range
  }
  if (typeof threatLevel === 'object') {
    // Handle percentage distribution - show most common with percentage
    const entries = Object.entries(threatLevel).map(([level, percent]) => ({
      level,
      percent: typeof percent === 'number' ? percent : parseFloat(String(percent).replace('%', ''))
    })).sort((a, b) => b.percent - a.percent)

    return entries.length > 0 ? `${entries[0].level} (${entries[0].percent}%)` : 'Varies'
  }
  return 'Unknown'
}

// Helper function to get category description
const getCategoryDescription = (category: any) => {
  const subtypeCount = category.subtypes ? Object.keys(category.subtypes).length : 0
  const baseDesc = category.description
  return `${baseDesc} (${subtypeCount} known ${subtypeCount === 1 ? 'variant' : 'variants'})`
}

function Creatures() {
  const [creaturesData] = createResource(fetchCreaturesData)

  const categories = () => {
    const data = creaturesData()
    if (!data) return []
    return Object.entries(data.creatures).map(([id, category]: [string, any]) => ({
      id,
      ...category,
      subtitle: `${Object.keys(category.subtypes || {}).length} variants`,
      description: getCategoryDescription(category)
    })).sort((a, b) => a.name.localeCompare(b.name))
  }

  return (
    <div class="container">
      <h1>Creatures</h1>
      <p>Explore the diverse creatures that inhabit the world of Aetheria, organized by major categories.</p>

      <Suspense fallback={<div>Loading creature categories...</div>}>
        <div class="entity-grid">
          <For each={categories()}>{(category) => (
            <EntityCard
              id={category.id}
              name={category.name}
              subtitle={category.subtitle}
              description={category.description}
              rank={formatThreatLevel(category.threatLevel)}
              rankLabel="Threat Range"
              imageUrl={category.imageUrl || undefined}
              basePath="/creatures"
            />
          )}</For>
        </div>
      </Suspense>
    </div>
  )
}

export default Creatures
