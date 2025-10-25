import { useParams, A } from '@solidjs/router'
import { createMemo, createResource, Show, Suspense } from 'solid-js'
import { fetchCreaturesData, type CreatureData } from '@data/index'
import RankBadge from '../../components/RankBadge'
import AlignmentDisplay from '../../components/AlignmentDisplay'
import LinkedText from '../../components/LinkedText'

function CreatureDetail() {
  const params = useParams()
  const [creaturesData] = createResource(fetchCreaturesData)

  const creature = createMemo(() => {
    const data = creaturesData()
    if (!data) return null
    return data.creatures[params.id] as CreatureData
  })

  // Convert slug to display name (e.g., "fire_magic" -> "Fire Magic")
  const slugToDisplayName = (slug: string) => {
    return slug
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <Suspense fallback={<div class="container">Loading creature...</div>}>
      <Show
        when={creature()}
        fallback={<div class="container">Creature not found</div>}
      >
        <div class="container">
          <div class="entity-detail">
            <div class="entity-header">
              <div class="entity-image-large">
                <img
                  src="/unknown-192.png"
                  alt={creature()!.name}
                />
              </div>

              <div class="entity-info">
                <h1>{creature()!.name}</h1>
                <div class="entity-meta">
                  <span class="meta-item">
                    <RankBadge rank={creature()!.threatLevel} label="Threat Level" />
                  </span>
                </div>
                {creature()!.tags && (
                  <div class="entity-tags">
                    <strong>Tags:</strong> {(creature()!.tags || []).map((tag: string) => slugToDisplayName(tag)).join(', ')}
                  </div>
                )}
              </div>
            </div>

            <div class="entity-description">
              <h2>Description</h2>
              <p>
                <LinkedText text={creature()!.description} />
              </p>
            </div>

            <div class="entity-stats">
              <h2>Attributes</h2>
              <div class="stats-grid">
                <div class="stat-item">
                  <RankBadge rank={creature()!.attributes.strength} label="Strength" />
                </div>
                <div class="stat-item">
                  <RankBadge rank={creature()!.attributes.agility} label="Agility" />
                </div>
                <div class="stat-item">
                  <RankBadge rank={creature()!.attributes.constitution} label="Constitution" />
                </div>
                <div class="stat-item">
                  <RankBadge rank={creature()!.attributes.intelligence} label="Intelligence" />
                </div>
                <div class="stat-item">
                  <RankBadge rank={creature()!.attributes.willpower} label="Willpower" />
                </div>
                <div class="stat-item">
                  <RankBadge rank={creature()!.attributes.charisma} label="Charisma" />
                </div>
              </div>
            </div>

            <div class="entity-skills">
              <h2>Skills</h2>
              <div class="skills-grid">
                {Object.entries(creature()!.skills).map(([skill, rank]) => (
                  <div class="skill-item">
                    <RankBadge rank={rank as string} label={slugToDisplayName(skill)} />
                  </div>
                ))}
              </div>
            </div>

            <AlignmentDisplay alignment={creature()!.alignment} />

            <div class="entity-footer">
              <A href="/creatures" class="back-link">← Back to Creatures</A>
            </div>
          </div>
        </div>
      </Show>
    </Suspense>
  )
}

export default CreatureDetail
