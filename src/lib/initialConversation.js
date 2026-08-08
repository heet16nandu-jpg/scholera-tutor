import seeded from '../data/conversation.json'
import blank from '../data/conversation-empty.json'

/**
 * Which conversation the app opens with.
 *
 * A URL param rather than a build-time constant, so both states can be reached
 * from one running build — useful for demoing and for testing the first-visit
 * screen without a rebuild. There is no returning-user detection behind this;
 * it is a switch, not a heuristic.
 *
 *   /            → the seeded conversation (unchanged default)
 *   /?empty      → the first-visit state
 *   /?conversation=empty
 *   /?conversation=seeded
 */
export function getInitialConversation(search = window.location.search) {
  // Matched case-insensitively: URLSearchParams is case-sensitive by default,
  // so a typed ?EMPTY would otherwise be silently ignored.
  for (const [key, value] of new URLSearchParams(search)) {
    const name = key.trim().toLowerCase()
    if (name === 'empty') return blank
    if (name === 'conversation') {
      return value.trim().toLowerCase() === 'empty' ? blank : seeded
    }
  }

  return seeded
}
