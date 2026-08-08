import { listScenarios } from '../data/mock-stream.mjs'

// There is no model here, so "matching" is word overlap against each scenario's
// prompt. It is a stand-in for retrieval, not an attempt at understanding — the
// suggestion chips remain the reliable way to reach a specific scenario.
const IGNORED = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be',
  'what', 'why', 'how', 'when', 'who', 'which', 'that', 'this', 'these',
  'do', 'does', 'did', 'can', 'you', 'me', 'my', 'i', 'we', 'us', 'it',
  'to', 'of', 'in', 'on', 'for', 'from', 'with', 'about', 'so', 'all',
  'show', 'tell', 'explain', 'give', 'get', 'whole', 'everything', 'again',
])

// Crude singularisation, so "gradients" reaches the "gradient descent" prompt.
// Not a stemmer; just enough that plurals do not silently miss.
const singular = (word) =>
  word.length > 4 && word.endsWith('s') && !word.endsWith('ss')
    ? word.slice(0, -1)
    : word

const keywords = (text) =>
  (text.toLowerCase().match(/[a-z0-9]+/g) ?? [])
    .filter((word) => word.length > 2 && !IGNORED.has(word))
    .map(singular)

/** Best-guess scenario id for a free-text question. */
export function pickScenario(question) {
  const asked = new Set(keywords(question))

  let best = null
  let bestScore = 0
  for (const scenario of listScenarios()) {
    const score = keywords(scenario.prompt).filter((word) =>
      asked.has(word),
    ).length
    if (score > bestScore) {
      bestScore = score
      best = scenario.id
    }
  }

  // Nothing in the course materials looked relevant. The tutor saying so is a
  // more honest fallback than picking an unrelated answer at random.
  return best ?? 'refusal'
}
