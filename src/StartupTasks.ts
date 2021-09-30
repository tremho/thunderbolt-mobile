
import * as nsfs from '@nativescript/core/file-system'
import {FileSystemEntity} from "@nativescript/core/file-system";
import {Device, Screen} from '@nativescript/core'
import {Application} from '@nativescript/core'

let passedEnvironment = {}

export function readBuildEnvironment() {
    let be = {}

    console.log('>>$$$$ in readBuildEnvironment ')

    const cwd = nsfs.knownFolders.currentApp().path
    console.log('ns cwd (app) ', cwd)
    const files = nsfs.Folder.fromPath(cwd).getEntitiesSync()
    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%')
    console.log('contents at app root:')
    for(let i=0; i<files.length; i++) {
        const f = files[i]
        const fileName = f.path.substring(f.path.lastIndexOf('/'))
        console.log(`${i+1} - ${fileName}`)
    }
    console.log('%%%%%%%%%%%%%%%%%%%%%%%%%')


    let beFile ='BuildEnvironment.json'
    let text = ''

    beFile = nsfs.knownFolders.currentApp().path+'/'+beFile

    let exists = nsfs.File.exists(beFile);
    console.log(beFile + ' exists? ', exists)
    if(exists) {
        try {
            text = nsfs.File.fromPath(beFile).readTextSync()
            if (text) {
                be = JSON.parse(text)
            } else {
                console.error(beFile + ' Does not exist')
                be = {
                    error: "Unable to locate " + beFile,
                }
            }
        } catch (e:any) {
            console.error('Unable to read ' + beFile, e)
            be = {
                error: "Unable to read " + beFile,
                errMsg: e.message
            }
        }
    }
    console.log('returning build environment data as ', be)
    return mergeRuntimeInformation(be)

}
function mergeRuntimeInformation(buildEnv:any) {

    console.log('>> in mergeRuntimeInformation')

    const env = {
        build: buildEnv,
        runtime: {
            framework: {
                nativeScript: buildEnv.framework.nativeScript            },
            platform: {
                type: Device.deviceType || 'Mobile device',
                name: 'NativeScript',
                version: buildEnv.platform.nativeScript,
                host: Device.os, // host OS (if nativescript)
                hostVersion: Device.osVersion, // (if nativescript)
                manufacturer: Device.manufacturer // (if nativescript)
            }
        },
        window: {
            width: Screen.mainScreen.widthDIPs,
            height: Screen.mainScreen.heightDIPs
        }
    }
    passedEnvironment = env
    console.log('>> out of mergeRuntimeInformation')
    return env
}

export function passEnvironmentAndGetTitles(): { appName:string, title:string } {
    console.log('########### window info should be here ###########')
    console.log('passedEnvironment', passedEnvironment)
    Application.setResources({passedEnvironment:passedEnvironment})

    let env:any = passedEnvironment
    if(!env.build || !env.build.app) {
        throw Error('missing build environment data')
    }
    let appName = (env.build.app && env.build.app.name) || 'jove-app'
    let title = env.build.app.displayName || appName
    console.log('... appName, title', appName, title)
    return {appName, title}
}
