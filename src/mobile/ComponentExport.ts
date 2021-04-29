
const SimpleLabel = require('./basics/simple-label')
const SimpleButton = require('./basics/simple-button')
const SimpleSlot = require('./basics/simple-slot')
const FillSpace = require('./layout/fill-space')
const FlexLayout = require('./layout/flex-layout')
const GridLayout = require('./layout/grid-layout')
const GridSection = require('./layout/grid-section')
const TBStackLayout = require('./layout/stack-layout')

const {StackLayout, Label} = require('@nativescript/core')

function makeDiv() {
    return new StackLayout()
}
function makeSpan() {
    const sl = new StackLayout()
    sl.orientation = 'horizontal'
    return sl
}
function makeLabel(text:string) {
    const label = new Label()
    label.set('text', text)
    return label
}

export {SimpleLabel as SimpleLabel}
export {SimpleButton as SimpleButton}
export {SimpleSlot as SimpleSlot}
export {FillSpace as FillSpace}
export {FlexLayout as FlexLayout}
export {GridLayout as GridLayout}
export {GridSection as GridSection}
export {TBStackLayout as StackLayout}

export {makeDiv as makeDiv}
export {makeSpan as makeSpan}
export {makeLabel as makeLabel}
