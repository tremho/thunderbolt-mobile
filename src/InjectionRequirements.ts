import * as nscore from '@nativescript/core'
import {Application} from '@nativescript/core'
import {registerExtensionModule} from "./api/BackExtensions";
import * as startupTasks from './StartupTasks'
import ComponentBase from "./mobile/ComponentBase"
import {mainApi} from './api/ApiGateway'
import {callExtensionApi} from "./api/BackExtensions";

const injections = {
    nscore,
    nativescriptApp:Application,
    startupTasks,
    ComponentBase,
    registerExtensionModule,
    mainApi,
    callExtensionApi
}
export default injections
