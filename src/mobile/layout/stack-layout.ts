
import {View, StackLayout, PercentLength} from '@nativescript/core'
import ComponentBase from "../ComponentBase"

export class TBStackLayout extends StackLayout {
    private util:ComponentBase = new ComponentBase()
    constructor() {
        super()
        this.set('height', this.get('height') || '100%')
        this.set('width', this.get('width') || '100%')
        this.set('horizontalAlignment', this.get('horizontalAlignment') || 'left')
        this.util.listenToAllGestures(this as unknown as View, 'action')
    }
}

