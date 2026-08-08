import conversation from './data/conversation.json'
import MessageList from './components/MessageList'
import './App.css'

function App() {
  const { course, messages } = conversation

  return (
    <div className="app">
      <header className="app-header">
        <h2>{course.code}</h2>
        <p>
          {course.title} · {course.instructor}
        </p>
      </header>
      <main className="app-main">
        <MessageList messages={messages} />
      </main>
    </div>
  )
}

export default App
