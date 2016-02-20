/**
 * redux-delegate-action
 *
 * Delegate an action to be dispatched later. This enables you to queue an
 * action inside a reducer that will be dispatched after the reducer finishes.
 *
 * Functions:
 *   init() Initialize the delegate context with the store.
 *
 *   delegate() Enqueue an action to the delegate buffer to be dispatched on the
 *   next store subscribe() call. Use delegate() inside reducers to have actions
 *   dispatched instead of calling dispatch within the store.
 */
import { Map, List } from 'immutable'

let _ctx = null

/**
 * Clear the current q of any messages, setting it to empty.
 * Will unsubscribe from store if possible
 */
function clearQ () {
  let uns = _ctx.get('unsubscribe')
  if (uns) {
    uns()
    _ctx = _ctx.delete('unsubscribe')
  }

  _ctx = _ctx.delete('q')
}

function getQ () {
  return _ctx ? _ctx.get('q', List()) : List()
}

function pump () {
  let q = _ctx.get('q')

  if (!q) { return }
  if (q.size === 0) { return }

  // Before we do _anything_ with the messages. Clear the buffer and unsubscribe.
  clearQ()

  // Dispatch each action, one at a time.
  q.map(function (action) {
    _ctx.get('store').dispatch(action)
  })
}

/**
 * Queue messages in a temp buffer that will be cleared on the call to subscribe() from the store.
 * @param action object
 */
function delegate (action) {
  if (!_ctx) {
    return null
  }

  let q = _ctx.get('q', List()).push(action)
  _ctx = _ctx.set('q', q)

  _ctx = _ctx.set('unsubscribe', _ctx.get('store').subscribe(pump))

  return action
}

function init (store) {
  if (_ctx) {
    console.warn('redux-delegate-action::init() called after already initialized!!!')
    return
  }

  _ctx = Map({ 'store': store })
}

module.exports = {
  default: delegate,
  init,
  getQ,
  clearQ
}
