const http = require('@nativescript/core/http')

/**
 * Structure of object for a Web Request
 */
export class WebRequest {
    endpoint:string = ''
    method: string = ''
    headers: object = {} // key-value object
    parameters: Parameter[] = []
    body?: string;
    type: string = ''
}

/**
 * Structure of an object for a Parameter
 */
class Parameter {
    name:string = ''
    value: string = ''
}

/**
 * Status types enum
 * (a direct mapping of unirest statusType values)
 */
enum StatusType {
    None,
    Info,
    Ok,
    Misc,
    ClientError,
    ServerError
}

/**
 * Structure of object for a Web Response
 */
export class WebResponse {
    code: number = 0
    statusType: StatusType = StatusType.None
    headers: object = {} // key value
    body: string = ''
}

/**
 * Send a request and get the response
 * @param request
 */
export function webSend(request:WebRequest) : Promise<WebResponse> {
    const resp = new WebResponse()
    const options:any = {}
    options.content = request.body
    // options.dontFollowRedirects = false
    // options.timeout
    options.headers = request.headers
    options.method = request.method
    let q = ''
    for(let p of Object.getOwnPropertyNames(request.parameters || {})) {
        // @ts-ignore
        let v = request.parameters[p]
        q += (q ? '&': '?')+p+'='+v
    }
    options.url = request.endpoint+q

    console.log('websend preparing', request.method+' '+options.url)
    console.log('websend sending ', JSON.stringify(options))
    return http.request(options).then((result:any) => {
        resp.code = result.statusCode
        resp.statusType = StatusType.None
        if(result.statusCode >=200 && result.statusCode < 300) {
            resp.statusType = StatusType.Ok
        }
        if(result.statusCode >=100 && result.statusCode < 200) {
            resp.statusType = StatusType.Info
        }
        if(result.statusCode >=300 && result.statusCode < 400) {
            resp.statusType = StatusType.Misc
        }
        if(result.statusCode >=400 && result.statusCode < 500) {
            resp.statusType = StatusType.ClientError
        }
        if(result.statusCode >= 500) {
            resp.statusType = StatusType.ServerError
        }
        resp.headers = result.headers
        resp.body = result.content.toString() // we'll keep it as text and convert client-side to avoid json error traps
        console.log('returning resp', resp)
        return resp
    })
}
