
import ComponentBase from '../ComponentBase'
import {Color} from "@nativescript/core";

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
    // Override to create our label
    public createControl() {
        console.log('>> repeat-for-each')
        const props:any = {}
        for(let p of Object.getOwnPropertyNames(this)) {
            if(p.charAt(0) === '_' || ignoreProps.indexOf(p) !== -1) continue
            props[p] = this.get(p)
        }
        console.log('props', props)
        console.log("<<<<<")
    }

}


