
import ComponentBase from '../ComponentBase'

import {Label, Color} from '@nativescript/core'

export class SimpleLabel extends ComponentBase {
    private label:Label = new Label()

    // Override to create our label
    public createControl() {
        this.props = {
            text: {component: this.label, locprop: 'text', value: this.get('text')}
        }
        this.label.set('text', 'SIMPLE-LABEL')
        this.label.set("whiteSpace", "nowrap")
        this.label.set("textWrap", false)
        this.textComponent = this.label // so ComCommon will align text
        this.component.addChild(this.label)
        // set the default alignment of component to the left. The {N} default appears to be center.
        this.label.set('horizontalAlignment', 'left')
        this.set('horizontalAlignment', 'left')
        if(this.get('action')) this.setActionResponder(this.label, 'tap', 'action')
    }

    // protected setProperties() {
    //     this.setDynamicExpressions(this.get('text') || '$text', this.label, 'text', 'text')
    // }

}


