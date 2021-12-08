
import ComponentBase from '../ComponentBase'
import {Color} from "@nativescript/core";

export class RepeatForEach extends ComponentBase {
    // Override to create our label
    public createControl() {
        const subject = this.get("subject")
        const propList:string[] = []
        const keys = Object.getOwnPropertyNames(this)
        for(let k of keys) {
            if(typeof super.get(k) === 'undefined') {
                propList.push(k)
            }
        }
        const props:any = {}
        for(let p of propList) {
            props[p] = this.get(p)
        }
        console.log('>> repeat-for-each with props', props)
        this.set('width', '100%')
        this.set('height','100');
        this.borderWidth = 2;
        this.borderColor = new Color('black')
        this.set('horizontalAlignment', 'center')
        if(this.get('action')) this.setActionResponder(this.component, 'tap', 'action')
    }

}


