import { useState } from 'react'
import SuggestionChips from './SuggestionChips'
import './Composer.css'

export default function Composer({
  scenarios,
  isStreaming,
  onSend,
  onStop,
  showSuggestions = true,
}) {
  const [value, setValue] = useState('')

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
            shows the same chips more prominently — one set on screen, not two. */}
        {showSuggestions && (
          <div className="composer-suggestions">
            <SuggestionChips
              scenarios={scenarios}
              onPick={onSend}
              disabled={isStreaming}
              variant="row"
              label="Try"
            />
          </div>
        )}

        <form className="composer-row" onSubmit={submit}>
          <input
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
