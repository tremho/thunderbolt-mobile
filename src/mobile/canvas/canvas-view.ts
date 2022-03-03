// To use this component, the @nativescript/canvas plugin must be installed

let Canvas:any
try {
    Canvas = require('@nativescript/canvas').Canvas
} catch(e) {
}

// the canvas-view is not a normal ComponentBase like the other Jove controls.
// Instead, it is simply a renamed version of the @nativescript/canvas directly (similar to stack-layout).
// it will call canvasReady (on the page, not the activity, so this is forwarded by the page stubs)
// to trap gestures, add a listener to the surrounding stack-layout
export class CanvasView extends Canvas {
}


