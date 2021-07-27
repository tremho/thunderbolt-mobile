
import ComponentBase from '../ComponentBase'

import {Label, Color, StackLayout} from '@nativescript/core'

class ListItem extends Label {
    public index:number = 0
    public displayText:string

    constructor(i:number, t:string) {
        super()
        this.className = 'list-item'
        this.text = this.displayText = t
        this.index = i
    }

}

export class SimpleList extends ComponentBase {
    listBox:StackLayout = new StackLayout()
    items:string[] = []

    // Override to create our label
    public createControl() {
        const itemStr = this.get('item') || this.get('items')
        this.items = itemStr.split(',')
        let index = 0;
        for(let text of this.items) {
            const listItem = new ListItem(index, text)
            listItem.on('tap', (ev)=>{
                this.newSelection(listItem.index)
                this.respondToAction(listItem, ev, 'tap', 'action', {text:listItem.displayText, index: listItem.index })
            })
            this.listBox.addChild(listItem)
            index++
        }
        this.container.addChild(this.listBox)
    }
    public newSelection(selectedIndex:number) {
        let i = 0
        let view
        while((view=this.listBox.getChildAt(i))) {
            let listItem:ListItem = (view as ListItem)
            const selected = (listItem.index === selectedIndex)
            listItem.className = 'list-item' + (selected ? ' selected' : ' normal')
            i++
        }
    }

    protected setProperties() {
    }

}


