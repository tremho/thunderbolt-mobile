
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
        console.log('>> hr setting text')
        this.label.set('text', 'This is a horizontal rule')
        console.log('>> hr setting other props')
        this.label.set("whiteSpace", "nowrap")
        this.label.set("textWrap", false)
        this.textComponent = this.label // so ComCommon will align text
        console.log('>> hr label added as child')
        this.component.addChild(this.label)
        // set the default alignment of component to the left. The {N} default appears to be center.
        console.log('>> hr setting alignment')
        this.label.set('horizontalAlignment', 'center')
        console.log('>> hr setting color')
        this.label.set('backgroundColor', 'black')
        this.label.set('color', 'pink')
        this.label.set('width', '100%')
        this.label.set('height', '10')
        this.label.className = 'hr'
        this.set('horizontalAlignment', 'left')
        if(this.get('action')) this.setActionResponder(this.label, 'tap', 'action')
    }

    // protected setProperties() {
    //     this.setDynamicExpressions(this.get('text') || '$text', this.label, 'text', 'text')
    // }

}


