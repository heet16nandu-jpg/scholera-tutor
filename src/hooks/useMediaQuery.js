import { useCallback, useSyncExternalStore } from 'react'

/**
 * Subscribes to a media query.
 *
 * Used where the *behaviour* differs by width, not just the styling — the
 * composer's suggestion drawer exists only on narrow screens, so there is a
 * toggle button and a collapse state to render or not render. Anything purely
 * visual belongs in a CSS media query instead.
 *
 * `useSyncExternalStore` rather than useState + useEffect: matchMedia is
 * exactly the external store it exists for, and it reads the current value on
 * every render, so a width that changes between render and subscribe cannot be
 * missed.
 */
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    [query],
  )

  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query],
  )

  return useSyncExternalStore(subscribe, getSnapshot)
}
