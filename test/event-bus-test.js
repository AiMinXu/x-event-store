const { XEventBus } = require('../src')

const eventBus = new XEventBus()

const xCallback1 = (...args) => {
  console.log("xCallback1:", args)
}

const xCallback2 = (...args) => {
  console.log("xCallback2:", args)
}

const yCallback1 = (...args) => {
  console.log("yCallback1:", args)
}

eventBus.on("x", xCallback1)
eventBus.on("x", xCallback2)
eventBus.on('y', yCallback1)
eventBus.once("x", (...args) => {
  console.log("x once:", args)
})

setTimeout(() => {
  eventBus.emit("x", "a", "b", "c")
  eventBus.emit("y", "a", "b", "c")
}, 1000);

setTimeout(() => {
  eventBus.off("x", xCallback1)
  eventBus.off("y", yCallback1)
}, 2000);

setTimeout(() => {
  eventBus.emit("x")
  eventBus.emit("y")
}, 3000);
