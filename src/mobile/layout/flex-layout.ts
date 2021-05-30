
import {FlexboxLayout, PercentLength} from '@nativescript/core'

export class FlexLayout extends FlexboxLayout {
    constructor() {
        super();
        let ha = this.horizontalAlignment
        if(!ha || ha === 'stretch') ha = 'left' // stretch is the default, we want left
        this.horizontalAlignment = ha

        // let direction = this.get('flexDirection') || this.get('flexdirection')
        // let orientation = direction === "row" ? "horizontal" : direction==="column" ? "vertical" : this.get('orientation') || 'vertical'
        // let wrap = this.get('flexWrap') || this.get('flexwrap') || 'nowrap'
        // let flexFlow = this.get('flexFlow') || this.get('flexflow') || (orientation === 'horizontal' ? "row" : "column") + " "+wrap
        // if(flexFlow) {
        //     let p = flexFlow.split(' ')
        //     direction = p[0].trim().toLowerCase()
        //     if(p[1]) wrap = p[1].trim().toLowerCase()
        // }
        // this.flexDirection = direction
        // this.flexWrap = wrap
        //
        // let justify = (this.get('justify') || this.get('justifycontent') || this.get('justifyContent') ||'').trim().toLowerCase()
        // console.log('justify', justify)
        // if(justify === 'left' || justify === 'top' || justify === 'first' || justify === 'flex-start') justify = 'flex-start'
        // else if(justify === 'right' || justify === 'bottom' || justify === 'last' || justify === 'flex-end') justify = 'flex-end'
        // else if(justify === 'center' || justify === 'flex-center') justify = 'center'
        // else if(justify === 'between' || justify === 'space-between') justify = 'space-between'
        // else if(justify === 'around' || justify === 'space-around') justify = 'space-around'
        // else if(justify === 'evenly' || justify === 'space-evenly') justify = 'space-around' // no support for evenly on {N}
        // else justify = 'flex-start'
        // this.justifyContent = justify
        //
        this.justifyContent = this.get('justifyContent') || this.get('justifycontent') || 'space-between'
        let align = (this.get('alignItems') ||'').trim().toLowerCase()
        if(align === 'left' || align === 'top' || align === 'first' || align === 'flex-start') align = 'flex-start'
        else if(align === 'right' || align === 'bottom' || align === 'last' || align === 'flex-end') align = 'flex-end'
        else if(align === 'center' || align === 'flex-center') align = 'center'
        else if(align === 'stretch' || align === 'baseline') align = align
        else align = 'flex-start'
        this.alignItems = align;

        if(this.flexDirection === 'row') {
            let gw = this.get('width')
            if (!gw || gw === 'auto') {
                this.set('width', '100%')
            }
        }

    }

}


