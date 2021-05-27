
import ComponentBase from '../ComponentBase'

import {StackLayout} from '@nativescript/core'

export class TBStackLayout extends ComponentBase {
    private stack:StackLayout = new StackLayout()

    public createControl() {
        this.stack.orientation = this.get('orientation')
        this.container.addChild(this.stack)
        this.defaultProps = {
            width: "100%",
            height: "100%",
            align: "left"
        }
    }
    protected setProperties() {
    }

}


