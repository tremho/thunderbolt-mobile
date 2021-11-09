
import {clientTest} from "./WSClient";

export async function startTest(host:string = 'localhost') {
    let service = "ws://"+host+":51610"
    return clientTest(service)
}
