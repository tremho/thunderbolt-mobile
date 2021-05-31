
import {GridLayout, ItemSpec, GridUnitType} from '@nativescript/core'

export class TBGridLayout extends GridLayout {
    constructor() {
        super()
        this.on('layoutChanged', () => {
            //@ts-ignore
            let gap = Number(this.gridGap)
            if(isFinite(gap)) {
                let kids = this.getChildrenCount()
                let i = 0;
                while(i < kids) {
                    let child = this.getChildAt(i)
                    child.margin = gap
                    i++
                }
            }
        })
    }

}
