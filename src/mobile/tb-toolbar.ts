
import {
    FlexboxLayout,
    StackLayout,
    AbsoluteLayout,
    Color,
    Image,
    Label
} from '@nativescript/core'
import {getTheApp, EventData} from "./ComponentBase";

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
        const app = getTheApp()
        tools.forEach(tool => {
            const toolButton = new StackLayout()
            toolButton.className = 'tb-toolbutton ' + tool.className || ''
            toolButton.id = tool.id
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
            in2.on('tap', (ev:any) => {
                // console.log('toolbar perform action', ev.eventName, ev.object)
                const ed = new EventData()
                ed.app = getTheApp()
                ed.sourceComponent = this
                ed.eventType = ev.eventName
                ed.tag = 'action'
                ed.app.onToolAction(tool)
            })
            const tbIcon = new Image()
            tbIcon.width = 20
            tbIcon.height = 20
            in2.addChild(tbIcon)

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

            toolButton.set('state', tool.state) // sets initial state

            const update = () => {
                let state = toolButton.get('state') || 'default'

                // Sets a class name as a workaround for data attribute selector tool-state-<state>
                let cn = toolButton.className || ''
                let n = cn.indexOf('tool-state')
                if(n !== -1) {
                    let nn = cn.indexOf(' ', n)
                    if(nn === -1) nn = cn.length
                    cn = cn.substring(0, n) + cn.substring(nn)
                }
                cn += ' tool-state-'+ state
                toolButton.className = cn

                // console.log('--------------> ToolButton '+tool.id+' classname is ', toolButton.get('className'))
                // console.log('--------------> ToolButton '+tool.id+' state is ', toolButton.get('state'))

                let icon = (tool.icons && tool.icons[state])
                tbIcon.src = icon
            }
            update() // initial setting

            app.model.bind(toolButton, 'toolbar-'+tool.id, 'state', (comp:any, prop:string, value:any, oldValue:any) => {
                comp.set(prop, value) // echo state to toolbutton property
                update() // then update based on theat
            })
        })
    }
}


