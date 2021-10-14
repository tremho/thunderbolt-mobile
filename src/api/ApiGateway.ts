
import * as fileApi from './FileApi'
import * as dialogApi from './DialogAPI'
import * as webApi from './WebApi'
import * as testApi from './TestAPI/testApi'

import {passEnvironmentAndGetTitles} from "../StartupTasks";

export const mainApi = {
    requestEnvironment: () => {passEnvironmentAndGetTitles()},

    ...fileApi,
    ...dialogApi,
    ...webApi,
    ...testApi
}
