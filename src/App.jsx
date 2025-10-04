import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [isActive, setIsActive] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleToggle = () => {
    if (!isActive) {
      // Starting conversation
      setIsActive(true)
      setIsListening(true)
      
      // Simulate listening for 3 seconds, then processing
      setTimeout(() => {
        setIsListening(false)
        setIsProcessing(true)
        
        // Simulate processing for 2 seconds, then back to idle
        setTimeout(() => {
          setIsProcessing(false)
        }, 2000)
      }, 3000)
    } else {
      // Ending conversation
      setIsActive(false)
      setIsListening(false)
      setIsProcessing(false)
    }
  }

  const getButtonText = () => {
    if (isListening) return 'Listening'
    if (isProcessing) return 'Processing'
    if (isActive) return 'End'
    return 'Start'
  }

  const getStatusText = () => {
    if (isListening) return 'Speak'
    if (isProcessing) return 'Thinking'
    if (isActive) return 'Active'
    return 'Tap to start'
  }

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1 className="title">Uby</h1>
          <p className="subtitle">Assistant</p>
        </div>
        
        <div className="main-content">
          <div className={`button-container ${isActive ? 'active' : ''}`}>
            <button 
              className={`talk-button ${isListening ? 'listening' : ''} ${isProcessing ? 'processing' : ''}`}
              onClick={handleToggle}
              disabled={isProcessing}
            >
              <div className="button-content">
                <div className="mic-icon">
                  {isListening ? '🎤' : '🎧'}
                </div>
                <span className="button-text">{getButtonText()}</span>
              </div>
              
              {isListening && (
                <div className="sound-waves">
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                </div>
              )}
              
              {isProcessing && (
                <div className="processing-dots">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              )}
            </button>
          </div>
          
          <p className="status-text">{getStatusText()}</p>
        </div>
        
        <div className="footer">
          <p className="description">
            Driver Assistant
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
