import { createResource, createMemo, For, Show } from "solid-js"
import { A, useLocation } from "@solidjs/router"
import { fetchRegionsData, type RegionData } from "@/data"

export function Region() {
  const location = useLocation()
  const [regionData] = createResource(fetchRegionsData)

  // Parse the path to support nested regions
  const regionPath = createMemo(() => {
    // Remove '/region/' prefix and split by '/'
    const path = location.pathname.replace('/region/', '')
    return path.split('/').filter(Boolean)
  })

  // Navigate through nested regions based on path
  const region = createMemo(() => {
    const data = regionData()
    if (!data) return null

    const path = regionPath()
    if (path.length === 0) return null

    // Start at the top level
    let current: RegionData | undefined = data.regions[path[0]]

    // Navigate through nested regions for deeper paths
    if (path.length > 1 && current?.regions) {
      for (let i = 1; i < path.length; i++) {
        const segment = path[i]
        if (current?.regions?.[segment]) {
          current = current.regions[segment]
        } else {
          return null // Region not found
        }
      }
    }

    return current || null
  })

  // Generate breadcrumb trail
  const breadcrumbs = createMemo(() => {
    const data = regionData()
    if (!data) return []

    const path = regionPath()
    const crumbs = []
    let currentPath = ''

    // Start with top-level region
    if (path.length > 0 && data.regions[path[0]]) {
      currentPath = path[0]
      crumbs.push({
        name: data.regions[path[0]].name,
        path: currentPath,
        isLast: path.length === 1
      })

      // Add nested regions
      let current = data.regions[path[0]]
      for (let i = 1; i < path.length; i++) {
        const segment = path[i]
        if (current?.regions?.[segment]) {
          currentPath = `${currentPath}/${segment}`
          current = current.regions[segment]
          crumbs.push({
            name: current.name,
            path: currentPath,
            isLast: i === path.length - 1
          })
        } else {
          break
        }
      }
    }

    return crumbs
  })

  // Get notable locations (sub-regions) for the current region
  const notableLocations = createMemo(() => {
    const currentRegion = region()
    if (!currentRegion?.regions) return []

    const currentPath = regionPath().join('/')
    return Object.entries(currentRegion.regions).map(([key, subRegion]) => ({
      key,
      name: subRegion.name,
      description: subRegion.description,
      path: `${currentPath}/${key}`
    }))
  })

  const raceEntries = createMemo(() => {
    const reg = region()
    if (!reg?.races) return []
    return Object.entries(reg.races)
  })

  return (
    <Show when={region()} fallback={<div>Region not found</div>}>
      {/* Breadcrumb Navigation */}
      <Show when={breadcrumbs().length > 1}>
        <nav class="breadcrumb-nav">
          <For each={breadcrumbs()}>
            {(crumb) => (
              <>
                <Show when={!crumb.isLast}>
                  <A href={`/region/${crumb.path}`} class="breadcrumb-link">
                    {crumb.name}
                  </A>
                  <span class="breadcrumb-separator"> → </span>
                </Show>
                <Show when={crumb.isLast}>
                  <span class="breadcrumb-current">{crumb.name}</span>
                </Show>
              </>
            )}
          </For>
        </nav>
      </Show>

      <h1>{region()?.name}</h1>
      <p>{region()?.description}</p>

      <h2>Details</h2>

      <section class="region-details">
        <div class="detail-row">
          <span class="detail-label">Leader:</span>
          <span class="detail-value">{region()?.leader || "Unknown"}</span>
        </div>

        <div class="detail-row">
          <span class="detail-label">Climate:</span>
          <span class="detail-value">{region()?.climate || "Varied"}</span>
        </div>

        <div class="detail-row">
          <span class="detail-label">Political System:</span>
          <span class="detail-value">{region()?.system || "Unknown"}</span>
        </div>

        <Show when={region()?.population}>
          <div class="detail-row">
            <span class="detail-label">Population:</span>
            <div class="detail-value">
              <span>{region()?.population}</span>
              <Show when={raceEntries().length > 0}>
                <div class="detail-subvalue">
                  <h4>Racial Distribution</h4>
                  <div class="race-distribution">
                    <For each={raceEntries().sort(([,a], [,b]) => b - a)}>
                      {([raceName, percentage]) => (
                        <div class="race-entry">
                          <div class="race-labels">
                            <span class="race-name">{raceName}</span>
                            <span class="race-percentage">{percentage}%</span>
                          </div>
                          <div class="race-bar-container">
                            <div
                              class="race-bar"
                              style={{
                                background: `hsl(${(percentage * 3.6) % 360}, 70%, 60%)`,
                                width: `${percentage}%`
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </For>
                  </div>
                </div>
              </Show>
            </div>
          </div>
        </Show>

        <Show when={notableLocations().length > 0}>
          <div class="detail-row">
            <span class="detail-label">Notable Locations:</span>
            <div class="detail-value">
              <ul>
                <For each={notableLocations()}>
                  {(location) => (
                    <dl>
                      <dt>
                        <A href={`/region/${location.path}`} class="inline-link">
                          {location.name}
                        </A>
                      </dt>
                      <dd>{location.description}</dd>
                    </dl>
                  )}
                </For>
              </ul>
            </div>
          </div>
        </Show>
      </section>
    </Show>
  )
}

export default Region
