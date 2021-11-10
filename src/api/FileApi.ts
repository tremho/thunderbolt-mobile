
/// <reference path="../../node_modules/@nativescript/types/index.d.ts"/>

import * as nsfs from '@nativescript/core/file-system'
const {TextDecoder} = require('web-encoding')
import * as TextModule from "@nativescript/core/text";
import * as base64 from "base-64";

function PathNotFound(path:string) {
    class PathNotFound extends Error {
        constructor(path:string) {
            super(`Path ${path} does not exist`)
        }
    }
    return new PathNotFound(path)
}

function resPath(pathName:string):string {
    let resPath
    if(pathName.charAt(0) === '/') {
        resPath = pathName
    } else {
        resPath = nsfs.knownFolders.currentApp().path
        if(resPath.charAt(resPath.length-1) !== '/') resPath += '/'
        resPath += pathName
    }
    return resPath
}

export function getAppPath():Promise<string> {
    return Promise.resolve(nsfs.knownFolders.currentApp().path)
}

export function readFileText(pathName:string):Promise<string> {
    return nsfs.File.fromPath(resPath(pathName)).readText()
}
export function fileExists(pathName:string):Promise<boolean> {
    return Promise.resolve(nsfs.File.exists(resPath(pathName)))
}

export function readFileArrayBuffer(pathName:string):Promise<Uint8Array> {
    const data = nsfs.File.fromPath(resPath(pathName)).readSync((err:Error) => {
        if(err) {
            throw err
        }
    })
    const size = data.length || 0
    let ba:Uint8Array = new Uint8Array(size)
    // @ts-ignore
    if(global.isAndroid) {
        ba.set(data)
    } else {
        let nsdata:NSData = (data as NSData)
        const intRef: any = new interop.Reference(interop.types.int8, interop.alloc(nsdata.length));
        let ba = new Uint8Array(nsdata.length)
        nsdata.getBytes(intRef)
        for(let i=0; i<nsdata.length; i++) {
            ba[i] = intRef[i]
        }

    }
    return Promise.resolve(ba)

}

export function writeFileText(pathName:string, text:string):Promise<void> {
    try {
        nsfs.File.fromPath(resPath(pathName)).writeTextSync(text, (err:Error) => {
            throw err
        })
    } catch(e:any) {
        console.error(e.message)
        throw e
    }
    return Promise.resolve()
}

export function writeFileArrayBuffer(pathName:string, data:ArrayBuffer):Promise<void> {
    try {
        const dv = new DataView(data)
        const size = dv.byteLength
        let ba
        // @ts-ignore
        if (global.isAndroid) {
            const zs = '\0'.repeat(size)
            ba = new java.lang.String(zs).getBytes() // allocate the correct number of bytes (or more)
            for (let i = 0; i < size; i++) {
                ba[i] = dv.getInt8(i)
            }
        } else {
            const intRef: any = new interop.Reference(interop.types.int8, interop.alloc(size));
            for (let i = 0; i < size; i++) {
                intRef[i] = dv.getInt8(i)
            }
            ba = NSData.dataWithBytesLength(intRef, size);
            // ba = interop.bufferFromData(nsdata);
            // const decoder = new TextDecoder('utf8');
            // const b64encoded = btoa(decoder.decode(ba));
            // ba = atob(b64encoded)
        }
        nsfs.File.fromPath(resPath(pathName)).writeSync(ba, (err: Error) => {
            throw err
        })

    } catch(e:any) {
        console.error(e.message)
        throw e
    }
    return Promise.resolve()
}

export function fileDelete(pathName:string): Promise<void> {
    try {
        nsfs.File.fromPath(resPath(pathName)).removeSync( err => {
            throw err
        })
    } catch(e:any) {
        console.error(e.message)
        throw e
    }
    return Promise.resolve()
}

