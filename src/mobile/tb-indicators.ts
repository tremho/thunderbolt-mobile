
import {
    FlexboxLayout,
    StackLayout,
    AbsoluteLayout,
    Color,
    Image,
    Label,
    Screen
} from '@nativescript/core'
import {getTheApp, EventData} from "./ComponentBase";

class IndicatorInfo {
    id:string = ''
    label:string = ''
    state:string = ''
    className:string = ''
    // tooltip:string = ''
    icons: any

}

const boxSize = 25

export class TBIndicators extends FlexboxLayout {
    _init:boolean = false;

    constructor() {
        super()
        this.height = boxSize;
        // this.set('width', '100%')
        this.horizontalAlignment = 'right'
        this.flexDirection = "row-reverse"
        this.justifyContent = 'space-around'
        this.alignContent = 'flex-start'
        this.backgroundColor = new Color('aliceblue')
        // this.on('layoutChanged', () => {
        //     // if(!this._init) {
        //     //     this._init = true;
        //         const mbWidth = Screen.mainScreen.widthDIPs
        //         let d = 5;
        //         if(mbWidth > Screen.mainScreen.heightDIPs) {
        //             d = 3;
        //         }
        //         const size = this.getActualSize()
        //         let remain = (mbWidth - size.width) / d
        //         console.log('computing spread ', mbWidth, size.width, remain)
        //         this.marginLeft = remain;
        //     // }
        // })
    }
    setIndicators(indicators:IndicatorInfo[]) {
        this.width = (indicators && indicators.length * boxSize) || 0
        const app = getTheApp()
        indicators.forEach(indInfo => {
            const indicator = new StackLayout()
            indicator.className = 'tb-indicator ' + indInfo.className || ''
            indicator.id = indInfo.id

            /* TODO: default class instead of literals */
            indicator.borderColor = new Color('darkblue')
            indicator.borderWidth = 1
            indicator.width = indicator.height = indicator.borderRadius = boxSize
            indicator.margin = boxSize * 0.25;

            const in1 = new StackLayout()
            in1.verticalAlignment = 'middle'
            in1.horizontalAlignment = 'stretch'
            const in2 = new AbsoluteLayout()
            in2.id = indInfo.id // give this control the same id, so it is reflected in the ev.object (todo: no, create our own event)
            const indIcon = new Image()
            indIcon.width = boxSize / 2;
            indIcon.height = boxSize / 2;
            in2.addChild(indIcon)

            const indLabel = new Label()
            indLabel.fontSize = 8
            const labelWrapper = new StackLayout()

            labelWrapper.orientation = 'horizontal'
            labelWrapper.height = labelWrapper.width = indicator.width
            indLabel.horizontalAlignment = 'center'
            indLabel.verticalAlignment = 'middle'
            // indLabel.marginLeft = 8 // a tweak that shouldn't need to be, but is
            labelWrapper.addChild(indLabel)
            in2.addChild(labelWrapper)
            in1.addChild(in2)
            indicator.addChild(in1)
            this.addChild(indicator)

            indicator.set('state', indInfo.state) // sets initial state
            indicator.set('text', indInfo.label) // sets initial text

            const update = () => {
                indLabel.text = indicator.get('text') || ''
                let state = indicator.get('state') || 'default'

                // Sets a class name as a workaround for data attribute selector indicator-state-<state>
                let cn = indicator.className || ''
                let n = cn.indexOf('indicator-state')
                if(n !== -1) {
                    let nn = cn.indexOf(' ', n)
                    if(nn === -1) nn = cn.length
                    cn = cn.substring(0, n) + cn.substring(nn)
                }
                cn += ' indicator-state-'+ state
                indicator.className = cn

                console.log('--------------> Indicator '+indicator.id+' classname is ', indicator.get('className'))

                let icon = (indInfo.icons && indInfo.icons[state])
                indIcon.src = icon
            }
            update() // initial setting

            app.model.bind(indicator, 'indicator-'+indInfo.id, 'state', (comp:any, prop:string, value:any, oldValue:any) => {
                comp.set(prop, value) // echo state to indicator property
                update() // then update based on that
            })
        })
    }
}


