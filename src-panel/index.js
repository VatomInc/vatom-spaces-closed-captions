import React from 'react';
import { createRoot } from 'react-dom/client'

/** Main app */
class App extends React.PureComponent {

    componentDidMount(){
        
    }

    /** Render */
    render = () => <>
    
        <center>
            <img src={require('./waving-hand.svg')} style={{ height: 48, marginTop: 40, marginBottom: 20 }} />
            <div style={{ color: 'white', fontFamily: 'sans-serif', fontSize: 15 }}>Hello from React!</div>
        </center>
    
    </>

}

// Render app
let appContainer = document.createElement('div')
appContainer.id = 'react-app'
document.body.appendChild(appContainer)
let root = createRoot(appContainer)
root.render(<App />)