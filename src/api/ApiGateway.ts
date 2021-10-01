
import * as fileApi from './FileApi'
import * as dialogApi from './DialogAPI'
import * as WebApi from './WebApi'

// TODO: change to export the whole namespace and change the app semantic from app.mainApi.NAME to app.api.NAME
// with names FILE, DIALOG, and HTTP

export const mainApi = {
    foo: "foo",
    bar: "bar",
    getAppPath: fileApi.getAppPath,
    FileDetails: fileApi.FileDetails,
    fileCopy: fileApi.fileCopy,
    fileMove: fileApi.fileMove,
    fileStats: fileApi.fileStats,
    getUserAndPathInfo: fileApi.getUserAndPathInfo,
    readFileText: fileApi.readFileText,
    readFileArrayBuffer: fileApi.readFileArrayBuffer,
    writeFileArrayBuffer: fileApi.writeFileArrayBuffer,
    writeFileText: fileApi.writeFileText,
    createFolder: fileApi.createFolder,
    fileDelete: fileApi.fileDelete,
    fileExists: fileApi.fileExists,
    fileRename: fileApi.fileRename,
    readfolder: fileApi.readFolder,
    removeFolder: fileApi.removeFolder,

    DialogOptions: dialogApi.DialogOptions,
    openDialog: dialogApi.openDialog,

    webSend: WebApi.webSend,

    fin: "That's all folks"
}
