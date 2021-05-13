// import {EventData, getTheApp} from "thunderbolt-common"
import {
    View,
    Label,
    Image,
    Color,
    FlexboxLayout,
    AbsoluteLayout,
    StackLayout,
    GridLayout,
    PercentLength, CoreTypes
} from '@nativescript/core'
import {GridUnitType, ItemSpec} from "@nativescript/core/ui/layouts/grid-layout"
import * as imageSourceModule from "@nativescript/core/image-source"

import {getTheApp} from './ComponentBase'
import {TBToolbar} from "./tb-toolbar";
import {TBIndicators} from "./tb-indicators";

const ITEMBOXSIZE = 12; // TODO: Compute from screen height
const TITLESIZE = 16; // TODO: Compute from screen height

export class TBPage extends GridLayout {
    private _isInit: boolean = false
    private back:Label
    private mbox:Label
    private _title:Label
    private menuDrop:MenuDrop|undefined
    private pageWidth:number = 0

    constructor() {
        super();
        this.addColumn(new ItemSpec(1, GridUnitType.AUTO))
        this.addRow(new ItemSpec(1, GridUnitType.AUTO))
        this.addRow(new ItemSpec(1, GridUnitType.AUTO))


        // console.log("%%%%%%%%%%%%%%%%%%%% Constructing MenuBar")
        const menuBar = new GridLayout()
        // back, toolbar, menu, title, indicators
        menuBar.addRow(new ItemSpec(5, GridUnitType.AUTO))
        menuBar.addColumn(new ItemSpec(1, GridUnitType.AUTO))
        menuBar.addColumn(new ItemSpec(1, GridUnitType.AUTO))
        menuBar.addColumn(new ItemSpec(1, GridUnitType.AUTO))
        menuBar.addColumn(new ItemSpec(2, GridUnitType.STAR))
        menuBar.addColumn(new ItemSpec(1, GridUnitType.AUTO))

        menuBar.className = 'title-bar'

        menuBar.width = PercentLength.parse('100%')
        menuBar.marginTop = 24
        // menuBar.alignItems = 'center' // note may not work for ios
        // menuBar.justifyContent = 'flex-start'
        this.back = new Label()
        this.back.className = 'back-button'
        // this.back.marginTop = 7
        // this.back.marginLeft = 4
        menuBar.addChildAtCell(this.back, 0,0)

        const toolbar = new TBToolbar()
        menuBar.addChildAtCell(toolbar, 0, 1)

        this.mbox = new Label()
        this.mbox.className = 'menu-box'
        this.mbox.text = '\u2630'
        // console.log('----- created and adding mbox')
        menuBar.addChildAtCell(this.mbox, 0,2)
        this._title = new Label()
        this._title.className = 'title'
        // console.log('----- created and adding title')
        menuBar.addChildAtCell(this._title, 0,3)


        this.addChildAtCell(menuBar,0,0)
        this.on('layoutChanged', () => {
            // console.log('in layoutChanged')
            if (!this._isInit) {
                this._isInit = true
                let nbText = this.get('noBack')
                // console.log('>>>>>>>>>>>>  TBPage noBack ', nbText)
                const noBack = this.get('noBack') === 'true'
                // console.log('noBack boolean ', noBack)
                const title = this.get('title') || this.get('text') || 'Default title'
                const menuId = this.get('menu-id')
                const toolbarId = this.get('toolbar-id')
                const indicatorsId = this.get('indicators-id')

                if(!noBack) {
                    // console.log('--- applying tap handler to back button')
                    this.back.on('tap', (ev)=> {
                        // console.log('go back')
                        getTheApp().navigateBack()
                    })
                }

                // text must be applied behind a timeout
                setTimeout(() => {
                    // console.log('----- applying text')
                    this.back.text = noBack ? " " : "Back"
                    this._title.text = title
                })
                if (!menuId) this.mbox.visibility = 'hidden'
                else {
                    this.mbox.on('tap', (ev)=> {
                        if(this.isMenuOpen()) this.closeMenu()
                        else this.openMenu()
                    })
                }
                const indicators = new TBIndicators()
                indicators.verticalAlignment = 'middle'
                indicators.horizontalAlignment = 'right'
                menuBar.addChildAtCell(indicators, 0, 4)

                const model = getTheApp().model
                let tools = toolbarId && model.getAtPath('toolbar.'+toolbarId)
                if(tools) toolbar.setTools(tools)
                let indicatorItems = indicatorsId && model.getAtPath('indicators.'+indicatorsId)
                if(indicatorItems) indicators.setIndicators(indicatorItems)
            }
        })
    }
    openMenu() {
        // console.log('open menu')
        const menuId = this.get('menu-id')
        const model = getTheApp().model
        let menu
        // get the menu
        try {
            menu = model.getAtPath('menu.'+menuId) || ''
        } catch(e) {
            console.error(e)
        }
        let items = menu.children || []
        this.menuDrop = new MenuDrop(this.pageWidth)
        const menuDropView = new MenuListContainer()
        items.forEach((item:MenuItemInfo) => {
            // TODO: create a response object here extend Label
            const mi = new MenuItem(this, item, 0)
            menuDropView.addChild(mi)
        })
        this.menuDrop.marginTop = -24
        const loc = this.mbox.getLocationRelativeTo(this)
        const size = this.mbox.getActualSize()
        menuDropView.marginLeft = loc.x + size.width
        menuDropView.marginTop =  4
        this.menuDrop.setMenu(menuDropView)
        this.addChildAtCell(this.menuDrop, 1, 0)

    }
    closeMenu() {
        if(this.menuDrop) {
            this.menuDrop.removeMenu()
            return true
        }
        return false

    }
    getMenuDrop() {
        return this.menuDrop
    }
    isMenuOpen() {
        if (this.menuDrop && this.menuDrop.menu) return true
        return false
    }

}

