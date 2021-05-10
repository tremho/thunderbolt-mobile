
import {
    FlexboxLayout,
    StackLayout,
    AbsoluteLayout,
    Color,
    EventData,
    Image,
    Label
} from '@nativescript/core'

/*
                            label="{item.label}"
                            id="{item.id}"
                            state="{item.state}"
                            className="{item.className}"
                            type="{item.type}"
                            tooltip="{item.tooltip}"
                            icons="{item.icons}"
 */
class ToolInfo {
    id:string = ''
    label:string = ''
    state:string = ''
    className:string = ''
    // tooltip:string = ''
    icons: any

}

const boxSize = 25

export class TBToolbar extends FlexboxLayout {

    constructor() {
        super()
        this.height = boxSize;
        this.flexDirection = "row"
        this.backgroundColor = new Color('aliceblue')
    }
    setTools(tools:ToolInfo[]) {
        this.width = (tools && tools.length * boxSize) || 0
        tools.forEach(tool => {
            const toolButton = new StackLayout()
            toolButton.className = tool.className
            toolButton.width = boxSize

            /* TODO: default class instead of literals */
            toolButton.borderColor = new Color('blue')
            toolButton.borderWidth = 1
            toolButton.paddingLeft = 4;

            const in1 = new StackLayout()
            in1.verticalAlignment = 'middle'
            in1.horizontalAlignment = 'center'
            const in2 = new AbsoluteLayout()
            in2.id = tool.id // give this control the same id, so it is reflected in the ev.object (todo: no, create our own event)
            in2.on('tap', (ev:EventData) => {
                console.log('toolbar perform action', ev.eventName, ev.object)
            })
            toolButton.set('state', '')
            let icon = (tool.icons && tool.icons.default)
            if(icon) {
                const tbIcon = new Image()
                tbIcon.width = 20
                tbIcon.height = 20
                tbIcon.src = icon
                in2.addChild(tbIcon)
            }
            const tbLabel = new Label()
            tbLabel.text = tool.label || ''
            tbLabel.fontSize = 8
            const labelWrapper = new StackLayout()

            labelWrapper.orientation = 'horizontal'
            labelWrapper.height = labelWrapper.width = toolButton.width
            tbLabel.horizontalAlignment = 'center'
            tbLabel.verticalAlignment = 'middle'
            tbLabel.marginLeft = 5 // a tweak that shouldn't need to be, but is
            labelWrapper.addChild(tbLabel)
            in2.addChild(labelWrapper)
            in1.addChild(in2)
            toolButton.addChild(in1)
            this.addChild(toolButton)
        })
    }
}


