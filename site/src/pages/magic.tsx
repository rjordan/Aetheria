import { For, createResource, Suspense, Show } from 'solid-js'
import { A } from '@solidjs/router'
import { fetchMagicData, OfflineError } from '@data/index'

function MagicSchools() {
  const [magicData] = createResource(fetchMagicData)

  // Check for offline errors
  const isOfflineError = () => magicData.error instanceof OfflineError

  const schools = () => {
    const data = magicData()
    if (!data) return []
    return Object.entries(data.magic.schools).map(([key, school]: [string, any]) => ({
      key,
      ...school,
    }))
  }

  return (
    <div class="magic-schools-page">
      <h1>Magic in Aetheria</h1>
      <p>
        Aetheria is a land steeped in magical energies, where the arcane arts are practiced by many. Magic is categorized into various schools, each with its own focus and methods.
      </p>
      <p>
        About 60% of the population has some degree of magical ability, though most only achieve general magic (cantrips and basic utility spells). Of this magical population, roughly 25% are born with access to specific schools of magic, allowing them to cast basic spells from those schools while pursuing any core class: magical artisans, spirit-touched politicians, enchanted warriors, or nature-attuned laborers.
      </p>
      <p>
        However, only a rare few (roughly 20% of those with school access, or 2-3% of the total population) are born with true specialization - the ability to master advanced magic within their schools. These individuals are typically recruited by magical academies and strongly encouraged to pursue the "Mage" core class, as their rare gifts are considered too valuable to waste in other pursuits. While some resist this pressure and choose other paths, most become the scholarly mages, court wizards, and magical researchers that define the Mage profession.
      </p>
      <p>
        Magical affinities and potential are determined at birth - one cannot learn new schools or develop specialization through study alone. Among true specialists: 70% focus on a single school with access to 1-3 others, 20% specialize in two schools with access to 2-4 others, and only 10% master three schools with access to 2-5 others. More than three specializations is nearly unheard of and typically requires divine intervention, unique circumstances, or extraordinary natural gifts. Those with multiple specializations are rare and often viewed with suspicion or awe. Regardless of their level, nearly all magical practitioners have access to Aether magic at least casually, as it's considered foundational and typically the first secondary school learned.
      </p>

      <h2>Terms</h2>
      <div class="magic-terms">
        <dl>
          <dt>Ritual</dt>
          <dd>A complex spell that requires extended time, specific components, and often multiple participants to perform. Rituals can produce powerful effects but are not suitable for quick casting.</dd>
          <dt>Elemental Magic</dt>
          <dd>Magic that draws upon the fundamental forces of nature, such as fire, water, air, earth, and aether. Light and dark magic are also considered elemental in this context.</dd>
          <dt>Sacrifice</dt>
          <dd>Many powerful spells require a sacrifice, which can range from material components to life energy. The nature of the sacrifice often influences the spell's potency and effects. These sacrifices are consumed in the casting of the spell and cannot be recovered regardless of the spell's success or failure.</dd>
          <dt>Focus</dt>
          <dd>A physical object or symbol that helps a caster channel their magical energies. Foci can range from simple wands or staffs to elaborate artifacts imbued with magical power.</dd>
          <dt>Regulation</dt>
          <dd>Certain schools of magic are regulated or restricted by governing bodies due to their potential for harm or misuse. Mages practicing these schools must register with the appropriate authorities and may face legal consequences for unauthorized use. Severe penalties, including imprisonment or execution, may be imposed for the misuse of highly regulated magic.</dd>
          <dt>Illegal Magic</dt>
          <dd>Some forms of magic are outright banned in many regions due to their dangerous nature or ethical implications. Practicing illegal magic generally leads to severe punishment, including exile, imprisonment, or death.</dd>
        </dl>
      </div>

      <h2>General Magic</h2>
      <p>General spells are a catch-all term for those that can be learned by most magic users even those who lack the power to become true mages. These spells form the foundation of magical knowledge and are often taught to novice mages. People with low magical ability who can only use cantrips are often referred to as hedge magicians.</p>
      <p>The only spell in this category is cantrip which is a minor magical effect that can be performed by almost anyone with a small amount of magical ability. Examples include creating a small light, conjuring/summoning small objects of low value, cleaning, or producing a simple sound. These effects are generally limited in scope and power. It is primarily used for utility, minor convenience, or dramatic effect, but has little to no combat application.</p>


      <h2>Magic Schools</h2>
      <p>Opposition elements: Magic is treated as one rank higher when targeting its opposing element. These effects also apply to creatures and effects. e.g.: A caster in a forest fire dealing B rank damage, a B rank elemental shield would be required to prevent damage, but a C rank water shield would also be effective, or undead would take one rank higher damage from light magic.</p>

      <Suspense
        fallback={
          <div class="loading-state">
            <Show when={isOfflineError()} fallback={<div>Loading magic data...</div>}>
              <div class="offline-error">
                <h3>📱 Offline Mode</h3>
                <p>Magic data is not available offline. Please check your connection.</p>
              </div>
            </Show>
          </div>
        }
      >
        <Show when={!isOfflineError()} fallback={
          <div class="offline-error">
            <h3>📱 Offline Mode</h3>
            <p>Magic data is not available offline. Please check your connection.</p>
            <p>You can still browse the static content above, but the interactive magic schools table requires an internet connection.</p>
          </div>
        }>
          <div class="table-container table-responsive table-auto-cards">
            <table class="schools-table">
              <thead>
                <tr>
                  <th>School</th>
                  <th>Description</th>
                  <th class="low-priority">Focus Areas</th>
                  <th>Regulation</th>
                  <th class="low-priority">Opposing Element</th>
                </tr>
              </thead>
              <tbody>
                <For each={schools().sort((a: any, b: any) => a.name.localeCompare(b.name))}>
                  {(school) => (
                    <tr>
                      <td data-label="School" class="school-name-cell">
                        <A href={`/magic/${school.key}`} class="school-link">
                          {school.name}
                        </A>
                      </td>
                      <td data-label="Description">{school.description}</td>
                      <td data-label="Focus Areas" class="low-priority">
                        {Array.isArray(school.focus) ? school.focus.join(', ') : school.focus || 'N/A'}
                      </td>
                      <td data-label="Regulation">{school.regulation || 'Unknown'}</td>
                      <td data-label="Opposing Element" class="low-priority">{school.opposing_element || 'None'}</td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
        </Show>
      </Suspense>
    </div>
  )
}

export default MagicSchools
