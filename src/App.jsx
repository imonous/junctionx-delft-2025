import { useState } from 'react'
import './App.css'

function App() {
  const [isInCall, setIsInCall] = useState(false)

  const handleToggle = () => {
    setIsInCall(!isInCall)
  }

  const getButtonText = () => {
    return isInCall ? 'End Call' : 'Start Call'
  }

  const getStatusText = () => {
    return isInCall ? 'In Call' : 'Tap to start'
  }

  return (
    <div className="app">
      <div className="container">
        <div className="header">
          <h1 className="title">Uby</h1>
          <p className="subtitle">Assistant</p>
        </div>
        
        <div className="main-content">
          <div className={`button-container ${isInCall ? 'active' : ''}`}>
            <button 
              className={`talk-button ${isInCall ? 'listening' : ''}`}
              onClick={handleToggle}
            >
              <div className="button-content">
                <div className="mic-icon">
                  {isInCall ? '📞' : '🎧'}
                </div>
                <span className="button-text">{getButtonText()}</span>
              </div>
              
              {isInCall && (
                <div className="sound-waves">
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
                  <div className="wave"></div>
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
