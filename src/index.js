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

    /** Called on load */
    onLoad() {

        // Create a button in the toolbar
        // this.menus.register({
        //     icon: this.paths.absolute('button-icon.png'),
        //     text: 'CC',
        //     action: () => this.onButtonPress()
        // })

         // Create a button in the toolbar
         this.menus.register({
            icon: this.paths.absolute('subtitles.svg'),
            text: 'Captions',
            panel: {
                iframeURL: this.paths.absolute('ui-build/panel/index.html')
            }
        })

    }

    /** Called when the user presses the action button */
    onButtonPress() {

        // Show alert
        this.menus.alert(`Hello from ${MyPlugin.name} version ${require('../package.json').version}!`, 'Hello world!', 'info')

    }

}
