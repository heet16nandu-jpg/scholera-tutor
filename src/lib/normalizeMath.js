/**
 * Promote single-line `$$…$$` to real display maths.
 *
 * micromark-extension-math only treats `$$` as *flow* (display) maths when the
 * fence sits on its own lines. A single-line `$$x = y$$` is parsed as inline
 * maths with a two-character delimiter, so it renders in the text flow — which
 * is why several short equations on consecutive lines end up crushed onto one
 * line instead of stacking.
 *
 * Every `$$` in the course data is written on a line of its own and none appear
 * mid-sentence, so rewriting them to the fenced form is faithful to the source:
 *
 *   $$a = b$$        ->    $$
 *                          a = b
 *                          $$
 *
 * Inline `$…$` is left completely alone.
 */

// Deliberately anchored at column 0. An indented `$$` would belong to a list
// item or blockquote, where inserting blank lines around it would break the
// enclosing block.
const WHOLE_LINE_DISPLAY = /^\$\$(.+?)\$\$[ \t]*$/
const FENCE = /^\s*(```|~~~)/

export function normalizeMath(markdown) {
  if (typeof markdown !== 'string' || !markdown.includes('$$')) return markdown

  const out = []
  let inFence = false
  let changed = false

  for (const line of markdown.split('\n')) {
    if (FENCE.test(line)) {
      inFence = !inFence
      out.push(line)
      continue
    }

    if (!inFence) {
      const match = WHOLE_LINE_DISPLAY.exec(line)
      // A line holding two separate expressions is left alone rather than
      // guessed at.
      if (match && !match[1].includes('$$')) {
        out.push('', '$$', match[1].trim(), '$$', '')
        changed = true
        continue
      }
    }

    out.push(line)
  }

  return changed ? out.join('\n') : markdown
}
