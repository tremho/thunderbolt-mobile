
import ComponentBase from '../ComponentBase'

export class Hr extends ComponentBase {

    // Override to create our label
    public createControl() {
        this.component.set('height', '10')
        this.component.set('horizontalAlignment', 'center')
        this.component.set('backgroundColor', 'black')
        this.component.set('width', '100%')
        this.component.set('height', '10')
        this.component.className = 'hr'
    }
}


