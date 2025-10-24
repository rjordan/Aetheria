import { For, createResource, Suspense } from 'solid-js'
import { fetchClassesData } from '@data/index'

function Classes() {
  const [classesData] = createResource(fetchClassesData)

  const coreClasses = () => {
    const data = classesData()
    if (!data) return []
    return Object.entries(data.classes.core)
      .map((e) => e[1])
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  const specializationClasses = () => {
    const data = classesData()
    if (!data) return []
    return Object.entries(data.classes.specializations)
      .map((e) => e[1])
      .sort((a, b) => a.name.localeCompare(b.name))
  }

  return (
    <div class="classes-page">
      <h1>Character Classes</h1>
      <p>The fundamental class archetypes that form the basis of character development</p>
      <p>The specialized classes listed represent major, well-established combinations of base classes with magic specializations. Other combinations (such as Rogue/Water, Warrior/Mind, etc.) are possible but represent less common or experimental approaches to character development.</p>
      <p><strong>Note:</strong> Specializations are descriptive names for common skill combinations within the core classes. A character's actual class remains their core class (Mage, Warrior, Rogue, etc.), while specializations simply identify recognized patterns of abilities and focus areas.</p>

      <Suspense fallback={<div>Loading classes data...</div>}>
        <h2>Core Classes</h2>
        <div class="classes-table-container">
          <table class="classes-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Description</th>
                <th>Alternate Names</th>
              </tr>
            </thead>
            <tbody>
              <For each={coreClasses()}>
                {(pclass) => (
                  <tr>
                    <td>{pclass.name}</td>
                    <td>{pclass.description}</td>
                    <td>{pclass.alternativeNames.join(', ')}</td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>

        <h2>Common Specializations</h2>
        <div class="classes-table-container">
          <table class="classes-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Base Class</th>
                <th>Required Specializations</th>
                <th>Description</th>
                <th>Alternate Names</th>
              </tr>
            </thead>
            <tbody>
              <For each={specializationClasses()}>
                {(pclass) => (
                  <tr>
                    <td>{pclass.name}</td>
                    <td>{pclass.baseClass}</td>
                    <td>{pclass.requiredSpecializations ? pclass.requiredSpecializations.join(', ') : 'None'}</td>
                    <td>{pclass.description}</td>
                    <td>{pclass.alternativeNames.join(', ')}</td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      </Suspense>
    </div>
  )
}

export default Classes
