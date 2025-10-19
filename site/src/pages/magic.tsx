import { For, createResource, Show } from 'solid-js'
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
        Aetheria is a land steeped in magical energies, where the arcane arts are practiced by many. Magic is categorized into various schools, each with its own focus and methods. Mages, sorcerers, clerics, and other magic users often specialize in one or more schools of magic, honing their skills to manipulate the forces of the world around them. Many people will be skilled in general magic. Mages generally learn basic spells from multiple schools, but tend to specialize in one or two and may be unable to use spells from schools opposed to their specialtys. Those specialized in more than two schools are rare and often viewed with suspicion or awe.
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

      <h2>Magic Schools</h2>

      <Show
        when={magicData()}
        fallback={
          <div class="loading-state">
            {isOfflineError() ? (
              <div class="offline-error">
                <h3>📱 Offline Mode</h3>
                <p>Magic data is not available offline. Please check your connection.</p>
              </div>
            ) : (
              <div>Loading magic data...</div>
            )}
          </div>
        }
      >
        <div class="schools-table-container">
          <table class="schools-table">
            <thead>
              <tr>
                <th>School</th>
                <th>Description</th>
                <th>Focus Areas</th>
                <th>Regulation</th>
                <th>Opposing Element</th>
              </tr>
            </thead>
            <tbody>
              <For each={schools().sort((a: any, b: any) => a.name.localeCompare(b.name))}>
                {(school) => (
                  <tr>
                    <td class="school-name-cell">
                      <A href={`/magic/${school.key}`} class="school-link">
                        {school.name}
                      </A>
                    </td>
                    <td>{school.description}</td>
                    <td>
                      {Array.isArray(school.focus) ? school.focus.join(', ') : school.focus || 'N/A'}
                    </td>
                    <td>{school.regulation || 'Unknown'}</td>
                    <td>{school.opposing_element || 'None'}</td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </Show>
    </div>
  )
}

export default MagicSchools
