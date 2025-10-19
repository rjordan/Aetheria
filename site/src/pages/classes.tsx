import { For } from 'solid-js'
import { classesData } from '@/data'

function Classes() {
  const primaryClasses = Object.entries(classesData.classes.primary).map((e) => e[1])
  const specClasses = Object.entries(classesData.classes.specialized).map((e) => e[1])

  return (
    <div class="classes-page">
      <h1>Character Classes</h1>
      <p>The fundamental class archetypes that form the basis of character development</p>

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
            <For each={primaryClasses}>
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
              <th>Description</th>
              <th>Alternate Names</th>
            </tr>
          </thead>
          <tbody>
            <For each={specClasses}>
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

    </div>
  )
}

export default Classes
