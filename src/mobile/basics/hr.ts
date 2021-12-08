
import ComponentBase from '../ComponentBase'
import {Color} from "@nativescript/core";

export class Hr extends ComponentBase {
    // Override to create our label
    public createControl() {
        this.set('width', '100%')
        this.set('height','0');
        this.borderWidth = 2;
        this.borderColor = new Color('black')
        this.set('horizontalAlignment', 'center')
        this.className = 'hr'
    }

}


