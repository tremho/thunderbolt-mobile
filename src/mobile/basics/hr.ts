
import ComponentBase from '../ComponentBase'

import {Label, Color} from '@nativescript/core'

export class Hr extends ComponentBase {
    private label:Label = new Label()

    // Override to create our label
    public createControl() {
        this.props = {
            // our component property identified by the key (text)
            // is represented by inner 'component' (this.label) at its property (text)
            // and its parseable value comes from 'value' {this.get('text')}
            text: {component: this.label, locprop: 'text', value: 'This is a horizontal rule'}
        }
        this.label.set('text', 'This is a horizontal rule')
        this.label.set("whiteSpace", "nowrap")
        this.label.set("textWrap", false)
        this.textComponent = this.label // so ComCommon will align text
        this.component.addChild(this.label)
        // set the default alignment of component to the left. The {N} default appears to be center.
        this.label.set('horizontalAlignment', 'left')
        this.label.set('borderColor', 'black')
        this.label.set('borderWidth', 2)
        this.label.set('width', '100%')
        this.label.set('height', 1)
        this.label.className = 'hr'
        this.set('horizontalAlignment', 'left')
        if(this.get('action')) this.setActionResponder(this.label, 'tap', 'action')
    }

    // protected setProperties() {
    //     this.setDynamicExpressions(this.get('text') || '$text', this.label, 'text', 'text')
    // }

}


