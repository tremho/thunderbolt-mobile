
import ComponentBase from '../ComponentBase'

import {Label, Color} from '@nativescript/core'

export class SimpleLabel extends ComponentBase {
    private label:Label = new Label()

    // Override to create our button
    public createControl() {
        // no need to call super, because it doesn't exist
        let text = this.get('text') || 'simple-label'
        text = this.evalExpressionString(text, this)
        // console.log('in simple-label with text', text)
        this.container.addChild(this.label)
        this.addBinding(this.label, 'text', 'text')
        setTimeout(() => {
            this.setDynamicExpressions(this.get('text') || 'simple-label', this.label, 'text')
            // this.label.set('text', text)
        })
    }

}


