
import * as AppGateway from '../ApiGateway'
import {Frame, Page, View, ImageSource} from '@nativescript/core'

/**
 * Reads the value in the app model at the given model path
 * @param modelPath
 */
export async function readModelValue(modelPath:string) {
    // console.log('TestActions readModelValue is calling AppGateway to relay to front')
    const resp = await AppGateway.sendTestRequest('readModelValue', [modelPath])
    // console.log('response from AppGateway is', resp)
    return resp
}

/**
 * Sets a value in the model at the given model path
 * @param modelPath
 * @param value
 */
export async function setModelValue(modelPath:string, value:any) {
    return await AppGateway.sendTestRequest('setModelValue', [modelPath, value])
}

/**
 * Selects a component on the page via a selector and assigns it to a name we can reference later
 *
 * @param name Name to assign to the component
 * @param tagName tag name of the component (e.g. simple-label)
 * @param [prop] optional name of a property to check on this component
 * @param [propValue] optional if prop given, this is the value to match
 */
export async function assignComponent(name:string, tagName:string, prop?:string, propValue?:string) {
    // console.log('assignComponent', name, tagName, prop, propValue)
    const resp =  await AppGateway.sendTestRequest('assignComponent', [name, tagName, prop || '', propValue || ''])
    // console.log('assignComponent response', resp)
    return resp
}

/**
 * Reads the value of a property of the named component
 *
 * @param componentName
 * @param propName
 */
export async function readComponentProperty(componentName:string, propName:string) {
    // console.log('readComponentProperty ', componentName, propName)
    const resp =  await AppGateway.sendTestRequest('readComponentProperty', [componentName, propName])
    // console.log('     response:', resp)
    return resp
}

/**
 * Sets the  property of a named component to the given value
 *
 * @param componentName
 * @param propName
 * @param propValue
 */
export async function setComponentProperty(componentName:string, propName:string, propValue:string) {
    return await AppGateway.sendTestRequest('setComponentProperty', [componentName, propName, propValue])
}

/**
 * Triggers the named action on the named component.
 * Actions are psuedo-actions, such as "press" (alias for click or tap)
 * @param componentName
 * @param action
 */
export async function triggerAction(componentName:string, action:string) {
    // console.log('triggerAction', componentName, action)
    return await AppGateway.sendTestRequest('triggerAction', [componentName, action])
}

/**
 * Navigate to the given page, optionally passing a context object
 * @param pageName
 * @param context
 */
export async function goToPage(pageName:string, context?:any) {
    return await AppGateway.sendTestRequest('goToPage', [pageName, context])
}

/**
 * Call a function of a given name on the current page, passing optional parameters
 * @param funcName  Name of exported function found on current page logic
 * @param [parameters]  Array of optional parameters to pass
 */
export async function callPageFunction(funcName:string, parameters:string[] = []) {
    return await AppGateway.sendTestRequest('callPageFunction', [funcName, ...parameters])
}

/**
 * wait for a given number of milliseconds
 * @param delay
 */
export async function wait(delay:number):Promise<void> {

    let start = Date.now()
    let sub = 50
    let ddelay = delay - sub
    if(ddelay < 0) ddelay = 0
    console.log(">> Wait", delay, ddelay, sub)
    return new Promise(resolve => {
        setTimeout(() => {
            console.log('>> wait ends', Date.now()-start)
            resolve()
        }, ddelay)})
}

export async function time() {
    return Date.now()
}

