
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
    private slots:any[] | null = null
    // Override to create our label
    public createControl() {
        console.log('>> repeat-for-each')
        const vars:any = {}
        let subject:any[] = []
        for(let p of Object.getOwnPropertyNames(this)) {
            if(p.charAt(0) === '_' || p === 'slots' || ignoreProps.indexOf(p) !== -1) continue
            if(p === 'subject') subject = this.com.evaluateBindExpression(this.get(p), true).value
            else vars[p] = this.get(p)
        }
        console.log('vars (pre-parsed)', vars)
        for(let vp of Object.getOwnPropertyNames(vars)) {
            let ex = vars[vp]
            vars[vp] = this.com.evaluateBindExpression(vars[vp], true).value
        }
        console.log('vars (parsed)', vars)

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
            if(collecting) {
                let cprops:any = {}
                for(let p of Object.getOwnPropertyNames(ch)) {
                    if(p.charAt(0) === '_' || ignoreProps.indexOf(p) !== -1) continue
                    let v = ch.get(p)
                    if(typeof v === 'string' || typeof v === 'number') {
                        cprops[p] = ''+v
                    }
                }
                this.slots.push({view:ch, props:cprops})
            }
            this.removeChild(ch)
        }
        // then add the children back per repeat
        for(let item of subject) {
            for(let si of this.slots) {
                let cname = si.view.constructor.name
                let cprops = si.props
                console.log(`> create slot child of ${cname}`)
                for (let p of Object.getOwnPropertyNames(cprops)) {
                    let v = cprops[p]
                    // preconvert % items
                    v = replaceVarItems(v, item, vars)
                    console.log(` > inner expression for ${p} (${cprops[p]}) = "${v}"`)
                }
            }
        }


        console.log("<<<<<")
    }

}


function replaceVarItems(v:string = '', item:any, vars:any):string {
    let n = v.indexOf('$')
    if(n === -1) return '';
    let plit = v.substring(0, n)
    let pn = v.substring(n+1)
    let m = pn.match(/[^a-zA-Z0-9.]/)
    let pe = (m && m.index) || pn.length
    pn = pn.substring(0, pe)

    let vi = pn.indexOf('%')
    let vv = ''
    while(vi !== -1) {
        let vn = pn.substring(vi+1)
        let m = vn.match(/[^a-zA-Z0-9.]/)
        let ve = (m && m.index) || vn.length
        vn = vn.substring(0, ve)
        vv = ''+ vars[vn]
        pn = pn.substring(0, vi)+vv+pn.substring(ve)
        vi = pn.indexOf('%')
    }

    //>> evaluating $item.diameter $kilometers item.diameter
    // @ts-ignore
    v = pn
    let ip = v.substring(5).trim()
    let lit = v.substring(5+ip.length)
    v = plit+ item[ip] + lit
    return v
}

