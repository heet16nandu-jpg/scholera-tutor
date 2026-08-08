import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { findSlide } from '../lib/lectures'
import { normalizeMath } from '../lib/normalizeMath'
import './MessageList.css'

function Chevron() {
  return (
    <svg
      className="chevron"
      viewBox="0 0 12 12"
      width="12"
      height="12"
      aria-hidden="true"
    >
      <path
        d="M4 2.5 L8 6 L4 9.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/**
 * The cited slide, rendered from the lecture data.
 *
 * Bullets are printed as plain text — they are prose in the source, not
 * markdown, so running them through the markdown pipeline would only risk
 * mangling characters like `_` and `*`. Formulas are the exception: they are
 * raw LaTeX, so they go through the same remark-math/KaTeX path the messages
 * use rather than a second rendering mechanism.
 */
function SlidePanel({ id, lecture, slide }) {
  return (
    <div className="slide-panel" id={id}>
      <p className="slide-eyebrow">
        Week {lecture.week} · slide {slide.slide_number}
      </p>
      <h4 className="slide-title">{slide.title}</h4>

      {slide.bullets?.length > 0 && (
        <ul className="slide-bullets">
          {slide.bullets.map((bullet, i) => (
            <li key={i}>{bullet}</li>
          ))}
        </ul>
      )}

      {slide.formulas?.length > 0 && (
        <div className="slide-formulas">
          {slide.formulas.map((formula, i) => (
            <Prose key={i}>{`$$${formula}$$`}</Prose>
          ))}
        </div>
      )}

      {/* Several cited slides carry only a figure and notes — no bullets at
          all — so omitting this would leave those panels looking broken. */}
      {slide.figure?.description && (
        <p className="slide-figure">
          <span className="slide-label">Figure</span>
          {slide.figure.description}
        </p>
      )}

      {slide.notes && (
        <p className="slide-notes">
          <span className="slide-label">Speaker notes</span>
          {slide.notes}
        </p>
      )}
    </div>
  )
}

function Citations({ citations }) {
  // Held here rather than per-badge, so opening one closes the other. Scoped to
  // this component instance, which means one open panel per message.
  const [openIndex, setOpenIndex] = useState(null)
  const baseId = useId()

  if (!citations?.length) return null

  return (
    <ul className="citations">
      {citations.map((citation, i) => {
        const resolved = findSlide(citation.lecture, citation.slide)
        const isOpen = openIndex === i
        const panelId = `${baseId}-${i}`
        const label = `${citation.lecture} · slide ${citation.slide}`

        // A citation we cannot resolve stays a plain badge: better than a
        // control that opens nothing.
        if (!resolved) {
          return (
            <li className="citation-item" key={panelId}>
              <span className="citation citation-static">{label}</span>
            </li>
          )
        }

        return (
          <li className="citation-item" key={panelId}>
            <button
              type="button"
              className={`citation citation-button${isOpen ? ' is-open' : ''}`}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? null : i)}
            >
              <Chevron />
              <span className="citation-label">{label}</span>
            </button>
            {isOpen && <SlidePanel id={panelId} {...resolved} />}
          </li>
        )
      })}
    </ul>
  )
}

function Prose({ children }) {
  // Runs on every streamed flush, so it early-returns when there is no `$$`.
  const source = useMemo(() => normalizeMath(children), [children])

  return (
    <Markdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
    >
      {source}
    </Markdown>
  )
}

function Message({ message }) {
  const isUser = message.role === 'user'

  // Failed before anything arrived: there is no partial answer to show, so the
  // failure itself is the whole message.
  if (message.status === 'failed' && !message.content) {
    return (
      <li className="message message-assistant">
        <p className="notice notice-failed" role="alert">
          {message.error ?? 'The tutor could not answer.'}
        </p>
      </li>
    )
  }

  return (
    <li className={`message ${isUser ? 'message-user' : 'message-assistant'}`}>
      <div className="bubble">
        <Prose>{message.content}</Prose>
      </div>

      {message.status === 'failed' && (
        <p className="notice notice-failed" role="alert">
          Incomplete — {message.error ?? 'the stream ended early.'}
        </p>
      )}
      {message.status === 'stopped' && (
        <p className="notice notice-stopped">Stopped — this answer is partial.</p>
      )}

      {!isUser && <Citations citations={message.citations} />}
    </li>
  )
}

function Pending({ pending }) {
  return (
    <li className="message message-assistant">
      <div className="bubble">
        {pending.phase === 'waiting' ? (
          <span className="typing" aria-label="The tutor is thinking">
            <i />
            <i />
            <i />
          </span>
        ) : (
          <>
            <Prose>{pending.text}</Prose>
            <span className="caret" aria-hidden="true" />
          </>
        )}
      </div>
    </li>
  )
}

export default function MessageList({ messages, pending }) {
  const scrollRef = useRef(null)
  // Whether to keep pinning to the bottom as content streams in. Goes false the
  // moment the reader scrolls up, so streaming never yanks them back down.
  const stickRef = useRef(true)

  const handleScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80
  }, [])

  // No dep array: this runs after every render, including each streamed chunk.
  useEffect(() => {
    const el = scrollRef.current
    if (el && stickRef.current) el.scrollTop = el.scrollHeight
  })

  return (
    <div className="message-scroll" ref={scrollRef} onScroll={handleScroll}>
      <ol className="message-list">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        {pending && <Pending pending={pending} />}
      </ol>
    </div>
  )
}
