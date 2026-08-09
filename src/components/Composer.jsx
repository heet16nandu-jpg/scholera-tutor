import { useCallback, useId, useRef, useState } from 'react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useTypeToFocus } from '../hooks/useTypeToFocus'
import SuggestionChips from './SuggestionChips'
import './Composer.css'

// Matches the app's single mobile boundary — the same 600px used for content
// padding, bubble width and the welcome screen. See the note in Composer.css.
const NARROW = '(max-width: 600px)'

function BulbIcon() {
  return (
    <svg viewBox="0 0 14 14" width="13" height="13" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
        <path
          d="M7 1.6a3.6 3.6 0 0 0-2.15 6.5c.38.28.62.72.66 1.19h2.98c.04-.47.28-.91.66-1.19A3.6 3.6 0 0 0 7 1.6Z"
          strokeLinejoin="round"
        />
        <path d="M5.7 11.3h2.6M6.1 12.7h1.8" />
      </g>
    </svg>
  )
}

function ToggleChevron() {
  return (
    <svg
      className="toggle-chevron"
      viewBox="0 0 12 12"
      width="11"
      height="11"
      aria-hidden="true"
    >
      <path
        d="M2.5 4.5 L6 8 L9.5 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function Composer({
  scenarios,
  isStreaming,
  onSend,
  onStop,
  showSuggestions = true,
}) {
  const [value, setValue] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const inputRef = useRef(null)
  const drawerId = useId()
  const isNarrow = useMediaQuery(NARROW)

  // Sending from a chip closes the drawer — the suggestion has been used.
  const pickSuggestion = (prompt, scenarioId) => {
    setDrawerOpen(false)
    onSend(prompt, scenarioId)
  }

  // The input was not focused, so there is no caret to insert at — append.
  const appendPasted = useCallback(
    (text) => setValue((current) => current + text),
    [],
  )

  useTypeToFocus(inputRef, {
    disabled: isStreaming,
    onPasteText: appendPasted,
  })

  const submit = (event) => {
    event.preventDefault()
    const question = value.trim()
    if (!question || isStreaming) return
    setValue('')
    onSend(question)
  }

  return (
    <div className="composer">
      <div className="content-column">
        {/* With no real matching, these are the only reliable way to reach a
            specific scenario. Hidden while the first-visit screen is up, which
            shows the same chips more prominently — one set on screen, not two.

            Narrow screens get a drawer instead of the always-open strip: the
            strip costs a constant 41px and never shows more than one complete
            suggestion, which is a poor trade on a phone. */}
        {showSuggestions &&
          (isNarrow ? (
            <div className="composer-suggestions">
              <button
                type="button"
                className={`suggestion-toggle${drawerOpen ? ' is-open' : ''}`}
                aria-expanded={drawerOpen}
                aria-controls={drawerId}
                onClick={() => setDrawerOpen((open) => !open)}
              >
                <BulbIcon />
                <span>Suggestions</span>
                <ToggleChevron />
              </button>

              {drawerOpen && (
                <div className="suggestion-drawer" id={drawerId}>
                  <SuggestionChips
                    scenarios={scenarios}
                    onPick={pickSuggestion}
                    disabled={isStreaming}
                    variant="wrap"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="composer-suggestions">
              <SuggestionChips
                scenarios={scenarios}
                onPick={onSend}
                disabled={isStreaming}
                variant="row"
                label="Try"
              />
            </div>
          ))}

        <form className="composer-row" onSubmit={submit}>
          <input
            ref={inputRef}
            className="composer-input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Ask about the course…"
            aria-label="Ask about the course"
            disabled={isStreaming}
          />
          {isStreaming ? (
            <button type="button" className="btn btn-stop" onClick={onStop}>
              Stop
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-send"
              disabled={!value.trim()}
            >
              Send
            </button>
          )}
        </form>
      </div>
    </div>
  )
}
