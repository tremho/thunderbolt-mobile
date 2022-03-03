
import {View, StackLayout, PercentLength} from '@nativescript/core'
import ComponentBase from "../ComponentBase"

export class TBStackLayout extends StackLayout {
    private util:ComponentBase
    constructor() {
        super()
        let cv = this as unknown as View
        this.util = new ComponentBase(cv)
        this.set('height', this.get('height') || '100%')
        this.set('width', this.get('width') || '100%')
        this.set('horizontalAlignment', this.get('horizontalAlignment') || 'left')
        this.on('layoutChanged', () => {
            this.util.listenToAllGestures(cv, 'action')
        })
    }
}

