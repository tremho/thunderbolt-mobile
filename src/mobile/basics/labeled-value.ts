
import ComponentBase from '../ComponentBase'

import {Label, Color} from '@nativescript/core'

export class LabeledValue extends ComponentBase {
    private cLabel:Label = new Label()

    // Override to create our label
    public createControl() {
        this.props = {
            // our component property identified by the key (text)
            // is represented by inner 'component' (this.label) at its property (text)
            // and its parseable value comes from 'value' {this.get('text')}
            text: {component: this.cLabel, locprop: 'text', value: this.get('label')}
        }
        this.cLabel.set('text', 'L-Value')
        this.cLabel.set("whiteSpace", "nowrap")
        this.cLabel.set("textWrap", false)
        this.textComponent = this.cLabel // so ComCommon will align text
        this.component.addChild(this.cLabel)
        // set the default alignment of component to the left. The {N} default appears to be center.
        this.cLabel.set('horizontalAlignment', 'left')
        this.set('horizontalAlignment', 'left')
        if(this.get('action')) this.setActionResponder(this.cLabel, 'tap', 'action')
    }

}


