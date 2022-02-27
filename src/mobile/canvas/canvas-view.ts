import {EventData, getTheApp} from "../ComponentBase";

let Canvas:any
try {
    Canvas = require('@nativescript/canvas').Canvas
} catch(e) {
}

// the canvas-view is not a normal ComponentBase like the other Jove controls
// instead, it is simply a renamed version of the @nativescript/canvas directly (similar to stack-layout).
// it will call canvasReady
export class CanvasView extends Canvas {
    constructor() {
        super()
        this.on('ready', (ev:any) => {
            this.respondToAction(this, ev,'ready', 'ready')
        })
        this.on('tap', (ev:any) => {
            this.respondToAction(this, ev,'tap', 'action')
        })
    }
    protected respondToAction(view:any, event:any, eventName:string, tag:string = 'action', value?:any) {
        const target = this.get(tag)
        const ed = new EventData()
        const app = getTheApp()
        ed.app = app
        ed.sourceComponent = this
        ed.eventType = eventName
        ed.tag = tag
        ed.value = value
        // console.log('Event occurs', eventName)
        ed.platEvent = event
        // console.log('>>>>>>>>>>>> getting activity from app', app, ed.app)
        const activity = app.currentActivity
        // console.log('activity found', activity)
        // console.log('should call '+target)
        if(activity && typeof activity[target] === 'function') {
            activity[target](ed)
        }
    }

}


