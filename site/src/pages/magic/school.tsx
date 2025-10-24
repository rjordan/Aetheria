import { useParams, A } from '@solidjs/router'
import { createMemo, createResource, For, Show, Suspense } from 'solid-js'
import { fetchMagicData, MagicSchoolData } from '@data/index'

function MagicSchool() {
  const params = useParams()
  const [magicData] = createResource(fetchMagicData)

  const school = createMemo(() => {
    const data = magicData()
    if (!data) return null
    return (data.magic.schools as Record<string, MagicSchoolData>)[params.school]
  })

  const spells = createMemo(()=> {
    const data = magicData()
    if (!data) return []
    const schoolSpells = data.magic.spells[params.school.toLowerCase()]
    if (!schoolSpells) return []

    // Define rank order for sorting
    const rankOrder = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS']

    return Object.entries(schoolSpells)
      .map(([key, spell]) => ({
        key,
        ...spell
      }))
      .sort((a, b) => {
        // First sort by rank
        const rankA = rankOrder.indexOf(a.min_rank)
        const rankB = rankOrder.indexOf(b.min_rank)
        if (rankA !== rankB) {
          return rankA - rankB
        }
        // Then sort by name alphabetically
        return a.name.localeCompare(b.name)
      })
  })

  return (
    <Suspense fallback={<div class="magic-school-page">Loading magic data...</div>}>
      <Show
        when={school()}
        fallback={<div class="magic-school-page error">Magic school not found</div>}
      >
        <div class="magic-school-page">
          <div class="school-header">
            <h1>School of {school()!.name} Magic</h1>
            <div class="school-meta">
              <span class="meta-item"><strong>Focus:</strong> {school()!.focus.join(', ')}</span>
              {school()!.opposing_element && (
                <>
                  <span class="meta-separator">•</span>
                  <span class="meta-item"><strong>Opposing Element:</strong> <A href={`/magic/${school()!.opposing_element.toLowerCase()}`}>{school()!.opposing_element}</A></span>
                </>
              )}
            </div>
          </div>

          <div class="school-details">
            {school()!.regulation && (
              <p class={`detail-item ${school()!.regulation !== 'Unregulated' ? 'regulated' : ''}`}><strong>Regulation Status:</strong> {school()!.regulation}</p>
            )}
          </div>

          <p class="school-description">{school()!.description}</p>

          <div class="specialist-explanation">
            <h3>Specialist vs. General Access</h3>
            <p>
              While anyone with access to this school can cast basic spells, some advanced magic requires <strong>specialist training</strong>.
              These spells are marked as "Specialist Only" and represent world-breaking magic that could disrupt society, economy, or
              fundamental systems if widely available. Only true magical specialists (~2-3% of the population) have the knowledge
              and ethical training to safely use such magic.
            </p>
          </div>

          <h2>Spells</h2>

          <For each={spells()}>{(spell) => (
            <div class="spell-item">
              <div class="spell-header">
                <h3 class="spell-name">{spell.name}</h3>
                <div class="spell-badges">
                  <Show when={spell.specialistOnly}>
                    <span class="specialist-badge">Specialist Only</span>
                  </Show>
                  <span class="spell-rank">Rank {spell.min_rank}</span>
                </div>
              </div>
              <p class="spell-description">{spell.description}</p>
            </div>
          )}</For>
        </div>
      </Show>
    </Suspense>
  )
}

export default MagicSchool
