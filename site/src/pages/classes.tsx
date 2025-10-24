import { For, createResource, Suspense } from 'solid-js'
import { fetchClassesData } from '@data/index'

function Classes() {
  const [classesData] = createResource(fetchClassesData)

  const primaryClasses = () => {
    const data = classesData()
    if (!data) return []
    return Object.entries(data.classes.primary).map((e) => e[1])
  }

  const specClasses = () => {
    const data = classesData()
    if (!data) return []
    return Object.entries(data.classes.specialized).map((e) => e[1])
  }

  return (
    <div class="classes-page">
      <h1>Character Classes</h1>
      <p>The fundamental class archetypes that form the basis of character development</p>

      <Suspense fallback={<div>Loading classes data...</div>}>
        <h2>Primary Classes</h2>
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
              <For each={primaryClasses()}>
                {(pclass) => (
                  <tr>
                    <td>{pclass.name}</td>
                    <td>{pclass.description}</td>
                    <td>{pclass.alternative_names.join(', ')}</td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>

        <h2>Specialized Classes</h2>
        <div class="classes-table-container">
          <table class="classes-table">
            <thead>
              <tr>
                <th>Class</th>
                <th>Base Class</th>
                <th>Description</th>
                <th>Alternate Names</th>
              </tr>
            </thead>
            <tbody>
              <For each={specClasses()}>
                {(pclass) => (
                  <tr>
                    <td>{pclass.name}</td>
                    <td>{pclass.base_class}</td>
                    <td>{pclass.description}</td>
                    <td>{pclass.alternative_names.join(', ')}</td>
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
