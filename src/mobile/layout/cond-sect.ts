
import ComponentBase from '../ComponentBase'

import {StackLayout} from '@nativescript/core'

export class CondSect extends ComponentBase {
    private stack:StackLayout = new StackLayout()
    private bound:any

    public createControl() {
        let condition:string = this.get('if')
        while(condition.charAt(0) === '$') {
            condition = condition.substring(1)
        }
        if(condition.indexOf('(')) {
            condition = condition.substring(0, condition.indexOf('('))
        }
        this.bound = this.bindingContext
        const meths = this.bindingContext.pageMethods
        if(typeof meths[condition] === 'function') {
            this.set('hidden', !meths[condition].call(this))
        }
    }

    protected setProperties() {
    }

}


