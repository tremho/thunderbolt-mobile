
import ComponentBase from '../ComponentBase'

import {Label, Color} from '@nativescript/core'

let Canvas:any
try {
    Canvas = require('@nativescript/canvas')
} catch(e) {
}

export class CanvasView extends ComponentBase {
    // @ts-ignore
    private canvas:any = null;
    private ctx:any = null
    private contextType:string = ''

    // Override to create our control
    public createControl() {
        if(Canvas) {
            this.canvas = new Canvas()
        } else {
            throw Error('@nativescript/canvas (plugin) is not installed')
        }
        this.className = "CanvasView"
        let size = this.getProp('size')
        const rect = this.getElementBounds(div)
        if(!size) {
            size = (rect.height || rect.width)
        }
        let sizeH = this.isAndroid ? size * 0.75 : size
        this.ctx = this.getContext()
        if(this.ctx) {
            this.ctx.canvas.width = size
            this.ctx.canvas.height = sizeH
        }
        this.component.addChild(this.canvas)
        if(this.get('action')) this.setActionResponder(this.canvas, 'tap', 'action')
    }
    public getContext(type?:string) {
        if(!this.ctx || type) {
            if (!type) type = this.getProp('type') || 'none'
            type = (type && type.toLowerCase()) || ''
            if (type === '2d' || type === 'webgl' || type === '3d') {
                if(type === '3d') type = 'webgl' // 3d is synonymous with webGL 1.0
                try {
                    let rctx = this.canvas.getContext(type)
                    this.ctx = rctx
                    if(this.ctx) {
                        this.contextType = type
                    } else {
                    }

                } catch (e) {
                    console.error('Canvas initialization has failed')
                    throw e;
                }
            } else {
                throw Error('canvas type must be "2d" or "webgl"')
            }
        }
        return this.ctx
    }

    // protected setProperties() {
    //     this.setDynamicExpressions(this.get('text') || '$text', this.label, 'text', 'text')
    // }

}


