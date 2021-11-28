
import ComponentBase from '../ComponentBase'

import {Label, Color} from '@nativescript/core'

export class LabeledValue extends ComponentBase {
    private cLabel:Label = new Label()
    private cValue:Label = new Label()

    // Override to create our label
    public createControl() {
        this.props = {
            // our component property identified by the key (text)
            // is represented by inner 'component' (this.label) at its property (text)
            // and its parseable value comes from 'value' {this.get('text')}
            label: {component: this.cLabel, locprop: 'text', value: this.get('label')},
            value: {component: this.cValue, locprop: 'text', value: this.get('value')},
        }
        this.cLabel.className = 'label'
        this.cLabel.set("whiteSpace", "nowrap")
        this.cLabel.set("textWrap", false)
        this.textComponent = this.cLabel // so ComCommon will align text
        this.cValue.className = 'value'
        this.cValue.set("whiteSpace", "nowrap")
        this.cValue.set("textWrap", false)
        this.component.orientation = 'horizontal'
        this.component.addChild(this.cLabel)
        this.component.addChild(this.cValue)
        // set the default alignment of component to the left. The {N} default appears to be center.
        this.cLabel.set('horizontalAlignment', 'left')
        this.cValue.set('horizontalAlignment', 'left')
        this.set('horizontalAlignment', 'left')
        if(this.get('action')) this.setActionResponder(this.component, 'tap', 'action')
    }

}


