
import * as testActions from './TestActions'

function add(num1:number, num2:number) {
    return num1+num2
}

function subtract(num1:number, num2:number) {
    return num1-num2
}

function multiply(num1:number, num2:number) {
    return num1*num2
}

function divide(num1:number, num2:number) {
    return num1/num2
}

function sayHello(to:string) {
    return "hello, "+to
}
async function doSomethingAsync():Promise<string> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve('Okay, here I am')
        }, 1000)
    })
}

let report = ''

function record(action:string, result:any) {
    report += action + ' = ' + result + '\n'
}

export function getReport() {
    const rpt = report
    report = ''
    return rpt
}

export async function executeDirective(action:string):Promise<string> {
    // console.log('client: executeDirective', action)
    const parts = action.split(' ')
    const cmd = parts[0]
    const arg1 = parts[1]
    const arg2 = parts[2]
    let res
    switch(cmd) {
        case 'add': {
            res = add(Number(arg1), Number(arg2))
        }
        break
        case 'subtract': {
            res = subtract(Number(arg1), Number(arg2))
        }
        break
        case 'multiply': {
            res = multiply(Number(arg1), Number(arg2))
        }
        break
        case 'divide': {
            res = divide(Number(arg1), Number(arg2))
        }
        break
        case 'greet': {
            res = sayHello(arg1)
        }
        break
        case 'fetch': {
            res = await doSomethingAsync()
        }
            break;
        default: {
            const tactany:any = testActions
            const ta = tactany[cmd]
            // console.log('looking for testAction', cmd)
            if(typeof ta === 'function') {
                // console.log('found', cmd, ...parts.slice(1))
                res = await ta(...parts.slice(1))
                // console.log('result is ', res)
            }
        }
            break
    }
    return Promise.resolve(res).then((rec) => {
        rec = typeof rec === 'object' ? JSON.stringify(rec) : ''+rec
        record(action, rec)
        return rec
    })
}
