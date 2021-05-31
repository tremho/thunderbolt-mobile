
import {FlexboxLayout, PercentLength} from '@nativescript/core'

export class FlexLayout extends FlexboxLayout {
    constructor() {
        super();
        let ha = this.horizontalAlignment
        if(!ha || ha === 'stretch') ha = 'left' // stretch is the default, we want left
        this.horizontalAlignment = ha

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


