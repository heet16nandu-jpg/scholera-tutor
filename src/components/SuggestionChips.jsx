import './SuggestionChips.css'

/**
 * The scenario prompts, as clickable chips.
 *
 * Shared by the composer and the first-visit screen so there is one source of
 * suggestions, not two. `variant` only changes the layout: `row` scrolls
 * horizontally in the composer's tight strip, `wrap` flows onto multiple lines
 * where there is room for it.
 */
export default function SuggestionChips({
  scenarios,
  onPick,
  disabled = false,
  variant = 'row',
  label,
}) {
  return (
    <div className={`suggestions suggestions-${variant}`}>
      {label && <span className="suggestions-label">{label}</span>}
      <ul className="suggestion-row">
        {scenarios.map((scenario) => (
          <li key={scenario.id}>
            <button
              type="button"
              className="chip"
              disabled={disabled}
              onClick={() => onPick(scenario.prompt, scenario.id)}
            >
              {scenario.prompt}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
