
import ComponentBase from '../ComponentBase'

import {Button} from '@nativescript/core'


export class SimpleButton extends ComponentBase {
    private button:Button = new Button()

    // Override to create our button
    public createControl() {
        this.props = {
            text: {component: this.button, locprop: 'text', value: this.get('text')}
        }
        this.textComponent = this.button // so ComCommon will align text
        this.component.addChild(this.button)
        if(this.get('action')) this.listenToAllGestures(this.component, 'action')

    }

    // protected setProperties() {
    //     this.setDynamicExpressions(this.get('text') || '$text', this.button, 'text')
    // }

}

