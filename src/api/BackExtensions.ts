
const extensionModules = {}

export function registerExtensionModule(moduleName:string, module:any) {
    try {
        console.log(`registering ${moduleName} module... `)
        // @ts-ignore
        extensionModules[moduleName] = module
    } catch(e) {
        console.error("ERROR at registerExtensionModule", e)
    }
}

export function callExtensionApi(moduleName:string, functionName:string, args:any[]) {
    // console.log(`calling ${functionName} from module "${moduleName}"`)
    // @ts-ignore
    const mod = extensionModules[moduleName]
    const fn = mod[functionName]
    let response:any, error:any
    if(!fn) {
        error = `function "${functionName} does not exist in module "${moduleName}`
    }
    return new Promise((resolve, reject) => {
        try {
            response = fn(...args)
        } catch(e) {
            error = e.message
        }
        if(error) reject(error)
        else resolve(response)
    })

}