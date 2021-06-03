
import {GridLayout, ItemSpec, GridUnitType} from '@nativescript/core'

export class TBGridLayout extends GridLayout {
    templateAreas:string[] = []
    constructor() {
        super()
        // let areas = []
        // let i=1;
        // let areaRow
        // while((areaRow = this.get('areaRow'+i || this.get('arearow'+i)))) {
        //     console.log('found areaRow'+i, areaRow)
        //     areas.push('"'+areaRow+'"')
        //     i++
        // }
        // let ablock = areas.join(' ')
        // console.log('setting template Gap isreas to ', ablock)
        // this.templateAreas = ablock

        this.on('layoutChanged', () => {
            //@ts-ignore
            let gap = Number(this.gridGap)
            if(isFinite(gap)) {
                setTimeout(() => {
                    let kids = this.getChildrenCount()
                    let i = 0;
                    while(i < kids) {
                        let child = this.getChildAt(i)
                        child.margin = gap
                        i++
                    }
                })
            }
        })
    }

    // synonymns
    set gridTemplateColumns(val:string) {
        if(val.substring(0, 6) === 'repeat') {
            let po = val.indexOf('(')
            let pc = val.indexOf(')', po)
            let rx = val.substring(po+1, pc)
            let parts = rx.split(',')
            let count = Number(parts[0])
            let stmt = parts[1]
            val = (stmt+' ').repeat(count)
        }
        this.set('columns', val)
    }
    set gridTemplateRows(val:string) {
        if(val.substring(0, 6) === 'repeat') {
            let po = val.indexOf('(')
            let pc = val.indexOf(')', po)
            let rx = val.substring(po+1, pc)
            let parts = rx.split(',')
            let count = Number(parts[0])
            let stmt = parts[1]
            val = (stmt+' ').repeat(count)
        }
        this.set('rows', val)
    }
    set gap(val:string) {
        this.set('gridGap', val)
    }

    set gridColumnStart(val:string) {
        this.set('col', ''+(Number(val) -1))
    }
    set gridColumnEnd(val:string) {
        let start = Number(this.get('col'))
        let end = Number(val)
        if(isFinite(start) && isFinite(end)) {
            this.set('colSpan', ''+(end-start+1))
        }
    }
    set gridRowStart(val:string) {
        this.set('row', ''+(Number(val) -1))
    }
    set gridRowEnd(val:string) {
        let start = Number(this.get('row'))
        let end = Number(val)
        if(isFinite(start) && isFinite(end)) {
            this.set('rowSpan', ''+(end-start+1))
        }
    }

    set gridTemplateAreas(val:string) {
        let xareas = val.split('/')
        for(let i = 0; i<xareas.length; i++) {
            this.templateAreas.push(xareas[i])
            this.addRow(new ItemSpec(1, GridUnitType.AUTO))
        }
    }
    set areas(val:string) {
        this.gridTemplateAreas = val
    }

    findGridArea(name:string) {
        let info:any = {}
        let rownum = 0;
        this.templateAreas.forEach(row => {
            if(row) {
                let colnum = 0;
                let cols = row.split(' ')
                cols.forEach(c => {
                    if (c === name) {
                        if (info.firstColumn === undefined) {
                            info.firstColumn = colnum
                        } else {
                            info.lastColumn = colnum
                        }
                        if (info.firstRow === undefined) {
                            info.firstRow = rownum
                        } else {
                            info.lastRow = rownum
                        }
                    }
                    colnum++
                })
                rownum++
            }
        })
        return info
    }

}
