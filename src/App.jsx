import { useState, useEffect } from 'react'
import { RealtimeAgent, RealtimeSession } from '@openai/agents/realtime';
import { Phone, PhoneCall } from 'lucide-react';
import { X } from 'lucide-react';
import './App.css'

const agent = new RealtimeAgent({
  name: 'Assistant',
  instructions: 'You are a helpful assistant.',
});

const session = new RealtimeSession(agent, {
  model: 'gpt-realtime',
});

function App() {
  const [isInCall, setIsInCall] = useState(false)
  const [showUberScreen, setShowUberScreen] = useState(true)
  const [agentCalling, setAgentCalling] = useState(false)
  const [callDeclined, setCallDeclined] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [declinedSliding, setDeclinedSliding] = useState(false)

  // Simulate agent calling the driver after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setAgentCalling(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  async function handleAcceptCall() {
    setAgentCalling(false)
    setIsConnecting(true)
    
    // Show connecting state for 400ms
    setTimeout(async () => {
      setIsConnecting(false)
      setIsInCall(true)
      // Keep Uber screen visible but dimmed
      setShowUberScreen(true)
      
      try {
        await session.connect({
          apiKey: 'ek_',
        });
        console.log('You are connected!');
      } catch (e) {
        console.error(e);
      }
    }, 400)
  }

  function handleDeclineCall() {
    setAgentCalling(false)
    setCallDeclined(true)
    // Show declined message for 2 seconds, then slide down
    setTimeout(() => {
      setDeclinedSliding(true)
      // Hide completely after slide animation
      setTimeout(() => {
        setCallDeclined(false)
        setDeclinedSliding(false)
      }, 500)
    }, 2000)
  }

  async function handleToggle() {
    if (isInCall) {
      setIsInCall(false)
      setShowUberScreen(true)
      await session.close();
      console.log('You are disconnected!');
      return
    }

    setIsInCall(true)
    // Keep Uber screen visible but dimmed
    setShowUberScreen(true)

    try {
      await session.connect({
        apiKey: 'ek_',
      });
      console.log('You are connected!');
    } catch (e) {
      console.error(e);
    }
  }

  const getButtonText = () => {
    return isInCall ? 'End Call' : 'Start Call'
  }

  const getStatusText = () => {
    if (agentCalling) return 'Ubi is calling...'
    if (callDeclined) return 'Call declined'
    return isInCall ? 'In Call' : 'Tap to start'
  }

  return (
    <div className="app">
      {/* Uber Driver Screen */}
      <div className={`uber-screen ${showUberScreen ? 'visible' : 'faded'}`}>
        <div className="uber-header">
          <div className="driver-info">
            <div className="driver-avatar">👨‍💼</div>
            <div className="driver-details">
              <h3>John Smith</h3>
              <p>4.9 ⭐ • 2,847 trips</p>
            </div>
          </div>
          <div className="earnings">
            <span className="earnings-amount">$127.50</span>
            <span className="earnings-label">Today</span>
          </div>
        </div>

        <div className="trip-info">
          <div className="passenger-info">
            <div className="passenger-avatar">👩</div>
            <div className="passenger-details">
              <h4>Sarah M.</h4>
              <p>4.8 ⭐</p>
            </div>
          </div>
          <div className="trip-details">
            <div className="destination">
              <span className="destination-icon">📍</span>
              <span>Central Station</span>
            </div>
            <div className="eta">
              <span className="eta-icon">⏱️</span>
              <span>8 min ETA</span>
            </div>
          </div>
        </div>

        <div className="map-container">
          <div className="map-placeholder">
            <div className="map-content">
              <div className="route-line"></div>
              <div className="current-location">📍</div>
              <div className="destination-marker">🏁</div>
            </div>
          </div>
        </div>

        <div className="uber-controls">
          <button className="uber-button">Navigate</button>
          <button className="uber-button">Message</button>
          <button className="uber-button">Call</button>
        </div>

        <div className="uber-footer">
          <div className="trip-status">
            <span className="status-indicator online"></span>
            <span>Online</span>
          </div>
          <div className="next-trip">
            <span>Next trip in 2 min</span>
          </div>
        </div>
      </div>

      {/* Voice Assistant Overlay */}
      <div className={`voice-overlay ${isInCall ? 'visible' : ''}`}>
        <div className="voice-notification">
          <div className="voice-content">
            <div className="voice-left">
              <div className="voice-sound-waves">
                <div className="voice-wave"></div>
                <div className="voice-wave"></div>
                <div className="voice-wave"></div>
                <div className="voice-wave"></div>
                <div className="voice-wave"></div>
              </div>
              <div className="voice-text">
                <h3>Ubi Assistant</h3>
                <p>{getStatusText()}</p>
              </div>
            </div>
            <div className="voice-right">
              <button 
                className="decline-button"
                onClick={handleToggle}
              >
                <X size={20} className="decline-icon" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Connecting State */}
      {isConnecting && (
        <div className="calling-overlay">
          <div className="connecting-notification">
            <div className="voice-content">
              <div className="voice-left">
                <div className="voice-text">
                  <h3>Ubi Assistant</h3>
                  <p>Connecting...</p>
                </div>
              </div>
              <div className="calling-actions">
                <div className="connecting-spinner"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Agent Calling Notification Overlay */}
      {agentCalling && !isInCall && !isConnecting && (
        <div className="calling-overlay">
          <div className="calling-notification">
            <div className="voice-content">
              <div className="voice-left">
                <div className="voice-text">
                  <h3>Ubi Assistant</h3>
                  <p>Calling...</p>
                </div>
              </div>
              <div className="calling-actions">
                <button className="decline-button" onClick={handleDeclineCall}>
                  <X size={20} className="decline-icon" />
                </button>
                <button className="accept-button" onClick={handleAcceptCall}>
                  <Phone size={20} className="accept-icon" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
  
      {/* Call Declined Notification */}
      {callDeclined && (
        <div className="calling-overlay">
          <div className={`connecting-notification ${declinedSliding ? 'slide-down' : ''}`}>
            <div className="voice-content">
              <div className="voice-left">
                <div className="voice-text">
                  <h3>Call declined</h3>
                  <p>Ubi will try again later</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
