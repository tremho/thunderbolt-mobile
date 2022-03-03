
import {View, StackLayout, PercentLength} from '@nativescript/core'
import ComponentBase from "../ComponentBase"

export class TBStackLayout extends StackLayout {
    private util?:ComponentBase
    constructor() {
        super()

        this.set('height', this.get('height') || '100%')
        this.set('width', this.get('width') || '100%')
        this.set('horizontalAlignment', this.get('horizontalAlignment') || 'left')
        this.on('layoutChanged', () => {
            let cv = this as unknown as View
            if(!this.util) { // do only once
                this.util = new ComponentBase(cv)
                this.util.listenToAllGestures(cv, 'action')
            }
        })
    }
}

