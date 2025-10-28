import { createResource, For, Suspense } from 'solid-js'
import EntityCard from '@/components/EntityCard'
import { fetchCharactersData, fetchCreaturesData } from '@data/index'

// Example usage of EntityCard component with real data
function Characters() {
  const [charactersData] = createResource(fetchCharactersData)

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

  return (
    <div class="container">
      <h1>Notable Characters</h1>
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
      </Suspense>
    </div>
  )
}

export default Characters
