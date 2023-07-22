import log from 'loglevel'

const dev = true

export class Null {
  trace (...args) {}
  debug (...args) {}
  info (...args) {}
  warn (...args) {}
}

// const enabled = undefined
const disabled = { }
const enabled = undefined
//const enabled = {
//  // RootMouseControler: true,
//  Dungeon: true,
//  index:true
////   TransactionHorizon: true,
////   ContractOperator: true,
////   GameOperator: true,
////   StateRoster: true
//}


export function getLogger (name) {
  const enable = typeof enabled === 'undefined' || enabled[name]
  const disable = typeof disabled !== 'undefined' && typeof disabled[name] !== 'undefined'

  if (!enable || disable) {
    const _log = new Null()
    try {
      _log.debug('xxx')
    } catch (e) {
      console.log(`LOG LOG LOG BROKEN ${[e, JSON.stringify(e)]}`)
    }
    return _log
  }
  const _log = log.getLogger(Symbol.for(name))
  if (dev) {
    _log.setLevel('TRACE')
    // _log.info('log level: TRACE')
  } else {
    _log.setLevel('INFO')
    // _log.info('log level: INFO')
  }
  return _log
}