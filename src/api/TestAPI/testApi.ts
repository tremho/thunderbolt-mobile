
import {H2Client} from "./H2Client";

let testStatus:string = "{}"

function setTestStatus(inStatus:any) {
    testStatus = JSON.stringify(inStatus)
}

export async function startTest(testPath:string = '/test') {
    const client = new H2Client()
    console.log('Client starting')
    client.request(testPath)
    let alive = true
    while(alive) {
        const code = await client.syncStatus(testStatus)
        alive = await client.processDirectives()
    }

    console.log('done')
    client.end()
}
