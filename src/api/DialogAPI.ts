
import * as NSDialog from "@nativescript/core/ui/dialogs"

export class DialogOptions {
    title?:string       // Does not display on Mac
    message?:string     // bold text
    detail?:string      // small normal text (message and detail merge as single text block on Nativescript)
    type:string = 'none' // none, info, error, question, warning
    buttons?:string[]  // up to 3 is supportable on NS, beyond that will be ignored.
    selectedButtonIndex?:number
}

export function openDialog(dialogOptions:DialogOptions):Promise<number> {
    return new Promise(resolve => {
        const title = dialogOptions.title
        const message = dialogOptions.message +'\n' +dialogOptions.detail
        const buttons:string[] = (dialogOptions.buttons as string[])
        if(buttons.length === 1) {
            NSDialog.alert({title, message, okButtonText:buttons[0]}).then(()=>{
                resolve(0)
            })
        }
        if(buttons.length >=1 && buttons.length <=3) {
            NSDialog.confirm({title, message,
                            okButtonText:buttons[0],
                            cancelButtonText:buttons[1],
                            neutralButtonText:buttons[2]
                          }).then((brt:boolean) => {
                    if(brt === true) resolve(0)
                    if(brt === false) resolve(1)
                    resolve(2)
            })
        }
    })
}