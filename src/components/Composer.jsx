import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react'
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

  // Grow to fit the question, up to the max-height set in CSS. Reads scrollHeight
  // after collapsing to `auto`, otherwise the current height floors the
  // measurement and the box can only ever get taller. Layout effect so the
  // resize lands in the same frame as the text — a passive effect shows one
  // frame of clipped content.
  useLayoutEffect(() => {
    const el = inputRef.current
    if (!el) return
    el.style.height = 'auto'
    // scrollHeight is the content box; the border has to be added back because
    // box-sizing is border-box, or every textarea keeps a 2px scroll.
    el.style.height = `${el.scrollHeight + el.offsetHeight - el.clientHeight}px`
  }, [value])

  const send = () => {
    const question = value.trim()
    if (!question || isStreaming) return
    setValue('')
    onSend(question)
  }

  const submit = (event) => {
    event.preventDefault()
    send()
  }

  // A textarea does not submit on Enter by itself, so both halves are explicit:
  // Enter sends, Shift+Enter falls through to the browser's own newline.
  const onKeyDown = (event) => {
    if (event.key !== 'Enter' || event.shiftKey) return
    // An IME candidate list also closes on Enter; sending there would swallow
    // the composition.
    if (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) return
    event.preventDefault()
    send()
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
          <textarea
            ref={inputRef}
            className="composer-input"
            value={value}
            rows={1}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKeyDown}
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
