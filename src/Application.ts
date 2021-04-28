
import nscore from '@nativescript/core'

const {Application} = nscore

let frameworkContext:FrameworkBackContext

/**
 * defines the Framework access object passed to the __appStart__ lifecycle callback for the back process
 */
export class FrameworkBackContext {
    private contextId:number
    public nativescriptApp:any
    public backApp: TBBackApp
    public frontApp: TBFrontApp | undefined

    constructor(backApp: TBBackApp) {
        this.contextId = nextContextId++
        this.backApp = backApp
        this.nativescriptApp = Application


        this.backApp.appStart(this).then(() => {
            Application.run({moduleName: 'app-root'})
        })
    }

    setFrontApp(frontApp:TBFrontApp) {
        this.frontApp = frontApp
    }

    registerExtensionModule(name:string, module:any) {
        console.log('TODO: registerExtensionModule(name, module)')
    }

}

/**
 * The framework front context is an AppCore instance
 */
type FrameworkFrontContext = any // treat as any here. But in reality it will be AppCore from the front process

/** Callback for __appStart__ lifecycle */
export type BackAppStartCallback = (context:FrameworkBackContext) => Promise<void>
/** Callback for __appExit__ lifecycle */
export type BackAppExitCallback = (context:FrameworkBackContext) => Promise<void>

/** Callback for __appStart__ lifecycle */
export type FrontAppStartCallback = (context:FrameworkFrontContext) => Promise<void>
/** Callback for __appExit__ lifecycle */
export type FrontAppExitCallback = (context:FrameworkFrontContext) => Promise<void>

/** Callback for __pageBegin__ lifecycle */
export type PageBeginCallback = (context:FrameworkFrontContext, userData:any) => Promise<void>

/** Callback for __pageDone__ lifecycle */
export type PageDoneCallback = (context:FrameworkFrontContext, userData:any) => Promise<void>

// Used by the framework to keep potentially multiple execution contexts separate.
// No use case yet envisioned for multiple instances, but these things have a way of
// coming up later, so let's build it in at the very start.
// Although, I'm not sure the Electron context lends itself to multiple instances, not to mention NativeScript, so
// this is probably moot anyway.
const registeredInstances = {} // map indexed by contextId
let nextContextId = 0 // index into instances

/**
 * Signature for a Thunderbolt app registration, back (main) process
 */
export interface TBBackApp {
    appStart: BackAppStartCallback,
    appExit: BackAppExitCallback
}
/**
 * Signature for a Thunderbolt app registration, front (render) process
 */
export interface TBFrontApp {
    appStart: FrontAppStartCallback,
    appExit: FrontAppExitCallback
}

/**
 * Signature for a Thunderbolt page
 */
export interface TBPage {
    pageBegin: PageBeginCallback,
    pageDone: PageDoneCallback
}

/**
 * A Thunderbolt app main startup code calls here to establish the
 * functional app core of the application.  The app core instance passed
 * must satisfy the interface requirements for {@link: TBApp}
 *
 * @param {TBApp} app
 */
export function registerApp(backApp:TBBackApp) : void {

    console.log('TODO: new AppGateway(ipcMain)')

    console.log('Launching Nativescript Thunderbolt App\n')

    frameworkContext = new FrameworkBackContext(backApp)
}

export function registerFrontApp(frontApp:TBFrontApp) : void {
    console.log('front app being registered')
    frameworkContext.setFrontApp(frontApp)

}