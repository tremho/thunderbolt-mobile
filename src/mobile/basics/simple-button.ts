
import ComponentBase from '../ComponentBase'

import {Button} from '@nativescript/core'


export class SimpleButton extends ComponentBase {
    private button:Button = new Button()

    // Override to create our button
    public createControl() {
        // no need to call super, because it doesn't exist
        // this.button
        this.button.text = this.get('text') || 'simple-button'
        this.setActionResponder(this.button, 'tap', 'action')
        this.container.addChild(this.button)
        // this.addBinding(this.button, 'btnName', 'text')
    }

}

