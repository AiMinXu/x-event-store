//事件总线模块
class XEventBus {
  constructor() {
    this.eventBus = {}
  }

  //on方法
  on(eventName, eventCallbackFn, thisArg) {
    if (typeof eventName !== 'string') {
      throw new TypeError("the eventName must be string type")
    }

    if (typeof eventCallbackFn !== 'function') {
      throw new TypeError("the eventCallbackFn must be function type")
    }
    //定义监听eventBus名称并加入数组
    let handlers = this.eventBus[eventName]
    if (!handlers) {
      handlers = []
      this.eventBus[eventName] = handlers
    }

    handlers.push({
      eventCallbackFn,
      thisArg
    })
    return this
  }

  //emit方法
  emit(eventName, ...args) {
    if (typeof eventName !== 'string') {
      throw new TypeError("the eventName must be string type")
    }
    //事件处理
    const handlers = this.eventBus[eventName] || []
    handlers.forEach(handler => {
      handler.eventCallbackFn.apply(handler.thisArg, args)
    })
    return this
  }

  //off方法
  off(eventName, eventCallbackFn) {
    if (typeof eventName !== 'string') {
      throw new TypeError("the eventName must be string type")
    }

    if (typeof eventCallbackFn !== 'function') {
      throw new TypeError("the eventCallbackFn must be function type")
    }

    const handlers = this.eventBus[eventName]
    if (handlers && eventCallbackFn) {
      const newHandlers = [...handlers]
      for (let i = 0; i < newHandlers.length; i++) {
        const handler = newHandlers[i]
        if (handler.eventCallbackFn === eventCallbackFn) {
          const index = handlers.indexOf(handler)
          handlers.splice(index, 1)
        }

      }
    }
    //取消事件总线
    if (handlers.length === 0) {
      delete this.eventBus[eventName]
    }
  }

  //once方法
  once(eventName, eventCallbackFn, thisArg) {
    if (typeof eventName !== 'string') {
      throw new TypeError("the eventName must be string type")
    }

    if (typeof eventCallbackFn !== 'function') {
      throw new TypeError("the eventCallbackFn must be function type")
    }

    const tempCallbackFn = (...args) => {
      this.off(eventName, tempCallbackFn)
      eventCallbackFn.apply(thisArg, args)
    }
    return this.on(eventName, tempCallbackFn, thisArg)
  }
}

module.exports = XEventBus
