import React from 'react';
import { createRoot } from 'react-dom/client'

/** Main app */
class App extends React.PureComponent {

    state = {
        transcripts: [],
        transcript: '',
        isMuted: false,
    }

    componentDidMount(){

        // Initilaise reference to Web Speech API
        const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
        const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList;
        const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

        // Create speech recognition and grammar object
        const speechRecognitionList = new SpeechGrammarList();
        this.recognition = new SpeechRecognition();

        // Set recognition grammar (dictionary of words) to default grammar list
        this.recognition.grammars = speechRecognitionList;
        // Determines whether continuous results are captured (true), or just a single result each time recognition is started (false).
        this.recognition.continuous = true;
        // Sets the language of the recognition.
        this.recognition.lang = 'en';
        // Determines whether the speech recognition system should return interim results, or just final results.
        this.recognition.interimResults = true;
        // Sets the number of alternative potential matches that should be returned per result.
        this.recognition.maxAlternatives = 1;

        // Get all transcripts 
         window.parent.postMessage({action: 'get-transcripts'}, '*')

        // Start Recognition if unmuted
        if(!this.state.isMuted) {
            console.debug("Recognition Start")
            this.recognition.start()
        }

        // Executes when receiving results from speech recognition
        this.recognition.onresult = (event) => {
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i][0].confidence <= 0) continue;
                
                if (event.results[i].isFinal && event.results[i][0].confidence >= 0.3) {
                    let char = this.state.transcript ? '. ' : ''
                    let transcript = event.results[i][0].transcript
                    let finalTranscript = transcript.charAt(0).toUpperCase() + transcript.slice(1)
                    this.setState({transcript: this.state.transcript + char + finalTranscript})
                    window.parent.postMessage({action: 'update-transcripts', text: finalTranscript}, '*')
                    // console.debug(this.state.transcript)
                }
            }
            
        }

        // Executes when speech recognition ends
        this.recognition.onspeechend = () => {
            console.debug("Recognition Stop")
            this.recognition?.stop()
        }

        // Executes when speech recognition cannot find any match
        this.recognition.onnomatch = (event) => {
            console.warn("No Recognition Match")
        }

        // Executes when speech recognition produces an error
        this.recognition.onerror = (event) => {
            console.error(`Error occurred in recognition: ${event.error}`)
        }

        window.addEventListener('message', e => {

            if(e.data.action == 'send-transcripts'){
                this.setState({transcripts: e.data.transcripts})
            }

            if(e.data.action == 'is-muted'){
                if(this.recognition){

                    if(!e.data.isMuted && this.state.isMuted){
                        console.debug("Recognition Start")
                        this.setState({isMuted: false})
                        this.recognition.start()
                    }
                    else if(e.data.isMuted && !this.state.isMuted){
                        console.debug("Recognition Stop")
                        this.setState({isMuted: true})
                        this.recognition.stop()

                    }

                }
            }
        })

        // setInterval(this.getTranscripts, 250)
        window.parent.postMessage({action: 'get-transcripts'}, '*')

    }

    componentWillUnmount(){
       this.recognition?.stop()
    }
    
    /** Fetches array of all transcripts from plugin */
    getTranscripts= () => {
        window.parent.postMessage({action: 'get-transcripts'}, '*')
    }

    /** Render */
    render = () => <>

        {this.state.transcripts.map(transcript => <> 
            <div style={{color: 'white', fontSize: 16}}>{transcript.name}</div>
            <div style={{color: 'white', fontSize: 12, margin: '10px 0px'}}>{transcript.text}</div>
        </>)}
       
    
    </>

}

// Render app
let appContainer = document.createElement('div')
appContainer.id = 'react-app'
document.body.appendChild(appContainer)
let root = createRoot(appContainer)
root.render(<App />)