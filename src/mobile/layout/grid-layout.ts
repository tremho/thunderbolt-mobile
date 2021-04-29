
import ComponentBase from '../ComponentBase'

import {GridLayout} from '@nativescript/core'

export class TBGridLayout extends ComponentBase {
    private grid:GridLayout = new GridLayout()

    public createControl() {
        // this.grid
        // todo: all the properties
        // areas
        // gridTemplateColumns, gridTemplateRows
        // gridTemplate
        // gridAutoColumns, gridAutoRows,
        // gridAutoFLow
        // cm.parseFits(props)
        this.container.addChild(this.grid)
    }

}


