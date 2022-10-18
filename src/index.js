/**
 * This is the main entry point for your plugin.
 *
 * All information regarding plugin development can be found at
 * https://developer.vatom.com/plugins/plugins/
 *
 * @license MIT
 * @author Vatom Inc.
 */
export default class ClosedCaptionPlugin extends BasePlugin {

    /** Plugin info */
    static id = "closed-captions"
    static name = "Closed Captions"
    static description = "Enables ability to provide closed captions for microphone audio"

    transcripts = []

    /** Called on load */
    async onLoad() {

        // Create a button in the toolbar
        this.menus.register({
            icon: this.paths.absolute('subtitles.svg'),
            text: 'Captions',
            panel: {
                iframeURL: this.paths.absolute('ui-build/panel/index.html')
            }
        })

        this.userID = await this.user.getID()
        this.userName = await this.user.getDisplayName()
        this.transcripts = await this.getField('transcripts') || []
        
        console.group("TRANSCRIPTS")
        console.log(this.transcripts)
        console.groupEnd()

        setInterval(this.isUserMuted, 100)
    }

    onMessage = async e => {

        // Send transcripts to panel
        if(e.action == 'get-transcripts') {
            this.menus.postMessage({action: 'send-transcripts', transcripts: this.transcripts}, '*')
        }

        // Update saved transcripts
        if(e.action == 'update-transcripts') {
            
            let index = this.transcripts.findIndex(t => t.id == this.userID);
            
            if(index == -1) {
                let transcript = {id: this.userID, name: this.userName, text: e.text}
                this.transcripts.push(transcript)
            }
            else {
                this.transcripts[index].text += e.text
            }

            await this.setField('transcripts', this.transcripts)
            
            this.menus.postMessage({action: 'send-transcripts', transcripts: this.transcripts}, '*')
            this.messages.send({action: 'refresh-transcripts', userID: this.userID, transcripts: this.transcripts})
        }

        // Called when transcript have been changed
        if(e.action == 'refresh-transcripts'){
            
            // Don't need to refresh if we sent the message
            if(this.userID == e.userID){
                return
            }

            this.transcripts = e.transcripts
            this.menus.postMessage({action: 'send-transcripts', transcripts: e.transcripts}, '*')
        }

    }

    /** Returns true if user is muted, false if otherwise, Sends result to panel */
    isUserMuted = async () =>{
        let isMuted = await this.user.isMuted()
        this.menus.postMessage({action: 'is-muted', isMuted: isMuted}, '*')
    }
}
