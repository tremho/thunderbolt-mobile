import {StackLayout, View} from '@nativescript/core'
// import {ComCommon, LocalBind} from "../app-core/ComCommon"
class ComCommon {
    constructor(a:any) {}
    waitForModel():Promise<any> {return Promise.resolve()}
    bindComponent() {}
    setLocalBinds(lb: LocalBind[]|undefined) {}
    componentIsReady() {}
}
class LocalBind {}
class EventData {
    app:any|undefined
    sourceComponent:any|undefined
    tag:string|undefined
    eventType: string|undefined
    platEvent: string|undefined
}
function getTheApp():any { return {} }
// import {AppCore, EventData, getTheApp} from "../app-core/AppCore"

export default class ComponentBase extends StackLayout {
    private _isInit: boolean = false
    protected container: any
    private common: ComCommon | undefined
    private localBinds:LocalBind[] | undefined

    constructor() {
        super()
        try {
            this.container = this
            this.on('layoutChanged', () => {
                console.log('in layoutChanged')
                if (!this._isInit) {
                    this._isInit = true
                    this.common = new ComCommon(this)
                    this.common.waitForModel().then(() => {
                        console.log('past waitReady')
                        // must occur on a nominal timeout to work across platforms
                        setTimeout(() => {
                            console.log('executing timeout -- creating component')
                            this.localBinds = []
                            this.createControl()
                            console.log('localBinds', this.localBinds)
                            if(this.common) {
                                this.common.bindComponent()
                                this.common.setLocalBinds(this.localBinds)
                                this.common.componentIsReady()
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
        let lb:LocalBind = [view, bindLocalName, viewProperty]
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
            ed.platEvent = ev
            const activity = getTheApp().currentActivity
            // console.log('should call '+target)
            if(activity && typeof activity[target] === 'function') {
                activity[target](ed)
            }
        })
    }

}

