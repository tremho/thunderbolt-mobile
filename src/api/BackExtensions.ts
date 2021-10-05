
import * as nscore from "@nativescript/core";
import InjectionRequirements from "../InjectionRequirements"
import {FrameworkBackContext} from "@tremho/jove-common";

const nscoreAccess = {
    nativescriptCoreObject: (objName:string) => {
        //@ts-ignore
        return nscore[objName]
    }
}

const extensionModules = {}

export function registerExtensionModule(backContext:any, moduleName:string, module:any) {
    try {
        console.log(`registering ${moduleName} module... `)
        // @ts-ignore
        extensionModules[moduleName] = module
    } catch(e:any) {
        console.error("ERROR at registerExtensionModule", e)
    }
}

export function callExtensionApi(moduleName:string, functionName:string, args:any[]) {
    // console.log(`calling ${functionName} from module "${moduleName}"`)
    // @ts-ignore
    const mod = extensionModules[moduleName]

    let response:any, error:any;
    if(!mod.contextSent) {
        if(typeof mod.initContext === 'function') {
            try {
                mod.initContext(InjectionRequirements, FrameworkBackContext)
                mod.contextSent = true
            } catch(e) {
                error = e
            }
        }
    }


    const fn = mod[functionName]
    if(!fn) {
        error = `function "${functionName} does not exist in module "${moduleName}`
    }
    return new Promise((resolve, reject) => {
        try {
            response = fn.apply(nscoreAccess, args) // allow access via this.nativescriptCoreObject
        } catch(e:any) {
            error = e.message
        }
        if(error) reject(error)
        else resolve(response)
    })

}