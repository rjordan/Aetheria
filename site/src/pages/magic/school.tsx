import { useParams, A } from '@solidjs/router'
import { createMemo } from 'solid-js'
import { magicSchoolsData } from '@data/index'

function MagicSchool() {
  const params = useParams()
  const school = createMemo(() => (magicSchoolsData.magic_schools as any)[params.school])

  if (!school()) {
    return <div class="magic-school-page error">Magic school not found</div>
  }

  return (
    <div class="magic-school-page">
      <div class="school-header">
        <h1>School of {school().name} Magic</h1>
        <div class="school-meta">
          <span class="meta-item"><strong>Focus:</strong> {school().focus.join(', ')}</span>
          {school().opposing_element && (
            <>
              <span class="meta-separator">•</span>
              <span class="meta-item"><strong>Opposing Element:</strong> <A href={`/magic/${school().opposing_element.toLowerCase()}`}>{school().opposing_element}</A></span>
            </>
          )}
        </div>
      </div>

      <div class="school-details">
        {school().regulation && (
          <p class={`detail-item ${school().regulation !== 'Unregulated' ? 'regulated' : ''}`}><strong>Regulation Status:</strong> {school().regulation}</p>
        )}
      </div>

      <p class="school-description">{school().description}</p>

      <h2>Spells</h2>

      <div class="spell-list">
        {/* List of spells here */}
      </div>
    </div>
  )
}

export default MagicSchool
