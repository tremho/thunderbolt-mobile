
import {View} from '@nativescript/core'
import ComponentBase from "../ComponentBase"

let Canvas:any
try {
    Canvas = require('@nativescript/canvas').Canvas
} catch(e) {
}

// the canvas-view is not a normal ComponentBase like the other Jove controls
// instead, it is simply a renamed version of the @nativescript/canvas directly (similar to stack-layout).
// it will call canvasReady (on the page, not the activity, so this is forwarded by the page stubs)
export class CanvasView extends Canvas {

    // Canvas uses a DOM event model rather than the NS gesture patterns
    // So we don't connect to it as a listener.
    // To attach UX to a canvas, wrap it in a StackLayout or other container and listen there.

    // private util:ComponentBase  // we use this just for gesture attachment
    //
    // constructor() {
    //     super()
    //     let cv = this as unknown as View
    //     this.util = new ComponentBase(cv)
    //     this.util.listenToAllGestures(cv, 'action')
    // }
}


