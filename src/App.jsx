import { useMemo } from 'react'
import { listScenarios } from './data/mock-stream.mjs'
import { useTutorStream } from './hooks/useTutorStream'
import { useTheme } from './hooks/useTheme'
import { getInitialConversation } from './lib/initialConversation'
import { pickScenario } from './lib/pickScenario'
import MessageList from './components/MessageList'
import Composer from './components/Composer'
import ThemeToggle from './components/ThemeToggle'
import Welcome from './components/Welcome'
import './App.css'

function App() {
  const conversation = useMemo(() => getInitialConversation(), [])
  const { course } = conversation
  const scenarios = useMemo(() => listScenarios(), [])
  const { messages, pending, isStreaming, send, stop } = useTutorStream(
    conversation.messages,
  )
  const { theme, toggleTheme } = useTheme()

  // Sending anything appends the user's turn first, so this flips to false on
  // the first message and the normal chat view takes over.
  const isFirstVisit = messages.length === 0 && !pending

  // A chip already knows which scenario it is; free text has to be guessed at.
  const handleSend = (question, scenarioId) =>
    send(question, scenarioId ?? pickScenario(question))

  return (
    <div className="app">
      <header className="app-header">
        <div className="content-column app-header-row">
          <div className="app-header-text">
            <h2>{course.code}</h2>
            <p>
              {course.title} · {course.instructor}
            </p>
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
      </header>

      <main className="app-main">
        {isFirstVisit ? (
          <Welcome course={course} scenarios={scenarios} onPick={handleSend} />
        ) : (
          <MessageList messages={messages} pending={pending} />
        )}
      </main>

      <Composer
        scenarios={scenarios}
        isStreaming={isStreaming}
        onSend={handleSend}
        onStop={stop}
        showSuggestions={!isFirstVisit}
      />
    </div>
  )
}

export default App
