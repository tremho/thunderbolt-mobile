/*
The Settings API provides a cross-platform way of storing name/value data persistently.
Ideal for system configuration style scenarios.
Not ideal for large data or user documents.
 */

import appSettings from '@nativescript/core/application-settings'

let prefix = 'settings'


// Returns the currently set namespace prefix for data keys
export function getSettingsPrefix() {
    return prefix
}

// Sets a new prefix to be used as a namespace for data keys
export function setSettingsPrefix(aprefix:string) {
    prefix = prefix
}

// Returns true if the requested key exists in settings
export function hasSettingsKey(
    key:string
) {
    return appSettings.hasKey(prefix+'.'+key)
}

// gets the type of the value recorded at the given key
export async function getSettingsType(key:string):Promise<string> {
    let rt = 'undefined'
    if(appSettings.hasKey('type.'+prefix+'.'+key)) {
        rt =  appSettings.getString('type.'+prefix+'.'+key)
    }
    return Promise.resolve(rt)
}

// gets the value recorded for the given key
export async function getSettingsValue(key:string):Promise<any> {
    let rt
    let type = await getSettingsType(key)
    if(type !== 'undefined') {
        let pkey = prefix+'.'+key
        if(type === 'number') {
            rt = appSettings.getNumber(pkey)
        }
        if(type === 'boolean') {
            rt = appSettings.getBoolean(pkey)
        }
        if(type === 'string') {
            rt = appSettings.getString(pkey)
        }
        if(type === 'object') {
            try {
                rt = JSON.parse(appSettings.getString(pkey))
            } catch(e) {
                console.error('unable to parse object while reading from settings for '+key)
            }
        }
    }
    return Promise.resolve(rt)
}

// records the given key and value
export async function setSettingsValue(key:string, value:any) {
    let type = typeof value
    appSettings.setString('type.'+prefix+'.'+key, type)
    let pkey = prefix+'.'+key
    if(type === 'number') {
        appSettings.setNumber(pkey, Number(value))
    }
    if(type === 'boolean') {
        appSettings.setBoolean(pkey, !!value)
    }
    if(type === 'string') {
        appSettings.setString(pkey, value)
    }
    if(type === 'object') {
        let v
        try {
            v = JSON.stringify(value)
            appSettings.setString(pkey, v)
        } catch(e) {
            console.error('failure to record settings for '+key, e)
        }
    }
}

// removes the record for the given key
export async function removeSettingsKey(key:string) {
    appSettings.remove('type.'+prefix+'.'+key)
    appSettings.remove(prefix+'.'+key)
}

// forces a write to persistence
export async function flushSettings() {
    appSettings.flush()
}
