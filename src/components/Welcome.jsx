import SuggestionChips from './SuggestionChips'
import './Welcome.css'

/**
 * Shown in place of the message list when there is no history yet, so the
 * first visit is not a blank scrolling region. Deliberately plain — it names
 * the course and offers a way in, nothing more.
 */
export default function Welcome({ course, scenarios, onPick }) {
  return (
    <div className="welcome">
      <div className="welcome-inner">
        <p className="welcome-eyebrow">
          {course.code} · {course.instructor}
        </p>
        <h1 className="welcome-title">{course.title}</h1>
        <p className="welcome-line">
          Ask anything from the lectures — every answer says which slide it came
          from.
        </p>

        <SuggestionChips
          scenarios={scenarios}
          onPick={onPick}
          variant="wrap"
          label="Start with"
        />
      </div>
    </div>
  )
}
