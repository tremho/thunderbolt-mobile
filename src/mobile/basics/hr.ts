
import ComponentBase from '../ComponentBase'

import {Label, Color} from '@nativescript/core'

export class Hr extends ComponentBase {
    private label:Label = new Label()

    // Override to create our label
    public createControl() {
        console.log('>> hr setting other props')
        this.label.set("whiteSpace", "nowrap")
        this.label.set("textWrap", false)
        this.textComponent = this.label // so ComCommon will align text
        console.log('>> hr label added as child')
        this.component.addChild(this.label)
        // set the default alignment of component to the left. The {N} default appears to be center.
        console.log('>> hr setting alignment')
        this.label.set('horizontalAlignment', 'center')
        this.label.set('verticalAlignment', 'top')
        console.log('>> hr setting color')
        this.label.set('backgroundColor', 'black')
        this.label.set('width', '100%')
        this.label.set('height', '2')
        this.label.className = 'hr'
        this.set('horizontalAlignment', 'left')
        console.log('>> hr done')
    }

    // protected setProperties() {
    //     this.setDynamicExpressions(this.get('text') || '$text', this.label, 'text', 'text')
    // }

}


