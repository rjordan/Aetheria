import { createSignal, onMount, onCleanup, For, JSX } from "solid-js"

export interface TableColumn {
  key: string
  label: string
  priority: 'high' | 'medium' | 'low'
  render?: (value: any, row: any) => JSX.Element | string
}

export interface ResponsiveTableProps {
  columns: TableColumn[]
  data: any[]
  className?: string
}

function ResponsiveTable(props: ResponsiveTableProps) {
  const [viewMode, setViewMode] = createSignal<'table' | 'cards'>('table')
  const [visibleColumns, setVisibleColumns] = createSignal<TableColumn[]>([])

  let containerRef: HTMLDivElement | undefined

  const updateLayout = () => {
    if (!containerRef) return

    const containerWidth = containerRef.offsetWidth

    // Determine view mode based on width
    if (containerWidth < 600) {
      setViewMode('cards')
      // In card mode, show all columns but with different priorities
      setVisibleColumns(props.columns)
    } else {
      setViewMode('table')

      // Determine visible columns based on available width
      let availableColumns = [...props.columns]

      if (containerWidth < 768) {
        // Hide low priority columns on medium screens
        availableColumns = props.columns.filter(col => col.priority !== 'low')
      }

      if (containerWidth < 900) {
        // Hide medium priority columns on smaller screens
        availableColumns = availableColumns.filter(col => col.priority === 'high')
      }

      setVisibleColumns(availableColumns)
    }
  }

  onMount(() => {
    updateLayout()

    const resizeObserver = new ResizeObserver(() => {
      updateLayout()
    })

    if (containerRef) {
      resizeObserver.observe(containerRef)
    }

    onCleanup(() => {
      resizeObserver.disconnect()
    })
  })

  const renderCellValue = (column: TableColumn, row: any) => {
    const value = row[column.key]
    if (column.render) {
      return column.render(value, row)
    }

    // Handle arrays (like types, alternateNames)
    if (Array.isArray(value)) {
      return value.join(', ')
    }

    // Handle objects (like protection in armor)
    if (typeof value === 'object' && value !== null) {
      return Object.entries(value).map(([key, val]) => (
        <div class="object-entry">
          {key}: {String(val)}
        </div>
      ))
    }

    return String(value || '')
  }

  return (
    <div
      ref={containerRef}
      class={`responsive-table-container ${props.className || ''}`}
    >
      {viewMode() === 'table' ? (
        <div class="table-wrapper">
          <table class="responsive-table">
            <thead>
              <tr>
                <For each={visibleColumns()}>
                  {(column) => (
                    <th class={`priority-${column.priority}`}>
                      {column.label}
                    </th>
                  )}
                </For>
              </tr>
            </thead>
            <tbody>
              <For each={props.data}>
                {(row) => (
                  <tr>
                    <For each={visibleColumns()}>
                      {(column) => (
                        <td class={`priority-${column.priority}`}>
                          {renderCellValue(column, row)}
                        </td>
                      )}
                    </For>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        </div>
      ) : (
        <div class="card-layout">
          <For each={props.data}>
            {(row) => (
              <div class="data-card">
                <For each={props.columns}>
                  {(column) => {
                    const value = renderCellValue(column, row)
                    // Skip empty values in card mode
                    if (!value || (typeof value === 'string' && value.trim() === '')) {
                      return null
                    }

                    return (
                      <div class={`card-field priority-${column.priority}`}>
                        <div class="field-label">{column.label}:</div>
                        <div class="field-value">{value}</div>
                      </div>
                    )
                  }}
                </For>
              </div>
            )}
          </For>
        </div>
      )}
    </div>
  )
}

export default ResponsiveTable
