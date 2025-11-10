import { useParams, A } from '@solidjs/router'
import { createMemo, createResource, Show, Suspense, For } from 'solid-js'
import { fetchCreaturesData } from '@data/index'
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

// Helper function to check if threat level is a range/percentage distribution
const isThreatLevelRange = (threatLevel: any) => {
  return typeof threatLevel === 'object' && !threatLevel.range && Object.keys(threatLevel).length > 1
}

// Helper function to get threat level entries sorted by percentage
const getThreatLevelEntries = (threatLevel: any) => {
  if (typeof threatLevel !== 'object' || threatLevel.range) return []
  return Object.entries(threatLevel).map(([level, percent]) => ({
    level,
    percent: typeof percent === 'number' ? percent : parseFloat(String(percent).replace('%', ''))
  })).sort((a, b) => b.percent - a.percent)
}// Helper function to compare alignments for deep equality
const alignmentsEqual = (align1: any, align2: any) => {
  if (!align1 || !align2) return false

  const aspects = ['ideology', 'morality', 'methodology', 'temperament']

  for (const aspect of aspects) {
    const a1 = align1[aspect]
    const a2 = align2[aspect]

    if (!a1 || !a2) return false
    if (a1.value !== a2.value) return false
    if (a1.modifier !== a2.modifier) return false
  }

  return true
}

function CreatureCategoryDetail() {
  const params = useParams()
  const [creaturesData] = createResource(fetchCreaturesData)

  const category = createMemo(() => {
    const data = creaturesData()
    if (!data) return null
    return data.creatures[params.id] as any
  })

  const subtypes = createMemo(() => {
    const cat = category()
    if (!cat || !cat.subtypes) return []
    return Object.entries(cat.subtypes).map(([id, subtype]: [string, any]) => ({
      id,
      ...subtype
    }))
  })

  // Convert slug to display name
  const slugToDisplayName = (slug: string) => {
    return slug
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  return (
    <Suspense fallback={<div class="container">Loading creature category...</div>}>
      <Show
        when={category()}
        fallback={<div class="container">Creature category not found</div>}
      >
        <div class="container">
          <div class="entity-detail">
            {/* Category Header */}
            <div class="entity-header">
              <div class="entity-info">
                <h1>{category()!.name}</h1>
                <div class="entity-meta">
                  <span class="meta-item">
                    <strong>Threat Range:</strong> {formatThreatLevel(category()!.threatLevel)}
                  </span>
                  <span class="meta-item">
                    <strong>Variants:</strong> {subtypes().length}
                  </span>
                </div>
                {category()!.tags && (
                  <div class="entity-tags">
                    <strong>Tags:</strong> {(category()!.tags || []).map((tag: string) => slugToDisplayName(tag)).join(', ')}
                  </div>
                )}
              </div>
            </div>

            {/* Category Description */}
            <div class="entity-description">
              <h2>Description</h2>
              <p>
                <LinkedText text={category()!.description} />
              </p>
            </div>

            {/* Variants Section */}
            <div class="variants-section">
              <h2>Known Variants</h2>
              <p>The following are specific examples and variants of {category()!.name.toLowerCase()}s encountered in Aetheria:</p>

              <div class="variants-list">
                <For each={subtypes()}>{(subtype) => (
                  <div class="variant-detail">
                    <div class="variant-header">
                      <h3>{subtype.name}</h3>
                      <div class="variant-meta">
                        <Show
                          when={isThreatLevelRange(subtype.threatLevel)}
                          fallback={<RankBadge rank={formatThreatLevel(subtype.threatLevel)} label="Threat Level" />}
                        >
                          <div class="threat-levels-range">
                            <span class="threat-levels-label">Threat Levels:</span>
                            <div class="threat-levels-badges">
                              <For each={getThreatLevelEntries(subtype.threatLevel)}>{(entry) => (
                                <RankBadge rank={`${entry.level} (${entry.percent}%)`} label="" />
                              )}</For>
                            </div>
                          </div>
                        </Show>
                      </div>
                    </div>

                    <div class="variant-description">
                      <p>
                        <LinkedText text={subtype.description} />
                      </p>
                    </div>

                    <Show when={subtype.attributes}>
                      <div class="variant-stats">
                        <h4>Attributes</h4>
                        <div class="stats-grid">
                          <div class="stat-item">
                            <RankBadge rank={subtype.attributes.strength} label="Strength" />
                          </div>
                          <div class="stat-item">
                            <RankBadge rank={subtype.attributes.agility} label="Agility" />
                          </div>
                          <div class="stat-item">
                            <RankBadge rank={subtype.attributes.constitution} label="Constitution" />
                          </div>
                          <div class="stat-item">
                            <RankBadge rank={subtype.attributes.intelligence} label="Intelligence" />
                          </div>
                          <div class="stat-item">
                            <RankBadge rank={subtype.attributes.willpower} label="Willpower" />
                          </div>
                          <div class="stat-item">
                            <RankBadge rank={subtype.attributes.charisma} label="Charisma" />
                          </div>
                        </div>
                      </div>
                    </Show>

                    <Show when={subtype.skills && Object.keys(subtype.skills).length > 0}>
                      <div class="variant-skills">
                        <h4>Skills</h4>
                        <div class="skills-grid">
                          <For each={Object.entries(subtype.skills || {})}>{([skill, rank]) => (
                            <div class="skill-item">
                              <RankBadge rank={rank as string} label={slugToDisplayName(skill)} />
                            </div>
                          )}</For>
                        </div>
                      </div>
                    </Show>

                    <Show when={subtype.alignment && !alignmentsEqual(subtype.alignment, category()!.alignment)}>
                      <div class="variant-alignment">
                        <h4>Alignment</h4>
                        <AlignmentDisplay alignment={subtype.alignment} hideHeader={true} />
                      </div>
                    </Show>

                    <Show when={subtype.powers && Object.keys(subtype.powers).length > 0}>
                      <div class="variant-powers">
                        <h4>Powers & Abilities</h4>
                        <div class="powers-list">
                          <For each={Object.entries(subtype.powers || {})}>{([powerId, description]) => (
                            <div class="power-item">
                              <h5>{slugToDisplayName(powerId)}</h5>
                              <p>{description as string}</p>
                            </div>
                          )}</For>
                        </div>
                      </div>
                    </Show>

                    <Show when={subtype.tags && subtype.tags.length > 0}>
                      <div class="variant-tags">
                        <h4>Tags</h4>
                        <div class="tags-list">
                          <For each={subtype.tags}>{(tag) => (
                            <span class="tag">{slugToDisplayName(tag)}</span>
                          )}</For>
                        </div>
                      </div>
                    </Show>
                  </div>
                )}</For>
              </div>
            </div>

            <div class="entity-footer">
              <A href="/creatures" class="back-link">← Back to Creature Categories</A>
            </div>
          </div>
        </div>
      </Show>
    </Suspense>
  )
}

export default CreatureCategoryDetail
