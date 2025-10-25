import { useParams, A } from '@solidjs/router'
import { createMemo, createResource, Show, Suspense } from 'solid-js'
import { fetchCharactersData, type CharacterData } from '@data/index'
import RankBadge from '../../components/RankBadge'
import AlignmentDisplay from '../../components/AlignmentDisplay'
import LinkedText from '../../components/LinkedText'

function CharacterDetail() {
  const params = useParams()
  const [charactersData] = createResource(fetchCharactersData)

  const character = createMemo(() => {
    const data = charactersData()
    if (!data) return null
    return data.characters[params.id] as CharacterData
  })

  // Convert slug to display name (e.g., "fire_magic" -> "Fire Magic")
  const slugToDisplayName = (slug: string) => {
    return slug
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <Suspense fallback={<div class="container">Loading character...</div>}>
      <Show
        when={character()}
        fallback={<div class="container">Character not found</div>}
      >
        <div class="container">
          <div class="entity-detail">
            <div class="entity-header">
              <div class="entity-image-large">
                <img
                  src={character()!.imageUrl || '/unknown-192.png'}
                  alt={character()!.name}
                />
              </div>

              <div class="entity-info">
                <h1>{character()!.name}</h1>
                <div class="entity-meta">
                  <span class="meta-item">
                    <strong>Race:</strong> {character()!.race || 'Unknown'}
                  </span>
                  <span class="meta-item">
                    <strong>Class:</strong> {character()!.class || 'Unknown'}
                  </span>
                  <span class="meta-item">
                    <RankBadge rank={character()!.threatLevel} label="Entity Rank" />
                  </span>
                </div>
              </div>
            </div>

            <div class="entity-description">
              <h2>Description</h2>
              <p>
                <LinkedText text={character()!.fullDescription || character()!.description} />
              </p>
            </div>

            <div class="entity-stats">
              <h2>Attributes</h2>
              <div class="stats-grid">
                <div class="stat-item">
                  <RankBadge rank={character()!.attributes.strength} label="Strength" />
                </div>
                <div class="stat-item">
                  <RankBadge rank={character()!.attributes.agility} label="Agility" />
                </div>
                <div class="stat-item">
                  <RankBadge rank={character()!.attributes.constitution} label="Constitution" />
                </div>
                <div class="stat-item">
                  <RankBadge rank={character()!.attributes.intelligence} label="Intelligence" />
                </div>
                <div class="stat-item">
                  <RankBadge rank={character()!.attributes.willpower} label="Willpower" />
                </div>
                <div class="stat-item">
                  <RankBadge rank={character()!.attributes.charisma} label="Charisma" />
                </div>
              </div>
            </div>

            <div class="entity-skills">
              <h2>Skills</h2>
              <div class="skills-grid">
                {Object.entries(character()!.skills).map(([skill, rank]) => (
                  <div class="skill-item">
                    <RankBadge rank={rank} label={slugToDisplayName(skill)} />
                  </div>
                ))}
              </div>
            </div>

            <Show when={(character() as any)?.alignment}>
              <AlignmentDisplay alignment={(character() as any).alignment} />
            </Show>

            <div class="entity-footer">
              <A href="/characters" class="back-link">← Back to Characters</A>
            </div>
          </div>
        </div>
      </Show>
    </Suspense>
  )
}

export default CharacterDetail