class MenuItemInfo {
    id:string = ''
    label:string = ''
    type:string = ''
    role:string = ''
    checked:boolean = false
    icon:string = ''
    disabled:boolean = false
    children:MenuItemInfo[]|undefined

}

class MenuItem extends StackLayout {
    _isInit:boolean = false
    tbPage:TBPage
    info:MenuItemInfo
    level: number = 0

    constructor(tbPage:TBPage, info:MenuItemInfo, level:number) {
        super()
        this.orientation = "horizontal"
        let cspan, ispan, label
        if (info.role !== 'separator') {
            label = new Label()
        }
        if(info.type==='checkbox') {
            // console.log('checkbox ', info)
            cspan = new Label()
            cspan.fontSize = 16 // TODO: Relative font sizing strategy
            cspan.text = info.checked ? '\u2611' : '\u2610'
            cspan.paddingRight = 4
        }
        if(info.icon) {
            ispan = new Image()
            ispan.src = '~/assets/0_smile.png'
            ispan.width = ispan.height = 20
            // try {
            //     if (info.icon.indexOf('http') === 0 && info.icon.indexOf('://') !== -1) {
            //         imageSourceModule.ImageSource.fromUrl(info.icon).then(imgsrc => {
            //             ispan.imageSource = imgsrc
            //         })
            //     } else {
            //         console.log('going for imagesource from file', info.icon)
            //         ispan.imageSource = imageSourceModule.ImageSource.fromFileSync(info.icon)
            //     }
            // } catch (e) {
            //     console.error(e)
            //     throw e
            // }

        }
        if(label) {
            label.text = info.label
            if (info.children && info.children.length) {
                label.text += ' \u25b8'
            }
        }
        this.color = new Color(info.disabled ? 'lightgray' : 'black')
        if(cspan) this.addChild(cspan)
        if(ispan) this.addChild(ispan)
        if(label) this.addChild(label)
        if(info.role === 'separator') {
            this.backgroundColor = 'darkgray'
            this.height = 1
            this.margin = 6
        }
        this.level = level
        this.tbPage = tbPage
        this.info = info
        this.on('tap',(ev)=>{
            const us:MenuItem = (ev.object as MenuItem)
            if(!us) {
                console.error('no item reference on tap')
                return
            }
            const isSubmenu = us.info.children && us.info.children.length
            if(isSubmenu) {
                us.openSubmenu()
            } else if(us.info.role !== 'separator') {
                const md = us.tbPage.getMenuDrop()
                if (md) md.removeMenu()
                // console.log("clicked on ",us.info)
                getTheApp().onMenuAction(us.info)
            }
        })
    }
    openSubmenu() {
        // this.closeSubmenu()
        const mi = this.info
        const menuDrop = this.tbPage.getMenuDrop()
        const size = this.getActualSize()
        const loc = this.getLocationRelativeTo((menuDrop as View))
        // console.log('loc', loc, 'size', size)
        const submenu = new MenuListContainer();
        (mi.children || []).forEach(smi => {
            const sm = new MenuItem(this.tbPage,smi, this.level +1)
            submenu.addChild(sm)
        })
        submenu.paddingRight = 8
        submenu.marginTop = loc.y
        submenu.marginLeft = loc.x + size.width
        if(menuDrop) menuDrop.setSubmenu(submenu, this.level)
    }
}

class MenuDrop extends AbsoluteLayout {
    public menu:any = null
    public submenu:any[] = []
    private pageWidth:number

    constructor(width:number) {
        super()
        this.pageWidth = width
    }

    setMenu(view:View) {
        this.menu = view
        this.addChild(view)
    }
    setSubmenu(view:View, level:number) {
        this.removeSubmenu(level)
        this.submenu[level] = view
        this.addChild(view)
        view.on('layoutChanged', (ev) => {
            let bounds = this.getActualSize()
            bounds.width = this.pageWidth;
            let loc = view.getLocationRelativeTo(this)
            let size = view.getActualSize()
            let rt = loc.x + size.width
            if(rt > bounds.width) {
                let overlap = rt - bounds.width
                let targetx = loc.x - overlap
                view.animate({
                    translate: {x: -overlap, y: 0},
                    duration: 500,
                    curve: CoreTypes.AnimationCurve.spring
                })
            }
        })
    }
    removeSubmenu(level:number) {
        while(true) {
            if (this.submenu[level]) this.removeChild(this.submenu[level])
            else break
            this.submenu[level] = null
            level++
        }
    }
    removeMenu() {
        this.removeChildren()
        this.menu = null
    }

}

export class TBContent extends StackLayout {
    constructor() {
        super();
        this.row = 1
        this.column = 0
        this.on('layoutChanged', ev => {
            let id = this.parent && this.parent.get('id')
            this.id = `${id}-content`
            this.set('bind', `page.navInfo, page-data.${id} as data`)
        })
    }
}

class MenuListContainer extends StackLayout {

    constructor() {
        super()
        this.backgroundColor = 'white'
        this.borderColor = new Color('black')
        this.borderWidth = 1
        this.color = new Color('black')
        this.padding = 4
        this.minWidth = 100
    }
}