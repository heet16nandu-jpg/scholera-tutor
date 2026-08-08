/**
 * Resolves a citation to the slide it points at.
 *
 * A citation carries a display label and a slide number:
 *   { lecture: "Week 2 — Gradient Descent and Backpropagation", slide: 9 }
 *
 * The lecture files have no such field — they carry `week` and `title`
 * separately — so the label is recomposed from those two and used as the key.
 * The separator is an em dash (U+2014), written as an escape here so the match
 * cannot be broken by a file-encoding change.
 */
const DASH = '—'

export const citationKey = (week, title) => `Week ${week} ${DASH} ${title}`

// Globbed rather than imported one by one, so a fourth lecture file needs no
// change here.
const modules = import.meta.glob('../data/lectures/*.json', { eager: true })

const byLabel = new Map()
for (const module of Object.values(modules)) {
  const lecture = module.default ?? module
  byLabel.set(citationKey(lecture.week, lecture.title), lecture)
}

/**
 * @returns {{ lecture: object, slide: object } | null} null when the citation
 *   names a lecture or slide that is not in the data, so the caller can fall
 *   back to a plain unclickable badge rather than offering an empty panel.
 */
export function findSlide(lectureLabel, slideNumber) {
  const lecture = byLabel.get(lectureLabel)
  if (!lecture) return null

  const slide = lecture.slides.find((s) => s.slide_number === slideNumber)
  return slide ? { lecture, slide } : null
}
