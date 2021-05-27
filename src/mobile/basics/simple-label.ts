
import ComponentBase from '../ComponentBase'

import {Label, Color} from '@nativescript/core'

export class SimpleLabel extends ComponentBase {
    private label:Label = new Label()

    // Override to create our button
    public createControl() {
        this.label.set("whiteSpace", "nowrap")
        this.label.set("textWrap", false)
        this.container.addChild(this.label)
    }

    protected setProperties() {
        this.setDynamicExpressions(this.get('text') || 'simple-label', this.label, 'text', 'text')
    }

}


