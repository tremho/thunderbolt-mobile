
import ComponentBase from '../ComponentBase'
import * as components from '../ComponentExport'

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
                console.log(`> data for ${item.name}`)
                console.log(`> create slot child of ${cname}`)
                for (let p of Object.getOwnPropertyNames(cprops)) {
                    let v = cprops[p]
                    // preconvert % items
                    v = replaceVarItems(v, item, vars)
                    console.log(` > inner expression for ${p} (${cprops[p]}) = "${v}"`)
                    cprops[p] = v
                }
                const sc = createComponent(cname, cprops)
                this.addChild(sc)
            }
        }


        console.log("<<<<<")
    }

}

function replaceVarItems(v:string = '', item:any, vars:any):string {
    const pparts = v.split('$')
    let out = ''
    for(let pi of pparts) {
        if(!pi) continue
        let opi = pi
        let ri = pi.indexOf('%')
        let rn = ''
        let re = 0
        if(ri !== -1) {
            rn = pi.substring(ri+1)
            let m = rn.match( /\s/)
            re = (m && m.index) || rn.length
            rn = rn.substring(0, re)
            let rv = ''
            if(rn) { rv = vars[rn] || '' }
            pi = pi.substring(0,ri)  + rv
        }
        try {pi = eval(pi)} catch(e) {}
        if(ri !== -1) pi += opi.substring(ri+re+1)
        out += pi
    }
    return out
}

function createComponent(cname:string, cprops:any) {
    // @ts-ignore
    const CC = components[cname]
    let comp = new CC()
    for(let p of Object.getOwnPropertyNames(cprops)) {
        comp.set(p, cprops[p])
    }
    return comp

}