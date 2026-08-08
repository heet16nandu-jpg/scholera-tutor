import { useCallback, useEffect, useRef } from 'react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import './MessageList.css'

function Citations({ citations }) {
  if (!citations?.length) return null

  return (
    <ul className="citations">
      {citations.map((citation, i) => (
        <li
          className="citation"
          key={`${citation.lecture}-${citation.slide}-${i}`}
        >
          {citation.lecture} · slide {citation.slide}
        </li>
      ))}
    </ul>
  )
}

function Prose({ children }) {
  return (
    <Markdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
    >
      {children}
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
