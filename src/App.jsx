import { useState } from 'react'
import StateSelector from './components/StateSelector'
import Dashboard from './components/Dashboard'
import Test from './components/Test'
import Flashcards from './components/Flashcards'
import Game from './components/Game'
import StudyGuide from './components/StudyGuide'
import './App.css'

function App() {
  const [selectedState, setSelectedState] = useState(null)
  const [mode, setMode] = useState('select') // select, dashboard, test, quiz, flashcards, game, studyguide
  const [testConfig, setTestConfig] = useState({})

  const handleSelectState = (state, mode = null) => {
    setSelectedState(state)
    if (mode === 'test') {
      setTestConfig({ questionCount: 75, topic: 'All Topics' })
      setMode('test')
    } else if (mode === 'quiz') {
      setMode('dashboard') // Go to dashboard to select topic
    } else if (mode === 'flashcards') {
      setTestConfig({ topic: 'All Topics' })
      setMode('flashcards')
    } else if (mode === 'game') {
      setTestConfig({ topic: 'All Topics' })
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
    setTestConfig({ questionCount, topic: 'All Topics' })
    setMode('test')
  }

  const handleStartQuiz = (topic, questionCount) => {
    setTestConfig({ questionCount, topic: topic || 'All Topics' })
    setMode('test')
  }

  const handleStartFlashcards = (topic) => {
    setTestConfig({ topic: topic || 'All Topics' })
    setMode('flashcards')
  }

  const handleStartGame = (topic) => {
    setTestConfig({ topic: topic || 'All Topics' })
    setMode('game')
  }

  const handleStartStudyGuide = () => {
    setMode('studyguide')
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
          onStartStudyGuide={handleStartStudyGuide}
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

      {mode === 'studyguide' && (
        <StudyGuide 
          selectedState={selectedState}
          onBack={handleExit}
        />
      )}
    </div>
  )
}

export default App
