
import ComponentBase from '../ComponentBase'

import {Button} from '@nativescript/core'


export class SimpleButton extends ComponentBase {
    private button:Button = new Button()

    // Override to create our button
    public createControl() {
        this.textComponent = this.button // so ComCommon will align text
        this.component.addChild(this.button)
        this.setActionResponder(this.button, 'tap', 'action')
    }

    protected setProperties() {
        this.setDynamicExpressions(this.get('text') || '$text', this.button, 'text')
    }

}

