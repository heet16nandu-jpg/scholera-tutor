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
        <li className="citation" key={`${citation.lecture}-${citation.slide}-${i}`}>
          {citation.lecture} · slide {citation.slide}
        </li>
      ))}
    </ul>
  )
}

function Message({ message }) {
  const isUser = message.role === 'user'

  return (
    <li className={`message ${isUser ? 'message-user' : 'message-assistant'}`}>
      <div className="bubble">
        <Markdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {message.content}
        </Markdown>
      </div>
      {!isUser && <Citations citations={message.citations} />}
    </li>
  )
}

export default function MessageList({ messages }) {
  return (
    <ol className="message-list">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </ol>
  )
}
