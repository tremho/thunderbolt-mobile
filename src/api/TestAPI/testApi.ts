
import {WSClient, clientTest} from "./WSClient";

let testStatus:string = "{}"

function setTestStatus(inStatus:any) {
    testStatus = JSON.stringify(inStatus)
}

export async function startTest(host:string) {
    console.log('Jove Mobile test host is', host)
    let service = "ws://"+host+":51610"
    console.log('  .... service is', service)
    return new Promise(resolve => {
        let service = "ws://"+host+":51610"

        clientTest(service).then((code:number) => {
            console.log('done', code)
            resolve(code)
        })
    })
}
