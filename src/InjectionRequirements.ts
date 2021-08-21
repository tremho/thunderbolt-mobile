import * as nscore from '@nativescript/core'
import {Application} from '@nativescript/core'
import {registerExtensionModule} from "./api/BackExtensions";
import * as startupTasks from './StartupTasks'
const injections = {
    nscore,
    nativescriptApp:Application,
    startupTasks,
    registerExtensionModule
}
export default injections