function compView(view:View) {

    let comp:any = {}

    comp.automationText = view.automationText
    comp.className = view.className
    comp.tagName = view.constructor?.name || ''
    const atts= [
        // 'background',
        // 'backgroundColor',
        // 'backgroundImage',
        // 'borderBottomColor',
        // 'borderBottomLeftRadius',
        // 'borderBottomRightRadius',
        // 'borderBottomWidth',
        // 'borderColor',
        // 'borderLeftColor',
        // 'borderLeftWidth',
        // 'borderRadius',
        // 'borderRightColor',
        // 'borderRightWidth',
        // 'borderTopColor',
        // 'borderTopLeftRadius',
        // 'borderTopRightRadius',
        // 'borderTopWidth',
        // 'borderWidth',
        // 'col',
        // 'colSpan',
        // 'color',
        // 'column',
        // 'columnSpan',
        // 'dock',
        // 'domNode',
        // 'effectiveBorderBottomWidth',
        // 'effectiveBorderLeftWidth',
        // 'effectiveBorderRightWidth',
        // 'effectiveBorderTopWidth',
        // 'effectiveHeight',
        // 'effectiveLeft',
        // 'effectiveMarginBottom',
        // 'effectiveMarginLeft',
        // 'effectiveMarginRight',
        // 'effectiveMarginTop',
        // 'effectiveMinHeight',
        // 'effectiveMinWidth',
        // 'effectivePaddingBottom',
        // 'effectivePaddingLeft',
        // 'effectivePaddingRight',
        // 'effectivePaddingTop',
        // 'effectiveTop',
        // 'effectiveWidth',
        // 'flexGrow',
        // 'flexShrink',
        // 'flexWrapBefore',
        // 'height',
        // 'horizontalAlignment',
        // 'iosOverflowSafeArea',
        // 'iosOverflowSafeAreaEnabled',
        // 'isCollapsed',
        // 'isEnabled',
        // "isLayoutRequired",
        // "isLayoutValid",
        // "isLoaded",
        // "isUserInteractionEnabled",
        // "left",
        // "margin",
        // "marginBottom",
        // "marginLeft",
        // "marginRight",
        // "marginTop",
        // "minHeight",
        // "minWidth",
        // "modal",
        // "opacity",
        // "order",
        // "originX",
        // "originY",
        // "perspective",
        // "recycleNativeView",
        // "rotate",
        // "rotateX",
        // "rotateY",
        // "row",
        // "rowSpan",
        // "scaleX",
        // 'scaleY',
        // 'style',
        // 'top',
        // 'translateX',
        // 'translateY',
        // 'typeName',
        // 'verticalAlignment',
        // 'viewController',
        // 'visibility',
        // 'width'
        'text',
        'typeName'
    ]
    for(let a of atts) {
        comp[a] = view.get(a)
    }
    let sz = view.getActualSize()
    let loc = view.getLocationInWindow()
    comp.bounds = {
        top: loc.y,
        left : loc.x,
        width: sz.width,
        height: sz.height,
        z : loc.z
    }
    comp.children = []
    view.eachChildView((child:View) => {
        comp.children.push(compView(child))
        return true;
    })
    comp.children.sort((a:any,b:any) => {
        let at = a.bounds?.top || Number.MAX_SAFE_INTEGER
        let bt = b.bounds?.top || Number.MAX_SAFE_INTEGER
        if(at < bt) return -1
        if(at > bt) return 1
        return 0
    })
    return comp
}
export async function tree() {
    let tree:any = {}
    const page:Page = Frame.topmost().currentPage;
    let view:View = page.content
    tree.pageId = page.id
    tree.content = compView(view)
    return tree
}

// Screenshot for NS

const nshot  = require('nativescript-screenshot')

export async function screenshot(name:string) {
    console.log("Attempting Nativescript screenshot for ", name)
    const page:Page = Frame.topmost().currentPage;
    let view:View = page.content

    const ni = nshot.getImage(view)
    console.log('we have our native image', ni)
    console.log('skipping image source stuff...')
    // const imgsrc = new ImageSource(ni)
    // console.log('we have our image source', imgsrc)

    // desktop save image directly to project root from build directory
    // but we can't do that from NS,
    // so we send back a base64 string
    // const b64 = imgsrc.toBase64String('png')
    const b64 = 'data-foobar'//:image/png;base64,abcdefgbase64-todayisnotagooddaytodebug'
    console.log("We have base64", b64)
    return b64
}
