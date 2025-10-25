import { Show } from 'solid-js'

export interface RankBadgeProps {
  /** The rank value (E, D, C, B, A, S, SS, SSS) */
  rank: string
  /** Optional label to display before the rank */
  label?: string
  /** Additional CSS classes */
  class?: string
}

function RankBadge(props: RankBadgeProps) {
  // Generate CSS class for rank badge based on rank value
  const rankClass = () => {
    return `rank-${props.rank.toLowerCase()}`
  }

  return (
    <div class={`rank-badge ${props.class || ''}`}>
      <Show when={props.label}>
        <span class="rank-label">{props.label}:</span>
      </Show>
      <span class={`rank-value ${rankClass()}`}>{props.rank}</span>
    </div>
  )
}

export default RankBadge
