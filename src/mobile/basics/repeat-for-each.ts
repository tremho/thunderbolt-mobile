
import ComponentBase from '../ComponentBase'
import {View} from "@nativescript/core";

const ignoreProps = [
    "pseudoClassAliases",
    "cssClasses",
    "cssPseudoClasses",
    "textComponent",
    "defaultProps",
    "state",
    "tagName",
    "props",
    "component",
    "container",
    "comNormal",
    "parent",
    "effectivePaddingTop",
    "effectivePaddingRight",
    "effectivePaddingBottom",
    "effectivePaddingLeft",
    "nativeViewProtected",
    "layoutChangeListenerIsSet",
    "layoutChangeListener",
    "b",
    "com",
    "cm"
]

export class RepeatForEach extends ComponentBase {
    private slots:View[] | null = null
    // Override to create our label
    public createControl() {
        console.log('>> repeat-for-each')
        const props:any = {}
        let subject:any[] = []
        for(let p of Object.getOwnPropertyNames(this)) {
            if(p.charAt(0) === '_' || ignoreProps.indexOf(p) !== -1) continue
            if(p === 'subject') subject = this.get(p)
            else props[p] = this.get(p)
        }
        console.log('props', props)

        // clear all children / collect slot children
        let collecting = false
        if(!this.slots) {
            this.slots = []
            collecting = true
        }
        let n = this.getChildrenCount();
        while(--n >=0) {
            let ch = this.getChildAt(n)
            console.log('existing child', ch)
            if(collecting) this.slots.push(ch)
            this.removeChild(ch)
        }
        // then add the children back per repeat
        for(let item of subject) {
            for(let c of this.slots) {
                let cname = c.constructor.name
                let cprops:any = {}
                for(let p of Object.getOwnPropertyNames(c)) {
                    if(p.charAt(0) === '_' || ignoreProps.indexOf(p) !== -1) continue
                    cprops[p] = c.get(p)
                }
                console.log('> we want to create ', cname, 'with', cprops)

            }
        }


        console.log("<<<<<")
    }

}


