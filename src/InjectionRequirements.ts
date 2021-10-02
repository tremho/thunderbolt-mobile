import * as nscore from '@nativescript/core'
import {Application} from '@nativescript/core'
import {registerExtensionModule} from "./api/BackExtensions";
import * as startupTasks from './StartupTasks'
import ComponentBase from "./mobile/ComponentBase"
import {mainApi, callExtensionApi} from './index'

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
