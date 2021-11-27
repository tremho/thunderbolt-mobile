
import ComponentBase from '../ComponentBase'

import {Label, Color} from '@nativescript/core'

export class SimpleLabel extends ComponentBase {
    private label:Label = new Label()
    private value:Label = new Label()

    // Override to create our label
    public createControl() {
        this.props = {
            // our component property identified by the key (label)
            // is represented by inner 'component' (this.label) at its property (text)
            // and its parseable value comes from 'label' {this.get('label')}
            label: {component: this.label, locprop: 'text', value: this.get('label')},
            // ditto for value
            value: {component: this.value, locprop: 'text', value: this.get('value')}
        }
        // this.label.set('text', 'SIMPLE-LABEL')
        this.label.set("whiteSpace", "nowrap")
        this.label.set("textWrap", false)
        this.textComponent = this.label // so ComCommon will align text
        this.component.addChild(this.label)
        this.component.addChild(this.value)
        // set the default alignment of component to the left. The {N} default appears to be center.
        this.label.set('horizontalAlignment', 'left')
        this.value.set('horizontalAlignment', 'left')
        this.set('horizontalAlignment', 'left')
        if(this.get('action')) this.setActionResponder(this.label, 'tap', 'action')
        if(this.get('action')) this.setActionResponder(this.value, 'tap', 'action')
    }

}


