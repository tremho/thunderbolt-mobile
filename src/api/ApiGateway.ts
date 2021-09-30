
import * as fileApi from './FileApi'
import * as dialogApi from './DialogAPI'
import * as webApi  from './WebApi'

export const mainApi = {
    ...fileApi,
    ...dialogApi,
    ...webApi
}
