
import {StackLayout, PercentLength} from '@nativescript/core'

export class TBStackLayout extends StackLayout {
    constructor() {
        super()
        this.set('height', this.get('height') || '100%')
        this.set('width', this.get('width') || '100%')
        this.set('horizontalAlignment', this.get('horizontalAlignment') || 'left')
    }
}

