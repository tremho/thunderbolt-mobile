
import ComponentBase from '../ComponentBase'

import {StackLayout} from '@nativescript/core'

export class TBStackLayout extends ComponentBase {
    private stack:StackLayout = new StackLayout()

    public createControl() {
        // this.stack
        this.stack.orientation = this.get('orientation')
        this.container.addChild(this.stack)
    }

}


