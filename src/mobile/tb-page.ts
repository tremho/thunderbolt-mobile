import {
    View,
    Label,
    Image,
    Color,
    AbsoluteLayout,
    StackLayout,
    GridLayout,
    Screen,
    CoreTypes
} from '@nativescript/core'
import {GridUnitType, ItemSpec} from "@nativescript/core/ui/layouts/grid-layout"
import {isAndroid, device} from "@nativescript/core/platform";

import {AndroidApplication} from "@nativescript/core"

import {getTheApp} from './ComponentBase'
import {TBToolbar} from "./tb-toolbar";
import {TBIndicators} from "./tb-indicators";

export class TBPage extends GridLayout {
    private _isInit:boolean = false
    private back:Label|undefined
    private mbox:Label|undefined
    private _title:Label|undefined
    private menuDrop:MenuDrop|undefined
    private pageWidth:number = 0

    constructor() {
        super();
        this.automationText = 'appium-interop'

        this.on('layoutChanged', () => {
            // console.log('in layoutChanged')
            let pageWidth:number|undefined = this.page.getActualSize().width
            // console.log('tbPage layoutChange ',pageWidth, this.pageWidth)
            if(this.pageWidth !== pageWidth) {
                this.pageWidth = pageWidth
                if(this._isInit && this.get('reloadOnOrientationChange') === 'true') {
                    // console.log("---------------- Reloading due to orientation change --------------")
                    return getTheApp().reloadCurrentPage()
                }
                this._isInit = true;
                // We are now rebuilding the title bar entirely on a layout change
                this.removeColumns()
                this.removeRows()
                let c;
                let i = 0;
                while((c = this.getChildAt(i++))) {
                    if(c instanceof TBContent) continue;
                    this.removeChild(c)
                }

                this.addColumn(new ItemSpec(1, GridUnitType.AUTO))
                this.addRow(new ItemSpec(1, GridUnitType.AUTO))
                this.addRow(new ItemSpec(1, GridUnitType.STAR))

                // console.log("%%%%%%%%%%%%%%%%%%%% Constructing MenuBar")
                const menuBar = new GridLayout()
                menuBar.removeColumns();
                menuBar.removeRows()
                menuBar.removeChildren();

                // back, toolbar, menu, title, indicators
                menuBar.addRow(new ItemSpec(1, GridUnitType.AUTO))
                menuBar.addColumn(new ItemSpec(1, GridUnitType.AUTO))
                menuBar.addColumn(new ItemSpec(1, GridUnitType.AUTO))
                menuBar.addColumn(new ItemSpec(1, GridUnitType.AUTO))
                menuBar.addColumn(new ItemSpec(2, GridUnitType.STAR))
                menuBar.addColumn(new ItemSpec(1, GridUnitType.AUTO))

                menuBar.className = 'tb-title-bar' // I think 'title-bar' must be used by {N} because I get weird results using that name

                // menuBar.width = PercentLength.parse('100%')
                // menuBar.marginTop = 24

                this.back = new Label()
                this.back.className = 'back-button'
                // this.back.marginTop = 7
                // this.back.marginLeft = 4
                menuBar.addChildAtCell(this.back, 0,0)

                const toolbar = new TBToolbar()

                // the behavior here between iOS and Android is seriously different.
                // we can't dynamically change the grid cell target this goes to, so
                // for Android we wrap the target where we can control this via CSS
                // IOS insists on being hard-set (see TBToolbar) and will be invisible if we try do wrap it like Android.
                // but IOS will treat the flexbox width as the wrap boundary, so we can work with that.
                // Conversely, Android does not honor that for wrap purposes; it needs the wrapper to limit its flow
                // so we do it two different ways depending on platform
                let gridcomp:View = toolbar
                if(isAndroid) {
                    const toolBarContainer = new StackLayout()
                    toolBarContainer.className = 'tool-bar-container'
                    toolBarContainer.orientation = 'horizontal'
                    gridcomp = toolBarContainer
                    toolBarContainer.addChild(toolbar)
                }
                menuBar.addChildAtCell(gridcomp, 0, 1)

                this.mbox = new Label()
                this.mbox.className = 'menu-box'
                this.mbox.text = '\u2630'
                menuBar.addChildAtCell(this.mbox, 0,2)
                this._title = new Label()
                this._title.className = 'title'
                menuBar.addChildAtCell(this._title, 0,3)


                this.addChildAtCell(menuBar,0,0)

                // each time layout changes, check to see if we need to change to constrained mode
                // console.log('testing for constraint change at ', this.getActualSize().width)
                // note N.B.: we don't have any other classnames at Page level. System classes are above this.
                // and I had a weird problem with multiple names that makes it easier to just assume this case of class name set or empty
                let isTiny = pageWidth <=320
                if(pageWidth < 380) {
                    // console.log('yep, constrained it is')
                    this.page.className = 'constrained'

                    // console.log(JSON.stringify(device, null, 2))
                    // console.log('Scale: ',Screen.mainScreen.scale)

                    // console.log('pageWidth', pageWidth)
                    // console.log('scale', Screen.mainScreen.scale)

                    if(isAndroid) {
                        isTiny = isTiny && Screen.mainScreen.scale < 1
                    }
                    if(isTiny) this.page.className += ' tiny'
                } else {
                    let isSmall = false;  // small only applies to android
                    if(isAndroid) {
                        isSmall = !isTiny && Screen.mainScreen.scale < 2
                    }
                    this.page.className = isSmall ? 'small' : ''
                    // console.log('not constrained')
                }
                console.log('page classname', this.page.className)

                //// ----->>>>
                let nbText = this.get('noBack')
                const noBack = this.get('noBack') === 'true'
                const title = this.get('title') || this.get('text') || 'Default title'
                const menuId = this.get('menu-id')
                const toolbarId = this.get('toolbar-id')
                const indicatorsId = this.get('indicators-id')
                // console.log('menuId, toolbarId, indicatorsId', menuId, toolbarId, indicatorsId)
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
                    if(this.back) this.back.text = noBack ? " " : "Back"
                    if(this._title) this._title.text = title
                })
                if (!menuId) this.mbox.visibility = 'hidden' // or this.mbox.hidden = true, although that would alter layout.
                else {
                    this.mbox.on('tap', (ev)=> {
                        if(this.isMenuOpen()) this.closeMenu()
                        else this.openMenu()
                    })
                }
                const indicators = new TBIndicators()
                // indicators.verticalAlignment = 'middle'
                // indicators.horizontalAlignment = 'right'
                menuBar.addChildAtCell(indicators, 0, 4)

                // console.log('>>>>>>>>> Doing tb-page toolbar setup >>>>>>>>>>>')
                const model = getTheApp().model
                let tools
                try {
                    tools = toolbarId && model.getAtPath('toolbar.' + toolbarId)
                }
                catch(e:any) {
                    console.warn('failed to set tools', e.message)
                }
                // console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<')
                let indicatorItems
                try {
                    indicatorItems = indicatorsId && model.getAtPath('indicators.'+indicatorsId)
                } catch(e:any) {
                    console.warn('failed to set indicators', e.message)
                }
                toolbar.setTools(tools || [])
                if(indicatorItems) indicators.setIndicators(indicatorItems || [])

            }

        })
    }
    openMenu() {
        // console.log('open menu')
        const menuId = this.get('menu-id')
        const model = getTheApp().model
        let menu
        // get the menu
        // console.log('looking for menu info at menu.'+menuId)
        try {
            menu = model.getAtPath('menu.'+menuId) || ''
        } catch(e:any) {
            console.error(e)
        }
        console.log('menu',menu)
        if(this.mbox) {
            let items = menu.children || []
            this.menuDrop = new MenuDrop(this.pageWidth)
            const menuDropView = new MenuListContainer()
            items.forEach((item: MenuItemInfo) => {
                // TODO: create a response object here extend Label
                const mi = new MenuItem(this, item, 0)
                menuDropView.addChild(mi)
            })
            this.menuDrop.marginTop = -24

            const loc = this.mbox.getLocationRelativeTo(this)
            const size = this.mbox.getActualSize()
            menuDropView.marginLeft = loc.x + size.width
            menuDropView.marginTop = 4
            this.menuDrop.setMenu(menuDropView)
            this.addChildAtCell(this.menuDrop, 1, 0)
        }
    }
    closeMenu() {
        if(this.menuDrop) {
            this.menuDrop.removeMenu()
            delete this.menuDrop;
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
    iconSize: number[] = []
    disabled:boolean = false
    children:MenuItemInfo[]|undefined

}

class MenuItem extends StackLayout {
    // _isInit:boolean = false
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
            let path = info.icon
            if(path.charAt(0) == path.charAt(path.length-1) && (path.charAt(0) === '"' || path.charAt(0) === "'")) {
                path = path.substring(1, path.length-1)
            }
            ispan.src = '~/assets/'+ path
            ispan.className = 'menuIcon' // sadly has no effect. default of 20 set below.
            ispan.width = info.iconSize && info.iconSize[0] || 20;
            ispan.height = info.iconSize && (info.iconSize[1] || info.iconSize[0]) || 20;

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
                us.tbPage.closeMenu()
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
        this.off('tap')
        this.isPassThroughParentEnabled = true;
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