import {StackLayout, View} from '@nativescript/core'
const Platform  = require('@nativescript/core/platform')
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
    protected state:any = {}     // plain object now, holds values rendered at update
    protected tagName:string = ''
    public com: any
    public cm: any // same as com
    public props: any = {}
    public b:any // comBinding eval
    // private localBinds:any[] | undefined
    private comNormal: ComNormal;

    public static bridgeAppGetter(getter:any, comCommon:any) {
        appBridge.getTheApp = getter
        appBridge.comCommon = comCommon
        ComCommon = comCommon.ComCommon
        LocalBind = comCommon.LocalBind
    }

    constructor(forceComponent?:View) {
        super()
        try {
            //@ts-ignore
            this.component = forceComponent || this
            this.container = this.component // TODO: for backward compatibility. deprecated
            // these inits must occur before layout event is waited on, so we can use this class for util purposes.
            this.comNormal = new ComNormal(this.component)
            this.com = new ComCommon(this.component)
            this.cm = this.com // duplicate, but named like this on desktop side
            if(forceComponent) {
                // @ts-ignore
                forceComponent.com = forceComponent.cm = this.com
                this.component.component = this.component
            }
            this.b = this.cm.evalBinding // TODO: This may be obsolete now
            this.on('layoutChanged', () => {
                if(!this._isInit) {
                    this._isInit = true
                    this.com.waitForModel().then(() => {
                        // console.log('>>>>>>>>>> ***** past waitReady')
                        // must occur on a nominal timeout to work across platforms
                        setTimeout(() => {
                            // console.log('executing timeout -- creating component')
                            let className = this.get('class') || this.get('className') || ''
                            className += (className ? ' ' : '')+this.constructor.name
                            this.className = className
                            this.tagName = className
                            this.createControl()
                            if(this.com) {
                                try {
                                    // @ts-ignore
                                    this.beforeLayout && this.beforeLayout()
                                } catch(e) {
                                    console.error('Error in  "'+className+' beforeLayout"', e)
                                }
                                setTimeout(() => {
                                    this.com.setCommonPropsMobile(this, this.defaultProps)
                                    this.com.bindComponent2(this.props)
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
            console.error(e)
            throw e
        }
    }

    /**
     * update items in props to their controls
     * This is called on a model binding event
     * Note: we are not using Nativescript Observable binding any longer
     */
    public update() {
        for(let pi of Object.getOwnPropertyNames(this.props)) {
            const value = this.state[pi] || ''
            const po = this.props[pi]
            const comp = po.component
            const locprop = po.locprop

            comp.set(locprop, value)
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
    // protected setProperties() {
    //     console.warn('control '+this.constructor.name+' should implement a setProperties me')
    // }


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
        ed.sourceComponent = this.findComponentBaseContainer(view) // return the full component, not just the element view
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
        console.warn('setDynamicExpressions is obsolete')
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
        console.warn('ComponentBase:evalExpressionString is deprecated (obsolete)')
    }

    listenToAllGestures(el:View, action:string = 'action') {
        // @ts-ignore
        // this.listenToFor(el, 'up', (ev: any) => {
        //     this.cm.getApp().callEventHandler(action, 'up', ev)
        // })
        // // @ts-ignore
        // this.listenToFor(el, 'down', (ev: any) => {
        //     this.cm.getApp().callEventHandler(action, 'down', ev)
        // })
        // @ts-ignore
        this.listenToFor(el, 'press', (ev: any) => {
            this.cm.getApp().callEventHandler(action, 'press', ev)
        })
        // @ts-ignore
        this.listenToFor(el, 'dblpress', (ev: any) => {
            this.cm.getApp().callEventHandler(action, 'dblpress', ev)
        })
        // @ts-ignore
        this.listenToFor(el, 'swipeup', (ev: any) => {
            this.cm.getApp().callEventHandler(action, 'swipeup', ev, ev.value)
        })
        // @ts-ignore
        this.listenToFor(el, 'swipedown', (ev: any) => {
            this.cm.getApp().callEventHandler(action, 'swipedown', ev, ev.value)
        })
        // @ts-ignore
        this.listenToFor(el, 'swipeleft', (ev: any) => {
            this.cm.getApp().callEventHandler(action, 'swipeleft', ev, ev.value)
        })
        // @ts-ignore
        this.listenToFor(el, 'swiperight', (ev: any) => {
            this.cm.getApp().callEventHandler(action, 'swiperight', ev, ev.value)
        })
        // @ts-ignore
        this.listenToFor(el, 'longpress', (ev: any) => {
            this.cm.getApp().callEventHandler(action, 'longpress', ev, ev.value)
        })

        // @ts-ignore
        this.listenToFor(el, 'pan', (ev:any) => {
            this.cm.getApp().callEventHandler(action, 'pan', ev, ev.value)
        })
        // @ts-ignore
        this.listenToFor(el, 'rotate', (ev:any) => {
            this.cm.getApp().callEventHandler(action, 'rotate', ev, ev.value)
        })
        // @ts-ignore
        this.listenToFor(el, 'pinch', (ev:any) => {
            this.cm.getApp().callEventHandler(action, 'pinch', ev, ev.value)
        })
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
    getDIPScale() { return Platform.Screen.mainScreen.scale }
}



