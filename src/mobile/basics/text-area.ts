
import ComponentBase from '../ComponentBase'

import {TextView, Color} from '@nativescript/core'

export class TextArea extends ComponentBase {
    private textView:TextView = new TextView()

    // Override to create our button
    public createControl() {
        this.container.addChild(this.textView)
    }

    protected setProperties() {
        this.setDynamicExpressions(this.get('text') || 'text-area', this.textView, 'text', 'text')
    }

}


