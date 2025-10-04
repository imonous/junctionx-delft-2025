import { useState, useEffect } from 'react'
import { RealtimeAgent, RealtimeSession } from '@openai/agents/realtime';
import { Phone, PhoneCall } from 'lucide-react';
import { X } from 'lucide-react';
import './App.css'
import dedent from 'dedent';

const agent = new RealtimeAgent({
  name: 'Ubi',
  voice: 'marin',
  instructions: dedent(`
    You are Ubi, the Uber Driver Assistant. 

    
    Keep an upbeat and friendly tone. Don't be too formal, you are friends with the driver.
    
    The driver's name is Jack. He's been driving for a while now and is likely tired. Ask him how he is feeling. If he is not great, offer him to take a break.
  `),
});

const session = new RealtimeSession(agent, {
  model: 'gpt-realtime',
  voice: 'marin',
});

// IMPORTANT: THIS IS FOR LOCAL DEVELOPMENT ONLY!
const openAiApiKey = import.meta.env.VITE_OPENAI_API_KEY;

async function getEphemeralKey() {

  const response = await fetch('https://api.openai.com/v1/realtime/client_secrets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${openAiApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      session: {
        type: 'realtime',
        model: 'gpt-realtime'
      }
    })
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.value;
}



function App() {
  const [isInCall, setIsInCall] = useState(false)
  const [showUberScreen, setShowUberScreen] = useState(true)
  const [agentCalling, setAgentCalling] = useState(false)
  const [callDeclined, setCallDeclined] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [declinedSliding, setDeclinedSliding] = useState(false)
  const [ringtoneInterval, setRingtoneInterval] = useState(null)

  // Simulate agent calling the driver after 3 seconds
  useEffect(() => {
    console.log('Setting up 3-second timer for agent calling...')
    const timer = setTimeout(() => {
      console.log('3 seconds elapsed, starting agent call...')
      setAgentCalling(true)
      startIPhoneRingtone()
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Clean up ringtone when component unmounts or call ends
  useEffect(() => {
    return () => {
      if (ringtoneInterval) {
        clearInterval(ringtoneInterval)
      }
    }
  }, [ringtoneInterval])

  async function handleAcceptCall() {
    // Stop iPhone ringtone
    stopIPhoneRingtone()
    
    // Play phone pickup sound
    playPhonePickupSound()
    
    setAgentCalling(false)
    setIsConnecting(true)

    try {
      await session.connect({
        apiKey: await getEphemeralKey(),
      });
      session.sendMessage('Ask Jack how he is feeling. Just a quick "how are you"');
    } catch (e) {
      console.error(e);
    }

    playConnectionSound()
      
    setIsConnecting(false)
    setIsInCall(true)
    // Keep Uber screen visible but dimmed
    setShowUberScreen(true)
  }

  function playPhonePickupSound() {
    // Create realistic phone pickup sound with multiple tones
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    
    // Create a more complex pickup sound with two oscillators
    const oscillator1 = audioContext.createOscillator()
    const oscillator2 = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    const filter = audioContext.createBiquadFilter()
    
    // Connect the audio graph
    oscillator1.connect(filter)
    oscillator2.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Set up filter for more realistic phone sound
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(2000, audioContext.currentTime)
    
    // First tone: lower frequency click
    oscillator1.type = 'sine'
    oscillator1.frequency.setValueAtTime(400, audioContext.currentTime)
    oscillator1.frequency.exponentialRampToValueAtTime(600, audioContext.currentTime + 0.05)
    
    // Second tone: higher frequency beep
    oscillator2.type = 'sine'
    oscillator2.frequency.setValueAtTime(800, audioContext.currentTime)
    oscillator2.frequency.exponentialRampToValueAtTime(1000, audioContext.currentTime + 0.08)
    
    // Envelope for natural sound
    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.02)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.12)
    
    oscillator1.start(audioContext.currentTime)
    oscillator1.stop(audioContext.currentTime + 0.12)
    oscillator2.start(audioContext.currentTime)
    oscillator2.stop(audioContext.currentTime + 0.12)
  }

  function playConnectionSound() {
    // Create pleasant connection confirmation sound
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    
    // Create a harmonious chord for connection success
    const oscillator1 = audioContext.createOscillator()
    const oscillator2 = audioContext.createOscillator()
    const oscillator3 = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    const filter = audioContext.createBiquadFilter()
    
    // Connect the audio graph
    oscillator1.connect(filter)
    oscillator2.connect(filter)
    oscillator3.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Set up filter for warm, pleasant sound
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(3000, audioContext.currentTime)
    filter.Q.setValueAtTime(1, audioContext.currentTime)
    
    // Create a pleasant major chord (C-E-G)
    oscillator1.type = 'sine'
    oscillator1.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
    
    oscillator2.type = 'sine'
    oscillator2.frequency.setValueAtTime(659.25, audioContext.currentTime) // E5
    
    oscillator3.type = 'sine'
    oscillator3.frequency.setValueAtTime(783.99, audioContext.currentTime) // G5
    
    // Gentle envelope for pleasant fade-in and fade-out
    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.1)
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.3)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6)
    
    oscillator1.start(audioContext.currentTime)
    oscillator1.stop(audioContext.currentTime + 0.6)
    oscillator2.start(audioContext.currentTime)
    oscillator2.stop(audioContext.currentTime + 0.6)
    oscillator3.start(audioContext.currentTime)
    oscillator3.stop(audioContext.currentTime + 0.6)
  }

  function playDeclineSound() {
    // Create a gentle decline sound (lower pitch, descending tone)
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    
    const oscillator1 = audioContext.createOscillator()
    const oscillator2 = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    const filter = audioContext.createBiquadFilter()
    
    // Connect the audio graph
    oscillator1.connect(filter)
    oscillator2.connect(filter)
    filter.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    // Set up filter for softer decline sound
    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(1500, audioContext.currentTime)
    
    // Create a descending tone pattern (like a gentle "no")
    oscillator1.type = 'sine'
    oscillator1.frequency.setValueAtTime(400, audioContext.currentTime)
    oscillator1.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.15)
    
    oscillator2.type = 'sine'
    oscillator2.frequency.setValueAtTime(600, audioContext.currentTime)
    oscillator2.frequency.exponentialRampToValueAtTime(450, audioContext.currentTime + 0.15)
    
    // Gentle envelope for soft decline sound
    gainNode.gain.setValueAtTime(0, audioContext.currentTime)
    gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.05)
    gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2)
    
    oscillator1.start(audioContext.currentTime)
    oscillator1.stop(audioContext.currentTime + 0.2)
    oscillator2.start(audioContext.currentTime)
    oscillator2.stop(audioContext.currentTime + 0.2)
  }

  function startIPhoneRingtone() {
    console.log('Starting iPhone ringtone...')
    
    // Create iPhone-style ringtone (classic "Opening" ringtone)
    const playRing = () => {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        
        // Resume audio context if it's suspended (required for autoplay policy)
        if (audioContext.state === 'suspended') {
          audioContext.resume().then(() => {
            console.log('Audio context resumed')
            createRingSound(audioContext)
          }).catch(error => {
            console.error('Failed to resume audio context:', error)
          })
        } else {
          createRingSound(audioContext)
        }
      } catch (error) {
        console.error('Error creating audio context:', error)
      }
    }
    
    const createRingSound = (audioContext) => {
      try {
        const oscillator1 = audioContext.createOscillator()
        const oscillator2 = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        const filter = audioContext.createBiquadFilter()
        
        // Connect the audio graph
        oscillator1.connect(filter)
        oscillator2.connect(filter)
        filter.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        // Set up filter for iPhone-like sound
        filter.type = 'lowpass'
        filter.frequency.setValueAtTime(2500, audioContext.currentTime)
        filter.Q.setValueAtTime(1, audioContext.currentTime)
        
        // iPhone "Opening" ringtone frequencies (A4 and C5)
        oscillator1.type = 'sine'
        oscillator1.frequency.setValueAtTime(440, audioContext.currentTime) // A4
        
        oscillator2.type = 'sine'
        oscillator2.frequency.setValueAtTime(523.25, audioContext.currentTime) // C5
        
        // iPhone ringtone envelope (quick attack, short sustain, quick decay)
        gainNode.gain.setValueAtTime(0, audioContext.currentTime)
        gainNode.gain.linearRampToValueAtTime(0.4, audioContext.currentTime + 0.05)
        gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.15)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
        
        oscillator1.start(audioContext.currentTime)
        oscillator1.stop(audioContext.currentTime + 0.5)
        oscillator2.start(audioContext.currentTime)
        oscillator2.stop(audioContext.currentTime + 0.5)
        
        console.log('Ring played successfully')
      } catch (error) {
        console.error('Error creating ring sound:', error)
      }
    }
    
    // Play ring immediately
    playRing()
    
    // Set up interval to repeat ringtone every 2.5 seconds (iPhone timing)
    const interval = setInterval(playRing, 2500)
    setRingtoneInterval(interval)
    console.log('Ringtone interval set:', interval)
  }

  function stopIPhoneRingtone() {
    console.log('Stopping iPhone ringtone...')
    if (ringtoneInterval) {
      console.log('Clearing ringtone interval:', ringtoneInterval)
      clearInterval(ringtoneInterval)
      setRingtoneInterval(null)
      console.log('Ringtone stopped successfully')
    } else {
      console.log('No ringtone interval to clear')
    }
  }

  function handleDeclineCall() {
    // Stop iPhone ringtone
    stopIPhoneRingtone()
    
    // Play decline sound
    playDeclineSound()
    
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
      session.close();
      console.log('You are disconnected!');
      return
    }

    throw new Error("This ain't supposed to happen...")
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
                      <div className="map-background">
                        <div className="map-streets">
                          {/* Random Roads */}
                          <div className="road horizontal road-1"></div>
                          <div className="road horizontal road-2"></div>
                          <div className="road horizontal road-3"></div>
                          <div className="road vertical road-4"></div>
                          <div className="road vertical road-5"></div>
                          <div className="road vertical road-6"></div>
                        </div>
                        <div className="map-labels">
                          <div className="street-label vertical">Broadway</div>
                        </div>
                      </div>
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
