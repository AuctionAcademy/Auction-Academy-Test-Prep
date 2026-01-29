import { useState } from 'react'
import StateSelector from './components/StateSelector'
import Dashboard from './components/Dashboard'
import Test from './components/Test'
import Flashcards from './components/Flashcards'
import Game from './components/Game'
import './App.css'

function App() {
  const [selectedState, setSelectedState] = useState(null)
  const [mode, setMode] = useState('select') // select, dashboard, test, quiz, flashcards, game
  const [testConfig, setTestConfig] = useState({})

  const handleSelectState = (state, mode = null) => {
    setSelectedState(state)
    if (mode === 'test') {
      setTestConfig({ questionCount: 75, topic: null })
      setMode('test')
    } else if (mode === 'quiz') {
      setMode('dashboard') // Go to dashboard to select topic
    } else if (mode === 'flashcards') {
      setTestConfig({ topic: null })
      setMode('flashcards')
    } else if (mode === 'game') {
      setTestConfig({ topic: null })
      setMode('game')
    } else {
      setMode('dashboard')
    }
  }

  const handleChangeState = () => {
    setSelectedState(null)
    setMode('select')
  }

  const handleStartTest = (questionCount) => {
    setTestConfig({ questionCount, topic: null })
    setMode('test')
  }

  const handleStartQuiz = (topic, questionCount) => {
    setTestConfig({ questionCount, topic: topic || null })
    setMode('test')
  }

  const handleStartFlashcards = (topic) => {
    setTestConfig({ topic: topic || null })
    setMode('flashcards')
  }

  const handleStartGame = (topic) => {
    setTestConfig({ topic: topic || null })
    setMode('game')
  }

  const handleExit = () => {
    setMode('dashboard')
  }

  return (
    <div className="app">
      {mode === 'select' && (
        <StateSelector onSelectState={handleSelectState} />
      )}
      
      {mode === 'dashboard' && (
        <Dashboard 
          state={selectedState}
          onChangeState={handleChangeState}
          onStartTest={handleStartTest}
          onStartQuiz={handleStartQuiz}
          onStartFlashcards={handleStartFlashcards}
          onStartGame={handleStartGame}
        />
      )}
      
      {mode === 'test' && (
        <Test 
          state={selectedState}
          questionCount={testConfig.questionCount}
          topic={testConfig.topic}
          onExit={handleExit}
        />
      )}
      
      {mode === 'flashcards' && (
        <Flashcards 
          state={selectedState}
          topic={testConfig.topic}
          onExit={handleExit}
        />
      )}
      
      {mode === 'game' && (
        <Game 
          state={selectedState}
          topic={testConfig.topic}
          onExit={handleExit}
        />
      )}
    </div>
  )
}

export default App
