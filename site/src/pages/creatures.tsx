import { createResource, For, Suspense } from 'solid-js'
import EntityCard from '@/components/EntityCard'
import { fetchCreaturesData, parseRankRange, getEffectiveRangeFromDistribution, numberToRank, isPercentageDistribution } from '@data/index'

// Helper function to calculate threat range from subtypes
const calculateThreatRangeFromSubtypes = (subtypes: any) => {
  if (!subtypes || Object.keys(subtypes).length === 0) {
    return 'Unknown'
  }

  let minThreat = Infinity
  let maxThreat = -Infinity

  Object.values(subtypes).forEach((subtype: any) => {
    if (subtype.threatLevel) {
      let range

      if (typeof subtype.threatLevel === 'string') {
        range = parseRankRange(subtype.threatLevel)
      } else if (isPercentageDistribution(subtype.threatLevel)) {
        range = getEffectiveRangeFromDistribution(subtype.threatLevel)
      } else {
        return // Skip unknown formats
      }

      minThreat = Math.min(minThreat, range.min)
      maxThreat = Math.max(maxThreat, range.max)
    }
  })

  if (minThreat === Infinity || maxThreat === -Infinity) {
    return 'Unknown'
  }

  if (minThreat === maxThreat) {
    return numberToRank(minThreat)
  }

  return `${numberToRank(minThreat)}-${numberToRank(maxThreat)}`
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
      description: getCategoryDescription(category),
      calculatedThreatRange: calculateThreatRangeFromSubtypes(category.subtypes)
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
              rank={category.calculatedThreatRange}
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
