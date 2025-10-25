export interface AlignmentData {
  ideology: {
    value: string
    modifier?: string
    guidance?: string
  }
  morality: {
    value: string
    modifier?: string
    guidance?: string
  }
  methodology: {
    value: string
    modifier?: string
    guidance?: string
  }
  temperament: {
    value: string
    guidance?: string
  }
}

import { Show } from 'solid-js'

export interface AlignmentDisplayProps {
  alignment: AlignmentData
  class?: string
}

function AlignmentDisplay(props: AlignmentDisplayProps) {
  const formatAlignmentValue = (aspect: { value: string; modifier?: string }) => {
    if (aspect.modifier) {
      return `${aspect.value} (${aspect.modifier})`
    }
    return aspect.value
  }

  return (
    <div class={`entity-alignment ${props.class || ''}`}>
      <h2>Alignment</h2>
      <div class="alignment-grid">
        <div class="alignment-item">
          <div class="alignment-header">
            <span class="alignment-aspect">Ideology:</span>
            <span class="alignment-value">{formatAlignmentValue(props.alignment.ideology)}</span>
          </div>
          <Show when={props.alignment.ideology.guidance}>
            <div class="alignment-guidance">{props.alignment.ideology.guidance}</div>
          </Show>
        </div>
        <div class="alignment-item">
          <div class="alignment-header">
            <span class="alignment-aspect">Morality:</span>
            <span class="alignment-value">{formatAlignmentValue(props.alignment.morality)}</span>
          </div>
          <Show when={props.alignment.morality.guidance}>
            <div class="alignment-guidance">{props.alignment.morality.guidance}</div>
          </Show>
        </div>
        <div class="alignment-item">
          <div class="alignment-header">
            <span class="alignment-aspect">Methodology:</span>
            <span class="alignment-value">{formatAlignmentValue(props.alignment.methodology)}</span>
          </div>
          <Show when={props.alignment.methodology.guidance}>
            <div class="alignment-guidance">{props.alignment.methodology.guidance}</div>
          </Show>
        </div>
        <div class="alignment-item">
          <div class="alignment-header">
            <span class="alignment-aspect">Temperament:</span>
            <span class="alignment-value">{props.alignment.temperament.value}</span>
          </div>
          <Show when={props.alignment.temperament.guidance}>
            <div class="alignment-guidance">{props.alignment.temperament.guidance}</div>
          </Show>
        </div>
      </div>
    </div>
  )
}

export default AlignmentDisplay
