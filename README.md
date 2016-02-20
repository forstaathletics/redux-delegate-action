# redux-delegate-action

Delegate an action to be dispatched at the end of the current reducers execution.  

Sometimes you'd like to dispatch an action within the execution of a reducer. But you should not do
this and may be explicitly forbidden by Redux in the future. But, what can be done is an action can
be created, saved and disptached later at the appropriate time.

This module must be initialized with the store before use. You only need to initialize it once:

```javascript
import { init as delegateInit } from 'redux-delegate-action'
import makeStore, { addReducer, addMiddleware } from './store'

const store = makeStore()

// Initialize the delegator
delegateInit(store)
```

Using the delegate is very simple. Just call `delegate()` with an action:

```javascript
import delegate from 'redux-delegate-action'

myReducer = (state, action) => {
  // Do some stuff
  // ...
  // delegate an action to be dispatched after the reducers are done
  delegate(actionCreater(params))
}
```
