import {StackLayout, View} from '@nativescript/core'

class EventData {
    app:any|undefined
    sourceComponent:any|undefined
    tag:string|undefined
    eventType: string|undefined
    platEvent: string|undefined
}

export const appBridge:any = {
}

export function getTheApp() {
    // @ts-ignore
    return appBridge.getTheApp()
}
let ComCommon:any, LocalBind:any

export default class ComponentBase extends StackLayout {
    private _isInit: boolean = false
    protected container: any
    public com: any
    private localBinds:any[] | undefined

    public static bridgeAppGetter(getter:any, comCommon:any) {
        appBridge.getTheApp = getter
        appBridge.comCommon = comCommon
        ComCommon = comCommon.ComCommon
        LocalBind = comCommon.LocalBind
    }

    constructor() {
        super()
        try {
            this.container = this
            this.on('layoutChanged', () => {
                console.log('in layoutChanged')
                if (!this._isInit) {
                    this._isInit = true
                    this.com = new ComCommon(this)
                    this.com.waitForModel().then(() => {
                        console.log('past waitReady')
                        // must occur on a nominal timeout to work across platforms
                        setTimeout(() => {
                            console.log('executing timeout -- creating component')
                            this.localBinds = []
                            this.createControl()
                            console.log('localBinds', this.localBinds)
                            if(this.com) {
                                try {
                                    // @ts-ignore
                                    this.beforeLayout && this.beforeLayout()
                                } catch(e) {
                                    console.error('Error in  "'+'UNNAMED COMPONENT'+' beforeLayout"', e)
                                }
                                this.com.bindComponent()
                                this.com.setLocalBinds(this.localBinds)
                                this.com.componentIsReady()
                            }
                        })
                    })
                }
            })
        } catch (e) {
            // Log.exception(e)
            console.error(e)
            throw e
        }
    }

    /**
     * Implement in the control.
     * Create the view hierarchy of the control, starting with `this.container`
     * and call `this.addBinding` for each view and property that is to be bound
     * to the local namespace.
     * Make sure to document the local namespace for your component.
     */
    protected createControl() {
        throw Error('createControl must be implemented in the component!')
    }

    /**
     * Set an internal view and one of its properties to be bound to
     * a local binding name.
     * Note that the local binding name must be established by a bind directive
     * somewhere in the scope.
     *
     * @example:
     *   // to bind the 'text' property of a Label to the locally bound value 'name':
     *   this.addBinding(label, 'name', 'text')
     *
     * @param view
     * @param bindLocalName
     * @param viewProperty
     */
    public addBinding(view:any, bindLocalName:string, viewProperty:string) {
        let lb = [view, bindLocalName, viewProperty]
        if(this.localBinds) this.localBinds.push(lb)
    }

    /**
     * Call here to register event handlers for the inner control views of a component
     *
     * @param {View} view The inner control view the event refers to
     * @param {string} eventName Name of the event to listen to
     * @param {string} tag Name of the property we registered the handler name with
     * @protected
     *
     * @example:
     * // suppose markup is <tb:MyComponent action="onClick"/>
     * // and the code implements an innerView like a button as part of the construction.
     * // then registering a 'tap' event handler for this could be:
     *   setActionResponder(innerView, 'tap', 'action')
     * // and the tap event will appear at the 'onClick' function of the activity code
     * // (assuming 'onClick' is a function there).
     *
     */
    protected setActionResponder(view:any, eventName:string, tag:string = 'action') {
        const target = this.get(tag)
        const ed = new EventData()
        ed.app = getTheApp()
        ed.sourceComponent = view as any
        ed.eventType = eventName
        ed.tag = tag
        view.on(eventName, (ev:any) => {
            console.log('Event occurs', eventName)
            ed.platEvent = ev
            const app = getTheApp()
            // console.log('>>>>>>>>>>>> getting activity from app', app, ed.app)
            const activity = app.currentActivity
            console.log('activity found', activity)
            console.log('should call '+target)
            if(activity && typeof activity[target] === 'function') {
                activity[target](ed)
            }
        })
    }

    protected evalExpressionString(str:string, component:any) {
        let pos = 0
        while(pos < str.length) {
            let xsn = str.indexOf('$', pos)
            if (xsn !== -1) {
                if (str.charAt(xsn - 1) !== '\\') {
                    component.bound = component.bindingContext // just to make sure this is set
                    const lit = str.substring(0, xsn++)
                    let xnn = str.indexOf(' ', xsn)
                    if (xnn == -1) xnn = str.indexOf(',', xsn) // todo: really should break on non-alphanum
                    if (xnn == -1) xnn = str.length
                    const expr = str.substring(xsn, xnn)
                    const postLit = str.substring(xnn)
                    str = lit + component.b(expr) + postLit
                }
                pos = xsn+1
            } else {
                break;
            }
        }
        return str
    }
}



