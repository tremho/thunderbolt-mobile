/**
 * Makes a working fromObject method for Observable, which should be part of Nativescript, but hasn't really ever worked.
 */

import {Observable as TNSObservable} from "@nativescript/core";

export class Observable extends TNSObservable {

  static fromObject (source:object, recurse = true) {
    const props = new TNSObservable()
    const names = Object.getOwnPropertyNames(source)
    for (let i = 0; i < names.length; i++) {
      const p = names[i]
      //@ts-ignore
      if (typeof source[p] !== 'object') {
        //@ts-ignore
        props.set(p, source[p])
      } else if(recurse) {
        //@ts-ignore
        if(Array.isArray(source[p])) {
          throw Error('No support for ObservableArray yet')
        }
        //@ts-ignore
        props.set(p, Observable.fromObject(source[p], recurse)) // todo: recurse could be a depth
      }
    }
    return props

  }
}

module.exports = {
  Observable
}
