
import * as AppGateway from '../ApiGateway'
import {Frame, Page, View} from '@nativescript/core'

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
        'typeNaee'
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

// perform a menu action
// perform a tool action
//
// take + record screenshot