export function fileMove(pathName:string, newPathName:string):Promise<void> {

    // we can't actually move a file with the Nativescript file system but we can
    // copy its contents and delete the original.

    const data = nsfs.File.fromPath(resPath(pathName)).readSync((err:Error) => {
        throw err
    })
    nsfs.File.fromPath(resPath(newPathName)).writeSync(data, (err:Error) => {
        throw err
    })
    nsfs.File.fromPath(pathName).removeSync()
    return Promise.resolve()
}

export function fileRename(pathName:string, newBase:string): Promise<void> {

    // just pass through; we don't need to do the fancy path check; it already does that.
    return nsfs.File.fromPath(pathName).rename(newBase)
    // newBase = newBase.substring(newBase.lastIndexOf('/')+1)
    // const atPath = pathName.substring(0, pathName.lastIndexOf('/')+1)
    // const newPath = nsfs.path.join(atPath, newBase)
    // return fileMove(pathName, newPath)
}

export function fileCopy(pathName:string, toPathName:string):Promise<void> {
    const data = nsfs.File.fromPath(resPath(pathName)).readSync((err:Error) => {
        throw err
    })
    nsfs.File.fromPath(resPath(toPathName)).writeSync(data, (err:Error) => {
        throw err
    })
    return Promise.resolve()
}


export class FileDetails  {
    parentPath: string = ''
    fileName:string = ''
    mtimeMs:number = 0
    size:number = 0
    type:string = '' // file|folder|pipe|socket|blkdevice|chrdevice|symlink (only file/folder divined for Nativescript)
}

export function fileStats(pathName:string):Promise<FileDetails> {
    try {
        const fd = new FileDetails()
        const file = nsfs.File.fromPath(resPath(pathName))
        fd.fileName = file.name
        fd.parentPath = file.parent.path
        fd.mtimeMs = file.lastModified.getTime()
        fd.size = file.size
        fd.type = file.size === undefined ? 'folder' : 'file'
        return Promise.resolve(fd)
    } catch(e:any) {
        console.error(e.message)
        throw e
    }
}

export function createFolder(pathName:string): Promise<void> {
    try {
        nsfs.Folder.fromPath(resPath(pathName))
    } catch(e:any) {
        console.error(e.message)
        throw e
    }
    return Promise.resolve()
}

export function removeFolder(pathName:string, andClear:boolean):Promise<void> {

    // TODO: Implement recursive clearing if andClear is true
    try {
        nsfs.Folder.fromPath(resPath(pathName)).removeSync((err:any) => {
            if(err) {
                throw err
            }
        })
    } catch(e:any) {
        console.error(e.message)
        throw e
    }
    return Promise.resolve()
}

export function readFolder(pathName:string):Promise<FileDetails[]> {
    const details:FileDetails[] = []
    const entries = nsfs.Folder.fromPath(resPath(pathName)).getEntitiesSync((err:any) => {
        if(err) throw err
    })
    entries.forEach((entry:any) => {
        const det = new FileDetails()
        det.fileName = entry.name
        det.parentPath = entry.parent.path
        det.mtimeMs = entry.lastModified.getTime()
        det.size = entry.size
        det.type = entry.size === undefined ? 'folder' : 'file'
        details.push(det)
    })
    return Promise.resolve(details)
}

export class UserPathInfo {
    home:string = ''
    cwd:string = ''
    assets:string = ''
    appData:string = ''
    documents:string = ''
    downloads:string = ''
    desktop:string = ''
    userName:string = ''
    uid:Number | undefined
    gid:Number | undefined
}


export function getUserAndPathInfo(): Promise<UserPathInfo> {
    const out = new UserPathInfo()
    out.cwd = nsfs.knownFolders.currentApp().path
    out.documents = nsfs.knownFolders.documents().path
    out.appData = nsfs.knownFolders.temp().path

    let res = out.cwd+'/assets'
    if(nsfs.File.exists(res)) {
        out.assets = res
    }

    // Note there are some ios-specific locations in knownFolders.ios that may be useful there, but we'll ignore for now

    return Promise.resolve(out)

}