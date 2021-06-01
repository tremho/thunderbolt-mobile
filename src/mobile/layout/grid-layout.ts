
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
        // console.log('setting template areas to ', ablock)
        // this.templateAreas = ablock

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
    set gap(val:string) {
        this.set('gridGap', val)
    }

    // area rows
    set areaRow1(val:string) {
        this.templateAreas[1] = val
        this.addRow(new ItemSpec(1, GridUnitType.AUTO))
    }
    set areaRow2(val:string) {
        this.templateAreas[2] = val
        this.addRow(new ItemSpec(1, GridUnitType.AUTO))
    }
    set areaRow3(val:string) {
        this.templateAreas[3] = val
        this.addRow(new ItemSpec(1, GridUnitType.AUTO))
    }
    set areaRow4(val:string) {
        this.templateAreas[4] = val
        this.addRow(new ItemSpec(1, GridUnitType.AUTO))
    }
    set areaRow5(val:string) {
        this.templateAreas[5] = val
        this.addRow(new ItemSpec(1, GridUnitType.AUTO))
    }
    set areaRow6(val:string) {
        this.templateAreas[6] = val
        this.addRow(new ItemSpec(1, GridUnitType.AUTO))
    }
    set areaRow7(val:string) {
        this.templateAreas[7] = val
        this.addRow(new ItemSpec(1, GridUnitType.AUTO))
    }
    set areaRow8(val:string) {
        this.templateAreas[8] = val
        this.addRow(new ItemSpec(1, GridUnitType.AUTO))
    }
    set areaRow9(val:string) {
        this.templateAreas[9] = val
        this.addRow(new ItemSpec(1, GridUnitType.AUTO))
    }
    set areaRow10(val:string) {
        this.templateAreas[10] = val
        this.addRow(new ItemSpec(1, GridUnitType.AUTO))
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
