import { Show, For, createMemo } from 'solid-js'
import { RankValue, interpolateAttributeByThreat } from '@data/index'

interface RankDisplayProps {
  rank: RankValue
  label: string
  showLabel?: boolean
  // New props for threat-based interpolation
  threatLevel?: RankValue
  showThreatVariants?: boolean
}

// Helper function to determine if rank is a percentage distribution
const isPercentageDistribution = (rank: RankValue): rank is Record<string, number> => {
  return typeof rank === 'object' && rank !== null && !Array.isArray(rank)
}

// Helper function to format percentage distribution entries
const getPercentageEntries = (rank: Record<string, number>) => {
  return Object.entries(rank)
    .map(([level, percent]) => ({
      level,
      percent: typeof percent === 'number' ? percent : parseFloat(String(percent).replace('%', ''))
    }))
    .sort((a, b) => b.percent - a.percent) // Sort by percentage descending
}

// Helper function to format single rank (string or range)
const formatSingleRank = (rank: string) => {
  return rank // Could add additional formatting logic here if needed
}

// Helper function to get rank color class
const getRankColorClass = (rank: string): string => {
  // Extract the primary rank for color coding (first rank in range, or single rank)
  const primaryRank = rank.split('-')[0].toLowerCase().trim()
  return `rank-${primaryRank}`
}

function RankDisplay(props: RankDisplayProps) {
  const showLabel = props.showLabel ?? true

  // Calculate threat-based variants if threat level is provided
  const threatVariants = createMemo(() => {
    if (!props.threatLevel || !props.showThreatVariants) return null

    return {
      low: interpolateAttributeByThreat(props.threatLevel, props.rank, 0.0),
      mid: interpolateAttributeByThreat(props.threatLevel, props.rank, 0.5),
      high: interpolateAttributeByThreat(props.threatLevel, props.rank, 1.0)
    }
  })

  // Check if we should show threat variants (only for ranges with threat context)
  const shouldShowVariants = () => {
    const variants = threatVariants()
    if (!variants) return false

    // Only show if there's actual variation
    return variants.low !== variants.mid || variants.mid !== variants.high
  }

  return (
    <Show
      when={isPercentageDistribution(props.rank)}
      fallback={
        <Show
          when={shouldShowVariants()}
          fallback={
            // Standard single value or range display
            <div class="rank-badge">
              <Show when={showLabel && props.label}>
                <span class="rank-label">{props.label}:</span>
              </Show>
              <span class={`rank-value ${getRankColorClass(props.rank as string)}`}>{formatSingleRank(props.rank as string)}</span>
            </div>
          }
        >
          {/* Threat-interpolated variants display */}
          <div class="rank-threat-variants">
            <Show when={showLabel && props.label}>
              <span class="rank-label">{props.label}:</span>
            </Show>
            <div class="rank-variant-badges">
              <span class="rank-badge variant">
                <span class={`rank-value ${getRankColorClass(threatVariants()!.low)}`}>{threatVariants()!.low}</span>
                <span class="rank-variant-label">weak</span>
              </span>
              <span class="rank-separator">→</span>
              <span class="rank-badge variant">
                <span class={`rank-value ${getRankColorClass(threatVariants()!.mid)}`}>{threatVariants()!.mid}</span>
                <span class="rank-variant-label">typical</span>
              </span>
              <span class="rank-separator">→</span>
              <span class="rank-badge variant">
                <span class={`rank-value ${getRankColorClass(threatVariants()!.high)}`}>{threatVariants()!.high}</span>
                <span class="rank-variant-label">strong</span>
              </span>
            </div>
          </div>
        </Show>
      }
    >
      {/* Percentage distribution display */}
      <div class="rank-distribution">
        <Show when={showLabel && props.label}>
          <span class="rank-label">{props.label}:</span>
        </Show>
        <div class="rank-distribution-badges">
          <For each={getPercentageEntries(props.rank as Record<string, number>)}>
            {(entry) => (
              <span class="rank-badge percentage">
                <span class={`rank-value ${getRankColorClass(entry.level)}`}>{entry.level}</span>
                <span class="rank-percentage">({entry.percent}%)</span>
              </span>
            )}
          </For>
        </div>
      </div>
    </Show>
  )
}

export default RankDisplay
