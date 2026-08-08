import { useState } from 'react'
import './Composer.css'

export default function Composer({ scenarios, isStreaming, onSend, onStop }) {
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
      {/* Testing aid: with no real matching, these are the only reliable way to
          reach a specific scenario. Each sends its prompt and names its id. */}
      <div className="suggestions">
        <span className="suggestions-label">Try</span>
        <ul className="suggestion-row">
          {scenarios.map((scenario) => (
            <li key={scenario.id}>
              <button
                type="button"
                className="chip"
                disabled={isStreaming}
                onClick={() => onSend(scenario.prompt, scenario.id)}
              >
                {scenario.prompt}
              </button>
            </li>
          ))}
        </ul>
      </div>

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
          <button type="submit" className="btn btn-send" disabled={!value.trim()}>
            Send
          </button>
        )}
      </form>
    </div>
  )
}
