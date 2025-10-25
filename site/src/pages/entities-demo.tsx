import { createResource, For, Suspense } from 'solid-js'
import EntityCard from '@/components/EntityCard'
import { fetchCharactersData, fetchCreaturesData } from '@data/index'

// Example usage of EntityCard component with real data
function EntityCardsDemo() {
  const [charactersData] = createResource(fetchCharactersData)
  const [creaturesData] = createResource(fetchCreaturesData)

  // Convert data objects to arrays for rendering
  const characters = () => {
    const data = charactersData()
    if (!data) return []
    return Object.entries(data.characters).map(([id, character]) => ({
      id,
      ...character,
      // Generate subtitle from available data
      subtitle: `${character.race || 'Unknown'} ${character.class || 'Character'}`
    }))
  }

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
      <h1>Characters & Creatures</h1>
      <p>Example usage of the EntityCard component for displaying characters and creatures loaded from JSON data.</p>

      <Suspense fallback={<div>Loading entities...</div>}>
        <h2>Characters</h2>
        <div class="entity-grid">
          <For each={characters()}>{(character) => (
            <EntityCard
              id={character.id}
              name={character.name}
              subtitle={character.subtitle}
              description={character.description}
              rank={character.threatLevel}
              rankLabel="Entity Rank"
              imageUrl={character.imageUrl || undefined}
              basePath="/characters"
            />
          )}</For>
        </div>

        <h2>Creatures</h2>
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

export default EntityCardsDemo
