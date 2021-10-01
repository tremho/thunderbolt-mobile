
import targetPlatform from "./InjectionRequirements"
import ComponentBase from './mobile/ComponentBase'
import * as componentExport from './mobile/ComponentExport'
import {Observable} from "./Util/Observable";

import {mainApi} from './api/ApiGateway'
import {callExtensionApi} from "./api/BackExtensions";

export {targetPlatform as targetPlatform}
export {ComponentBase as ComponentBase}
export {componentExport as componentExport}
export {Observable as Observable}
export {mainApi as mainApi}
export {callExtensionApi as callExtensionApi}

export function getMainApi() {
    return mainApi
}

console.log('>>>>>>>>>>>>>>>')
console.log('mobile index exports')
console.log('targetPlatform', targetPlatform)
console.log('ComponentBase', ComponentBase)
console.log('componentExport', componentExport)
console.log('Observable', Observable)
console.log('mainApi', mainApi)
console.log('callExtensionApi', callExtensionApi)
console.log('getMainApi', getMainApi)
console.log('<<<<<<<<<<<<<<<<<')
