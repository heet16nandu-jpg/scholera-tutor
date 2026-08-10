import './ThemeToggle.css'

function SunIcon() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
        <circle cx="8" cy="8" r="3.1" />
        <path d="M8 1.4v1.5M8 13.1v1.5M14.6 8h-1.5M2.9 8H1.4M12.67 3.33l-1.06 1.06M4.39 11.61l-1.06 1.06M12.67 12.67l-1.06-1.06M4.39 4.39 3.33 3.33" />
      </g>
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
      <path
        d="M13.4 9.9A5.8 5.8 0 0 1 6.1 2.6a5.9 5.9 0 1 0 7.3 7.3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * Switches the palette. A plain button rather than a checkbox or a switch role:
 * it performs an action immediately and has no meaningful "off", so the label
 * names what the next press will do.
 *
 * The icon shows the theme being offered, not the one in use — the common
 * pattern, and the label says so out loud for anyone who cannot see it.
 */
export default function ThemeToggle({ theme, onToggle }) {
  const next = theme === 'dark' ? 'light' : 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={onToggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      {/* The palette change is obvious to anyone who can see it and invisible
          to anyone who cannot, so the new state is announced. */}
      <span className="sr-only" role="status">
        {`${theme} theme`}
      </span>
    </button>
  )
}
