import * as nscore from '@nativescript/core'
import {Application} from '@nativescript/core'
import {registerExtensionModule} from "./api/BackExtensions";

const injections = {
    nscore,
    nativescriptApp:Application,
    registerExtensionModule
}
export default injections
