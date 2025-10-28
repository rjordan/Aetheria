import { createResource, For, Suspense } from 'solid-js'
import EntityCard from '@/components/EntityCard'
import { fetchCharactersData, fetchCreaturesData } from '@data/index'

// Example usage of EntityCard component with real data
function Creatures() {
  const [creaturesData] = createResource(fetchCreaturesData)


  const creatures = () => {
    const data = creaturesData()
    if (!data) return []
    return Object.entries(data.creatures).map(([id, creature]) => ({
      id,
      ...creature,
      // Generate subtitle from available data
      subtitle: `Wild Animal` // Could be derived from tags or other data
    }))
  }

  return (
    <div class="container">
      <h1>Creatures</h1>
      <Suspense fallback={<div>Loading entities...</div>}>
        <div class="entity-grid">
          <For each={creatures()}>{(creature) => (
            <EntityCard
              id={creature.id}
              name={creature.name}
              subtitle={creature.subtitle}
              description={creature.description}
              rank={creature.threatLevel}
              rankLabel="Threat Level"
              imageUrl={creature.imageUrl || undefined}
              basePath="/creatures"
            />
          )}</For>
        </div>
      </Suspense>
    </div>
  )
}

export default Creatures
