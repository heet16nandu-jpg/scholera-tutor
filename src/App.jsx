import { useMemo } from 'react'
import conversation from './data/conversation.json'
import { listScenarios } from './data/mock-stream.mjs'
import { useTutorStream } from './hooks/useTutorStream'
import { pickScenario } from './lib/pickScenario'
import MessageList from './components/MessageList'
import Composer from './components/Composer'
import './App.css'

function App() {
  const { course } = conversation
  const scenarios = useMemo(() => listScenarios(), [])
  const { messages, pending, isStreaming, send, stop } = useTutorStream(
    conversation.messages,
  )

  // A chip already knows which scenario it is; free text has to be guessed at.
  const handleSend = (question, scenarioId) =>
    send(question, scenarioId ?? pickScenario(question))

  return (
    <div className="app">
      <header className="app-header">
        <h2>{course.code}</h2>
        <p>
          {course.title} · {course.instructor}
        </p>
      </header>

      <main className="app-main">
        <MessageList messages={messages} pending={pending} />
      </main>

      <Composer
        scenarios={scenarios}
        isStreaming={isStreaming}
        onSend={handleSend}
        onStop={stop}
      />
    </div>
  )
}

export default App
