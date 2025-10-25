import { A } from '@solidjs/router'
import { For, createMemo } from 'solid-js'

export interface LinkedTextProps {
  /** Text content that may contain markdown-style links [text](/path) */
  text: string
  /** Additional CSS classes */
  class?: string
}

interface TextSegment {
  type: 'text' | 'link'
  content: string
  href?: string
}

function LinkedText(props: LinkedTextProps) {
  // Parse text and extract links using regex
  const segments = createMemo(() => {
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    const segments: TextSegment[] = []
    let lastIndex = 0
    let match

    while ((match = linkRegex.exec(props.text)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        segments.push({
          type: 'text',
          content: props.text.slice(lastIndex, match.index)
        })
      }

      // Add the link
      segments.push({
        type: 'link',
        content: match[1], // Link text
        href: match[2]     // Link URL
      })

      lastIndex = linkRegex.lastIndex
    }

    // Add remaining text after last link
    if (lastIndex < props.text.length) {
      segments.push({
        type: 'text',
        content: props.text.slice(lastIndex)
      })
    }

    return segments
  })

  return (
    <span class={props.class}>
      <For each={segments()}>
        {(segment) =>
          segment.type === 'link' ? (
            <A href={segment.href!} class="inline-link">{segment.content}</A>
          ) : (
            segment.content
          )
        }
      </For>
    </span>
  )
}

export default LinkedText
