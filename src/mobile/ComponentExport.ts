
import {StackLayout, Label} from '@nativescript/core'

import {TBPage,TBContent} from "./tb-page";
import {SimpleLabel} from "./basics/simple-label";
import {SimpleButton} from "./basics/simple-button";
import {SimpleSlot} from "./basics/simple-slot";
import {TextArea} from "./basics/text-area"
import {SimpleList} from "./list/simple-list";
import {TBScrollView} from "./layout/scroll-view";
import {FillSpace} from "./layout/fill-space";
import {FlexLayout} from "./layout/flex-layout";
import {GridSection} from "./layout/grid-section";
import {TBStackLayout} from "./layout/stack-layout";
import {TBGridLayout} from "./layout/grid-layout";
import {CondSect} from "./layout/cond-sect"


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

export {TBPage as TBPage}
export {TBContent as TBContent}
export {SimpleLabel as SimpleLabel}
export {SimpleButton as SimpleButton}
export {TextArea as TextArea}
export {SimpleList as SimpleList}
export {TBScrollView as ScrollView}
export {SimpleSlot as SimpleSlot}
export {FillSpace as FillSpace}
export {FlexLayout as FlexLayout}
export {TBGridLayout as GridLayout}
export {GridSection as GridSection}
export {TBStackLayout as StackLayout}

export {CondSect as CondSect}

export {makeDiv as makeDiv}
export {makeSpan as makeSpan}
export {makeLabel as makeLabel}
