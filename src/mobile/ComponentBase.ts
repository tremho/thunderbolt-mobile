import {StackLayout, View} from '@nativescript/core'
import {TBContent} from "./tb-page";

import {ComNormal} from '../common-core/ComNormal'

export class EventData {
    app:any|undefined
    sourceComponent:any|undefined
    tag:string|undefined
    eventType: string|undefined
    platEvent: string|undefined
    value?:any
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
    protected textComponent:any = null
    protected defaultProps:any = {}
    protected container: any
    protected component: any
    protected tagName:string = ''
    public com: any
    public cm: any // same as com
    public b:any // comBinding eval
    private localBinds:any[] | undefined
    private comNormal: ComNormal;

    public static bridgeAppGetter(getter:any, comCommon:any) {
        appBridge.getTheApp = getter
        appBridge.comCommon = comCommon
        ComCommon = comCommon.ComCommon
        LocalBind = comCommon.LocalBind
    }

    constructor() {
        super()
        try {
            this.component = this
            this.container = this // TODO: for backward compatibility. deprecated
            this.comNormal = new ComNormal(this)
            this.on('layoutChanged', () => {
                if(!this._isInit) {
                    this._isInit = true
                    this.com = new ComCommon(this)
                    this.cm = this.com // duplicate, but named like this on desktop side
                    this.b = this.cm.evalBinding
                    this.com.waitForModel().then(() => {
                        // console.log('>>>>>>>>>> ***** past waitReady')
                        // must occur on a nominal timeout to work across platforms
                        setTimeout(() => {
                            // console.log('executing timeout -- creating component')
                            let className = this.get('class') || this.get('className') || ''
                            className += (className ? ' ' : '')+this.constructor.name
                            this.className = className
                            this.tagName = className
                            this.localBinds = []
                            this.createControl()
                            // console.log('localBinds', this.localBinds)
                            if(this.com) {
                                try {
                                    // @ts-ignore
                                    this.beforeLayout && this.beforeLayout()
                                } catch(e) {
                                    console.error('Error in  "'+className+' beforeLayout"', e)
                                }
                                setTimeout(() => {
                                    this.com.setCommonPropsMobile(this, this.defaultProps)
                                    this.com.bindComponent()
                                    this.setProperties()
                                    this.com.setLocalBinds(this.localBinds)
                                    try {
                                        // @ts-ignore
                                        this.afterLayout && this.afterLayout()
                                    } catch(e) {
                                        console.error('Error in  "'+className+' afterLayout"', e)
                                    }
                                    this.com.componentIsReady()
                                })
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

    // custom component lifecycle methods (mimicking similar in riot)
    protected beforeLayout() {
        if(this.preStdOnMounted) {
            try {
                this.preStdOnMounted()
            } catch(e) {
                console.error(e)
            }
        }
    }
    protected afterLayout() {
        if(this.postStdOnMounted) {
            try {
                this.postStdOnMounted()
            } catch(e) {
                console.error(e)
            }
        }
    }

    protected preStdOnMounted() {
        // init and constructional operations
    }
    protected postStdOnMounted() {
        // after layout and binding has occurred
    }
    protected preStdOnBeforeUpdate() {
        // dynamic tweaks to appearance (called on bind fire)
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
     * This is called after creation and after beforeLayout (if defined)
     * but before any bindings are made.
     * Set any text or other properties here.  This occurs after a timeout after layout.
     * Note: this is a good place to call setDynamicExpressions at.
     * @protected
     */
    protected setProperties() {
        console.warn('control '+this.constructor.name+' should implement a setProperties method')
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
        if(!view) return;
        view.on(eventName, (ev:any) => {
            this.respondToAction(view, eventName, tag)
        })
    }

    /**
     * Close cousin to `setActionResponder`, but we call this from an event handler we've already captured in
     * rather than have it set up the listener for us
     *
     * @param {View} view The inner control view the event refers to
     * @param {string} eventName Name of the event to listen to
     * @param {string} tag Name of the property we registered the handler name with
     * @protected
     */
    protected respondToAction(view:any, event:any, eventName:string, tag:string = 'action', value?:any) {
        const target = this.get(tag)
        const ed = new EventData()
        ed.app = getTheApp()
        ed.sourceComponent = view as any
        ed.eventType = eventName
        ed.tag = tag
        ed.value = value
        // console.log('Event occurs', eventName)
        ed.platEvent = event
        const app = getTheApp()
        // console.log('>>>>>>>>>>>> getting activity from app', app, ed.app)
        const activity = app.currentActivity
        // console.log('activity found', activity)
        // console.log('should call '+target)
        if(activity && typeof activity[target] === 'function') {
            activity[target](ed)
        }
    }

    protected setDynamicExpressions(str:string = '', control:View, controlProp:string, bindName?:string) {
        let component = this.findComponentBaseContainer(control)
        let text = this.evalExpressionString(str, component)
        console.log('setting initial text for ', control, text)
        control.set(controlProp, text)
        if(control.bindingContext) control.bindingContext.off('propertyChange')
        let bv = this.com.getComponentAttribute(this, 'bind') // only bind if there is a bind statement
        if(!bv) bv = str.indexOf("$$") !== -1 // or if we are referring to page data
        if(bindName && bv && component.b) {
            this.addBinding(control, bindName, controlProp)
            if(control.bindingContext) {
                // do on change thereafter
                control.bindingContext.on('propertyChange', (ev: any) => {
                    let text = this.evalExpressionString(str, component)
                    // console.log('on propertyChange', control, controlProp, text)
                    control.set(controlProp, text)
                })
            }
        }
    }

    findComponentBaseContainer(control:any) {
        // it's a component base if it has a 'b' function, if not, walk up the parentage tree to find it
        let tc = control
        while(tc) {
            if(tc.b) break;
            tc = tc.parent
        }
        return tc
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
                    let expr = str.substring(xsn, xnn)
                    if(expr.charAt(0) === '$') {
                        expr = 'data.'+expr.substring(1)
                    }
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

    // ComNormal implementation
    get isIOS(): boolean { return this.comNormal.isIOS }
    get isAndroid(): boolean { return this.comNormal.isAndroid }
    get isMobile(): boolean { return this.comNormal.isMobile }
    getProp(propName:string) { return this.comNormal.getProp(propName)}
    elementFind(tag:string):any { return this.comNormal.elementFind(tag) }
    elementFindAll(tag:string):any[] { return this.comNormal.elementFindAll(tag) }
    listenToFor(el:any, pseudoEventTag:string, func:(ed:any)=>{}) { return this.comNormal.listenToFor(el, pseudoEventTag, func) }
    getElementBounds(element:any):any { return this.comNormal.getElementBounds(element) }
    setStyleProp(el:any, prop:string, value:number|string, unit?:string) { return this.comNormal.setStyleProp(el, prop, value, unit)}
}



