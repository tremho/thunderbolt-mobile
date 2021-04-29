
import ComponentBase from '../ComponentBase'

import {FlexboxLayout} from '@nativescript/core'

export class FlexLayout extends ComponentBase {
    private flex:FlexboxLayout = new FlexboxLayout()

    // Override to create our button
    public createControl() {
        // this.flex
        // todo: all the props:
        // orientation, wrap, justify(content), align(items)

        this.container.addChild(this.flex)
    }

}


