import { useState } from 'react'
import { RealtimeAgent, RealtimeSession } from '@openai/agents/realtime';
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

  async function handleToggle() {
    if (isInCall) {
      setIsInCall(false)
      session.close();
      console.log('You are disconnected!');
      return
    }

    try {
      await session.connect({
        apiKey: await getEphemeralKey(),
      });
      session.sendMessage('Ask Jack how he is feeling. Just a quick "how are you"');
      // session.transport.sendEvent({
      //   type: 'response.create',
      //   response: {
      //     conversation: 'none',
      //     instructions: "Ask Jack briefly how he is feeling. Just one quick sentence.",
      //     modalities: ['audio','text'] 
      //   }
      // });
    } catch (e) {
      console.error(e);
    }

    setIsInCall(true)
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
