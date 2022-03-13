
import ComponentBase from '../ComponentBase'

import {TextView, Color} from '@nativescript/core'

export class TextArea extends ComponentBase {
    private textView:TextView = new TextView()

    // Override to create our control
    public createControl() {
        this.props = {
            text: {component: this.textView, locprop: 'text', value: this.get('text')}
        }
        this.textComponent = this.textView // so ComCommon will align text
        this.textView.className = 'TextArea'
        this.component.addChild(this.textView)
        if(this.get('action')) this.listenToAllGestures(this.textView, 'action')

    }

}


