import { useCallback, useLayoutEffect, useState } from 'react'

const THEMES = ['light', 'dark']

/** The OS preference, as a theme name. */
export function systemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

/**
 * Writes the theme onto <html> so CSS can switch on it. Called once from
 * main.jsx before the first render — the palette has to be on the element
 * before the first paint, or a dark-set machine flashes light.
 */
export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme
  return theme
}

/**
 * The chosen theme, held in memory only.
 *
 * No localStorage: the brief is explicit that nothing persists between visits,
 * and a theme is not the place to make an exception. It seeds from the OS
 * preference so a dark-set machine still opens dark, and a refresh drops the
 * choice back to that seed.
 *
 * Deliberately not subscribed to `prefers-color-scheme` changes after mount:
 * once someone has pressed the button, the OS flipping at sunset should not
 * silently undo them.
 */
export function useTheme() {
  // Read back what main.jsx already wrote, so the hook and the DOM cannot
  // disagree on the first render.
  const [theme, setTheme] = useState(
    () => {
      const seeded = document.documentElement.dataset.theme
      return THEMES.includes(seeded) ? seeded : systemTheme()
    },
  )

  // Layout effect, not passive: the attribute drives every colour on screen, so
  // it lands in the same frame as the render that changed it.
  useLayoutEffect(() => {
    applyTheme(theme)
  }, [theme])

  const toggleTheme = useCallback(
    () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
    [],
  )

  return { theme, toggleTheme }
}
