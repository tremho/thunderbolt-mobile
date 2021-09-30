const http = require('@nativescript/core/http')

/**
 * Structure of object for a Web Request
 */
class WebRequest {
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
class WebResponse {
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
    options.headers = request.headers
    options.method = request.method
    // options.timeout
    options.url = request.endpoint

    console.log('websend preparing', request.method+' '+request.endpoint)
    console.log('websend sending ')
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
        resp.body = result.content
        console.log('returning resp', resp)
        return resp
    })
}
