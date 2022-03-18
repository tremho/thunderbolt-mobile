
// Note this is my patched version of @master.technology/websockets.  Meant to be temporary pending official fix.
// @ts-ignore
import {TEST_ENABLED} from "`~/tbd/settings/enabled"

let WS:any
if(TEST_ENABLED) {
    try {
        WS = require('@tremho/mt-ns-websockets')
    }
    catch(e) {}
}


import {executeDirective, getReport} from "./PoCActions";
export type ClientEventHandler = (data:any) => void

export class WSClient {
    ws:any = null
    eventMap:any = {}

    connect(serviceUrl:string) {
        this.ws = WS && new WS(serviceUrl, {protocols:[], debug:false, timeout:25000})
        ////
        return new Promise(resolve => {
            if(this.ws) {
                this.ws.on('error', (w: any, e: Error) => {
                    // console.log('we see an error at ws ', e)
                    this.handleEvent('error', e)
                })
                this.ws.on('close', (w: any, code: number, reason: string) => {
                    this.handleEvent('close', {code, reason})
                })
                this.ws.on('open', (w: any) => {
                    this.handleEvent('connect', this)
                })
                this.ws.on('message', (w: any, message: string) => {
                    this.handleEvent('data', message)
                })
                this.ws.open()
            }
        })

    }
    send(data:any) {
        this.ws?.send(data)
    }

    end(code:number = 1000) {
        this.ws?.close(code)
    }

    on(event:string, handler:ClientEventHandler) {
        this.eventMap[event] = handler
    }
    handleEvent(event:string, data:any) {
        const fn = this.eventMap[event]
        if(fn) {
            fn(data)
        }
    }
}

export async function connectClient(service:string):Promise<WSClient> {
    // console.log('connecting to', service)
    const client = new WSClient()
    return new Promise(resolve => {
        client.on('error', (e:Error) => {
            resolve(client)
        })
        client.on('connect', (data:any) => {
            resolve(client)
        })
        client.connect(service)
    })
}

let rcount = 1
let code = 1000
export function clientTest(service:string):Promise<number> {
    return new Promise(resolve => {
        // console.log('starting client test')
        connectClient(service).then((client:any) => {
            client.on('close', (data:any) => {
                if(data.code === 1000) {// normal close
                    // console.log('client closed normally', data.reason)
                } else {
                    // console.warn('client closed abnormally', code, data.reason)
                }
            })
            client.on('data', (data:any) => {
                const directive = data.toString()
                if(directive.substring(0,7) === 'appium:') {
                    return;
                }
                // console.log('received directive', directive)
                if(directive === 'end')  {
                    // todo: we should get an overall test report and a code from this end and report it.
                    client.send(`${rcount}:${directive}=${code}`)
                    client.end(code)
                    resolve(code)
                }
                const reply = executeDirective(directive)
                Promise.resolve(reply).then((res:string) => {
                    const srep = `${rcount}:${directive}=${res}`
                    rcount++
                    // console.log('replying ', srep)
                    client.send(srep)
                })
            })
        })
    })
}

