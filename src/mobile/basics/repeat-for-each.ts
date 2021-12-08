
import ComponentBase from '../ComponentBase'
import {Color} from "@nativescript/core";

export class RepeatForEach extends ComponentBase {
    // Override to create our label
    public createControl() {
        console.log('>> repeat-for-each')
        for(let p of Object.getOwnPropertyNames(this)) {
            console.log(`  ${p} = `, typeof this.get(p))

        }
        console.log("<<<<<")
    }

}


