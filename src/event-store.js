const EventBus = require("./event-bus")
const { isObject } = require("./utils")

class XEventStore {
  constructor(options) {
    if (!isObject(options.state)) {
      throw new TypeError("the state must be object type")
    }
    if (options.actions && isObject(options.actions)) {
      const values = Object.values(options.actions)
      for (const value of values) {
        if (typeof value !== 'function') {
          throw new TypeError("the value of actions must be a function")
        }
      }
      this.actions = options.actions
    }
    this.state = options.state
    this._observe(options.state)
    this.event = new EventBus()
    this.event2 = new EventBus()
  }

  //_observe方法
  _observe(state) {
    const _this = this
    Object.keys(state).forEach(key => {
      let _value = state[key]
      Object.defineProperty(state, key, {
        get: function () {
          return _value
        },
        set: function (newValue) {
          if (_value === newValue) return
          _value = newValue
          _this.event.emit(key, _value)
          _this.event2.emit(key, { [key]: _value })
        }
      })
    })
  }

  //onState监听--单个
  onState(stateKey, stateCallbackFn) {
    const keys = Object.keys(this.state)
    if (keys.indexOf(stateKey) === -1) {
      throw new Error("The state does not contain your key")
    }
    this.event.on(stateKey, stateCallbackFn)

    //callbackFn
    if (typeof stateCallbackFn !== 'function') {
      throw new TypeError("the event callback must be function type")
    }
    const value = this.state[stateKey]
    stateCallbackFn.apply(this.state, [value])
  }

  //onStates监听--多个
  onStates(stateKeys, stateCallbackFn) {
    const keys = Object.keys(this.state)
    const value = {} //
    for (const key of stateKeys) {
      if (keys.indexOf(key) === -1) {
        throw new Error("The state does not contain your key")
      }
      this.event2.on(key, stateCallbackFn)
      value[key] = this.state[key]
    }
    stateCallbackFn.apply(this.state, [value])
  }

  //取消监听
  offState(stateKey, stateCallbackFn) {
    const keys = Object.keys(this.state)
    if (keys.indexOf(stateKey) === -1) {
      throw new Error("the state does not contain your key")
    }
    this.event.off(stateKey, stateCallbackFn)
  }

  //取消监听--多个
  offStates(stateKeys, stateCallbackFn) {
    const keys = Object.keys(this.state)
    stateKeys.forEach(key => {
      if (keys.indexOf(key) === -1) {
        throw new Error("The state does not contain your key")
      }
      this.event2.off(key, stateCallbackFn)
    })
  }

  //setState
  setState(stateKey, stateValue) {
    this.state[stateKey] = stateValue
  }

  //dispatch
  dispatch(actionName, ...args) {
    if (typeof actionName !== 'string') {
      throw new TypeError("the action name must be string type")
    }
    if (Object.keys(this.actions).indexOf(actionName) === -1) {
      throw new Error("this action name does not exist, please check it")
    }
    const actionFn = this.actions[actionName]
    actionFn.apply(this, [this.state, ...args])
  }
}

module.exports = XEventStore
