import { useParams, A } from '@solidjs/router'
import { createMemo, createResource, Show, Suspense, For } from 'solid-js'
import { fetchCreaturesData, resolveImageUrl } from '@data/index'
import RankBadge from '../../components/RankBadge'
import AlignmentDisplay from '../../components/AlignmentDisplay'
import LinkedText from '../../components/LinkedText'

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

function CreatureDetail() {
  const params = useParams()
  const [creaturesData] = createResource(fetchCreaturesData)

  const creatureData = createMemo(() => {
    const data = creaturesData()
    if (!data) return { creature: null, category: null, categoryName: '' }

    // Handle flat ID format: "categoryId-subtypeId"
    const idParts = params.id.split('-')
    if (idParts.length >= 2) {
      const categoryId = idParts[0]
      const subtypeId = idParts.slice(1).join('-') // Handle cases where subtype ID might contain dashes

      const cat = data.creatures[categoryId] as any
      if (!cat || !cat.subtypes) return { creature: null, category: null, categoryName: '' }

      const creature = cat.subtypes[subtypeId]
      return {
        creature,
        category: cat,
        categoryName: cat.name
      }
    } else {
      // Fallback: try to find creature directly (backwards compatibility)
      const creature = data.creatures[params.id] as any
      return { creature, category: null, categoryName: '' }
    }
  })

  const creature = () => creatureData().creature
  const categoryName = () => creatureData().categoryName  // Convert slug to display name (e.g., "fire_magic" -> "Fire Magic")
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
                  src={resolveImageUrl(creature()!.imageUrl) || resolveImageUrl('/images/unknown-192.png') || '/images/unknown-192.png'}
                  alt={creature()!.name}
                />
              </div>

              <div class="entity-info">
                <h1>{creature()!.name}</h1>
                {categoryName() && (
                  <div class="entity-breadcrumb">
                    <A href="/creatures" class="breadcrumb-link">Creatures</A>
                    <span> › </span>
                    <A href={`/creatures#${params.id.split('-')[0]}`} class="breadcrumb-link">{categoryName()}</A>
                    <span> › </span>
                    <span>{creature()!.name}</span>
                  </div>
                )}
                <div class="entity-meta">
                  <span class="meta-item">
                    <RankBadge rank={formatThreatLevel(creature()!.threatLevel)} label="Threat Level" />
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

            <Show when={creature()!.attributes}>
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
            </Show>

            <Show when={creature()!.skills && Object.keys(creature()!.skills).length > 0}>
              <div class="entity-skills">
                <h2>Skills</h2>
                <div class="skills-grid">
                  <For each={Object.entries(creature()!.skills || {})}>{([skill, rank]) => (
                    <div class="skill-item">
                      <RankBadge rank={rank as string} label={slugToDisplayName(skill)} />
                    </div>
                  )}</For>
                </div>
              </div>
            </Show>

            <Show when={creature()!.powers && Object.keys(creature()!.powers).length > 0}>
              <div class="entity-powers">
                <h2>Powers & Abilities</h2>
                <div class="powers-grid">
                  <For each={Object.entries(creature()!.powers || {})}>{([powerId, description]) => (
                    <div class="power-item">
                      <h3>{slugToDisplayName(powerId)}</h3>
                      <p>{description as string}</p>
                    </div>
                  )}</For>
                </div>
              </div>
            </Show>

            <AlignmentDisplay alignment={creature()!.alignment} />

            <div class="entity-footer">
              <Show
                when={categoryName()}
                fallback={<A href="/creatures" class="back-link">← Back to Creatures</A>}
              >
                <A href={`/creatures#${params.id.split('-')[0]}`} class="back-link">← Back to {categoryName()}</A>
              </Show>
            </div>
          </div>
        </div>
      </Show>
    </Suspense>
  )
}

export default CreatureDetail
