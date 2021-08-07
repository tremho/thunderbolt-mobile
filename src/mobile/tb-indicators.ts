
import {
    FlexboxLayout,
    StackLayout,
    AbsoluteLayout,
    Color,
    Image,
    Label,
    Screen, GestureTypes
} from '@nativescript/core'
import {getTheApp, EventData} from "./ComponentBase";

class IndicatorInfo {
    id:string = ''
    label:string = ''
    state:string = ''
    type:string = ''
    className:string = ''
    // tooltip:string = ''
    icons: any

}

const boxSize = 25

export class TBIndicators extends FlexboxLayout {

    constructor() {
        super()
        this.className = 'indicator-bar'
        // this.height = boxSize;
        // this.horizontalAlignment = 'right'
        // this.flexDirection = "row-reverse"
        // this.justifyContent = 'space-around'
        // this.alignContent = 'flex-start'
        // this.backgroundColor = new Color('aliceblue')
    }
    setIndicators(indicators:IndicatorInfo[]) {
        this.removeChildren()
        this.width = (indicators && indicators.length * boxSize) || 0
        const app = getTheApp()
        // app.model.addSection('indicators', indicators)
        indicators.forEach(indInfo => {
            const indicator = new StackLayout()
            indicator.className = 'tb-indicator ' + indInfo.className || ''
            indicator.id = indInfo.id

            app.model.addSection('indicator-'+indicator.id, indInfo)

            let extension:any
            const extType = indInfo.type
            if(extType) {
                extension = getTheApp().createExtensionType(extType)
            }

            /* TODO: default class instead of literals */
            // indicator.borderColor = new Color('darkblue')
            // indicator.borderWidth = 1
            // indicator.width = indicator.height = indicator.borderRadius = boxSize
            // indicator.margin = boxSize * 0.25;

            const in1 = new StackLayout()
            // in1.verticalAlignment = 'middle'
            // in1.horizontalAlignment = 'stretch'
            const in2 = new AbsoluteLayout()
            in2.id = indInfo.id // give this control the same id, so it is reflected in the ev.object (todo: no, create our own event)
            let propStopped = false
            in2.on(GestureTypes.touch, (ev:any) => {
                if(ev.action === 'up') {
                    propStopped = extension && extension.onRelease && extension.onRelease({component:indicator, info:indInfo})
                }
                if(ev.action === 'down') {
                    propStopped = extension && extension.onPress && extension.onPress({component:indicator, info:indInfo})
                }
            })

            const indIcon = new Image()
            // indIcon.width = boxSize / 2;
            // indIcon.height = boxSize / 2;
            in2.addChild(indIcon)

            const indLabel = new Label()
            // indLabel.fontSize = 8
            const labelWrapper = new StackLayout()

            // labelWrapper.orientation = 'horizontal'
            // labelWrapper.height = labelWrapper.width = indicator.width
            // indLabel.horizontalAlignment = 'center'
            // indLabel.verticalAlignment = 'middle'
            // // indLabel.marginLeft = 8 // a tweak that shouldn't need to be, but is
            labelWrapper.addChild(indLabel)
            in2.addChild(labelWrapper)
            in1.addChild(in2)
            indicator.addChild(in1)
            this.addChild(indicator)

            indicator.set('state', indInfo.state) // sets initial state
            indicator.set('text', indInfo.label) // sets initial text

            const update = () => {
                propStopped = false
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

                // console.log('--------------> Indicator '+indicator.id+' classname is ', indicator.get('className'))

                let icon = (indInfo.icons && indInfo.icons[state])
                indIcon.className = 'indIcon'
                indIcon.src = icon ? '~/assets/'+icon : ''
            }
            update() // initial setting
            if(extension && extension.onSetToPage) extension.onSetToPage({component: indicator, info:indInfo})

            app.model.bind(indicator, 'indicator-'+indInfo.id, 'state', (comp:any, prop:string, value:any, oldValue:any) => {
                comp.set(prop, value) // echo state to indicator property
                update() // then update based on that
                if(extension && extension.onStateChange) extension.onStateChange({component:indicator, info:indInfo}, value)

            })
        })
    }
}


