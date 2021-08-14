
import ComponentBase from '../ComponentBase'

import {TextView, Color} from '@nativescript/core'

export class TextArea extends ComponentBase {
    private textView:TextView = new TextView()

    // Override to create our control
    public createControl() {
        this.textComponent = this.textView // so ComCommon will align text
        this.textView.className = 'TextArea'
        this.component.addChild(this.textView)
    }

    protected setProperties() {
        this.setDynamicExpressions(this.get('text') || 'text-area', this.textView, 'text', 'text')
    }

}


