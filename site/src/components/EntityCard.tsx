import { A } from '@solidjs/router'
import { Show } from 'solid-js'
import RankBadge from './RankBadge'
import { resolveImageUrl } from '../data/index'

export interface EntityCardProps {
  /** Unique identifier for the entity (used for routing) */
  id: string
  /** Display name of the character/creature */
  name: string
  /** Optional image URL/path for the entity */
  imageUrl?: string
  /** Brief description (will be truncated if too long) */
  description: string
  /** Base route path (e.g., '/characters' or '/creatures') */
  basePath: string
  /** Optional subtitle/type (e.g., "Human Paladin", "Fire Dragon") */
  subtitle?: string
  /** Optional rank value (E, D, C, B, A, S, SS, SSS) */
  rank?: string
  /** Label for the rank (e.g., "Entity Rank", "Threat Level") */
  rankLabel?: string
  /** Optional additional CSS classes */
  class?: string
}

function EntityCard(props: EntityCardProps) {
  // Truncate description to a reasonable length for card display
  const truncatedDescription = () => {
    const maxLength = 120
    return props.description.length > maxLength
      ? props.description.substring(0, maxLength).trim() + '...'
      : props.description
  }

  return (
    <A
      href={`${props.basePath}/${props.id}`}
      class={`entity-card ${props.class || ''}`}
    >
      <div class="entity-card-content">
        <div class="entity-image">
          <img
            src={resolveImageUrl(props.imageUrl) || resolveImageUrl('/images/unknown-192.png') || '/images/unknown-192.png'}
            alt={props.name}
            loading="lazy"
          />
        </div>

        <div class="entity-info">
          <div class="entity-header">
            <h3 class="entity-name">{props.name}</h3>
            <Show when={props.subtitle}>
              <p class="entity-subtitle">{props.subtitle}</p>
            </Show>
            <Show when={props.rank}>
              <RankBadge rank={props.rank!} label={props.rankLabel} />
            </Show>
          </div>

          <p class="entity-description">{truncatedDescription()}</p>
        </div>
      </div>
    </A>
  )
}

export default EntityCard
