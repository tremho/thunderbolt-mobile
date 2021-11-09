
import {WSClient} from "./WSClient";

let testStatus:string = "{}"

function setTestStatus(inStatus:any) {
    testStatus = JSON.stringify(inStatus)
}

export async function startTest(host:string) {
    console.log('Jove Mobile test host is', host)
    let service = "ws://"+host+":51610"
    console.log('  .... service is', service)
    // const client = new H2Client()
    // console.log('Client starting')
    // client.request(testPath)
    // let alive = true
    // while(alive) {
    //     const code = await client.syncStatus(testStatus)
    //     alive = await client.processDirectives()
    // }
    //
    // console.log('done')
    // client.end()
}
