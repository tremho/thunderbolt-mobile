
import * as fileApi from './FileApi'
import * as dialogApi from './DialogAPI'
import * as webApi from './WebApi'
import * as settingsApi from './SettingsAPI'
import * as testApi from './TestAPI/testApi'

import {exit} from 'nativescript-exit'

import {passEnvironmentAndGetTitles} from "../StartupTasks";

export const mainApi = {
    requestEnvironment: () => {passEnvironmentAndGetTitles()},
    appExit: (code:number) => {exit(code)},

    ...fileApi,
    ...dialogApi,
    ...webApi,
    ...settingsApi,
    ...testApi
}

let callTestRequest = (r:string, params:string[]) => {console.warn('CTR Not Hooked!')}

export function setCallTestRequest(ctr:any) {
    callTestRequest = ctr
    // console.log(">>>>>>>>>> HOOKING CTR as ", callTestRequest)
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