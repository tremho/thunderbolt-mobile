
import ComponentBase from '../ComponentBase'

import {Button} from '@nativescript/core'


export class SimpleButton extends ComponentBase {
    private button:Button = new Button()

    // Override to create our button
    public createControl() {
        this.setActionResponder(this.button, 'tap', 'action')
        this.container.addChild(this.button)
        // this.addBinding(this.button, 'btnName', 'text')
    }

    protected setProperties() {
        this.button.text = this.get('text') || 'simple-button'
    }

}

