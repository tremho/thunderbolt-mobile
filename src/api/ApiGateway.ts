
import * as fileApi from './FileApi'
import * as dialogApi from './DialogAPI'
import * as webApi from './WebApi'
import * as testApi from './TestAPI/testApi'

import {passEnvironmentAndGetTitles} from "../StartupTasks";

export const mainApi = {
    requestEnvironment: () => {passEnvironmentAndGetTitles()},
    appExit: (code:number) => {process.exit(code)},

    ...fileApi,
    ...dialogApi,
    ...webApi,
    ...testApi
}

let callTestRequest = (r:string, params:string[]) => {console.log('CTR Not Hooked!')}

export function setCallTestRequest(ctr:any) {
    callTestRequest = ctr
}

export function sendTestRequest(request: string, params: string[], cb?:any) {
    return new Promise(resolve => {
        // console.log('calling testOp method in Main World #A', request)
        let tparams = '['
        params.forEach(p => {tparams += ` "${p}",`})
        tparams = tparams.substring(0, tparams.length-1) + ']'
        resolve(callTestRequest(request, params))
    })

}