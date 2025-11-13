import { useParams, A } from '@solidjs/router'
import { createMemo, createResource, Show, Suspense, For } from 'solid-js'
import { fetchCreaturesData, mergeCategoryAndCreatureData } from '@data/index'
import RankDisplay from '../../components/RankDisplay'
import AlignmentDisplay from '../../components/AlignmentDisplay'
import LinkedText from '../../components/LinkedText'

// Helper function to compare alignments for deep equality
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
    return Object.entries(cat.subtypes).map(([id, subtype]: [string, any]) => {
      // Merge category powers and tags with subtype powers and tags
      const mergedSubtype = mergeCategoryAndCreatureData(cat, subtype)
      return {
        id,
        ...mergedSubtype
      }
    }).sort((a, b) => a.name.localeCompare(b.name))
  })

  const subtypesThreatRange = createMemo(() => {
    const threats = subtypes().map(s => {
      const tl = s.threatLevel
      if (typeof tl === 'string') return tl
      if (typeof tl === 'object' && tl !== null) {
        // Handle percentage distribution - get the most common level
        const entries = Object.entries(tl)
          .map(([level, percent]) => ({ level, percent: Number(percent) }))
          .sort((a, b) => b.percent - a.percent)
        return entries.length > 0 ? entries[0].level : 'Unknown'
      }
      return 'Unknown'
    }).filter(threat => threat !== 'Unknown')

    if (threats.length === 0) return "Unknown"
    if (threats.length === 1) return threats[0]

    // Sort threat levels to find min/max
    const sortedThreats = threats.sort()
    return `${sortedThreats[0]} - ${sortedThreats[sortedThreats.length - 1]}`
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
                    <RankDisplay rank={subtypesThreatRange()} label="Threat Level Range" showLabel={true} />
                  </span>
                </div>
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
              <h2>Known Variants ({subtypes().length})</h2>
              <p>The following are specific examples and variants of {category()!.name.toLowerCase()}s encountered in Aetheria:</p>

              <div class="variants-list">
                <For each={subtypes()}>{(subtype) => (
                  <div class="variant-detail">
                    <div class="variant-header">
                      <h3>{subtype.name}</h3>
                      <div class="variant-meta">
                        <RankDisplay rank={subtype.threatLevel} label="Threat Level" />
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
                            <RankDisplay rank={subtype.attributes.strength} label="Strength" threatLevel={subtype.threatLevel} showThreatVariants={true} />
                          </div>
                          <div class="stat-item">
                            <RankDisplay rank={subtype.attributes.agility} label="Agility" threatLevel={subtype.threatLevel} showThreatVariants={true} />
                          </div>
                          <div class="stat-item">
                            <RankDisplay rank={subtype.attributes.constitution} label="Constitution" threatLevel={subtype.threatLevel} showThreatVariants={true} />
                          </div>
                          <div class="stat-item">
                            <RankDisplay rank={subtype.attributes.intelligence} label="Intelligence" threatLevel={subtype.threatLevel} showThreatVariants={true} />
                          </div>
                          <div class="stat-item">
                            <RankDisplay rank={subtype.attributes.willpower} label="Willpower" threatLevel={subtype.threatLevel} showThreatVariants={true} />
                          </div>
                          <div class="stat-item">
                            <RankDisplay rank={subtype.attributes.charisma} label="Charisma" threatLevel={subtype.threatLevel} showThreatVariants={true} />
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
                              <RankDisplay rank={rank} label={slugToDisplayName(skill)} />
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
