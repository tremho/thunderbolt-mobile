
import ComponentBase from '../ComponentBase'

import {ScrollView, StackLayout} from '@nativescript/core'

// Just a clone of the Nativescript one. Note we need to put a StackLayout under it in markup
export class TBScrollView extends ScrollView {

    constructor() {
        super()
        let ha = this.horizontalAlignment
        if(!ha || ha === 'stretch') ha = 'left' // stretch is the default, we want left
        this.horizontalAlignment = ha
    }

}


