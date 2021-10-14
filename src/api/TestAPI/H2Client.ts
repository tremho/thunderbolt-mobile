
import http2 from "http2"
import {executeDirective, getReport} from "./PoCActions";

export class H2Client {
    session:any;
    line:string = ''
    directives: string[] = []

    constructor() {
        this.session = http2.connect("http://localhost:51610")
        this.session.on('error', (err:Error) => {this.handleError(err)})
    }


    handleError(err:Error) {
        console.log(err)
    }

    handleResponse(headers:any) {
        // we can log each response header here
        console.log('Response headers:')
        for (const name in headers) {
            console.log(`${name}: ${headers[name]}`)
        }
    }
    handleChunkData(chunk:string) {
        this.directives.push(chunk)
    }

    request(path:string , data?:string) {
        const req = this.session.request({":path": path})
        req.on('response', (headers:any)=> {this.handleResponse(headers)})
        req.setEncoding('utf8')
        req.on('data', (chunk:string)=> {this.handleChunkData(chunk)})
        if(data) req.write(data)
        req.end()
    }

    end() {
        this.session.destroy()
    }

    // -- flow pertaining to test client

    async syncStatus(status:string) {
        return new Promise(resolve => {
            const req = this.session.request({":path": '/status', ":method": "POST"})
            if(status) req.write(getReport(), 'utf8')    // inform the server of our status
            req.setEncoding('utf8')
            req.end()
            req.on('response', (headers:any)=> {    // wait for it to respond so we are in sync
                resolve(headers[':status'])         // if server doesn't like our status, we'll get a 4XX error (403 (inappropriate) or 404 (unrecognized))
            })
        })
    }

    async processDirectives() {
        let d;
        let alive = true
        while((d=this.directives.shift())) {
            d = d.trim()
            console.log(`processing directive "${d}"`)
            if(!d || d === 'end') {
                alive = false
                break
            }
            const p = Promise.resolve(executeDirective(d))
            const result = await p

        }
        return alive
    }
}