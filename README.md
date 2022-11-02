# x-event-store

一个基于事件总线的全局状态管理工具，可以适用于Vue、React、小程序等。





# 设计灵感

在项目中找到一个更加方便快捷的数据共享方案：

* 欢迎star、issue、pull requests，会进行更多改变；



# 怎样使用：

## 1、npm安装依赖

```shell
npm install x-event-store
```



## 2、事件总线（event-bus）

```js
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

```





## 3、状态管理（event-store）

```js
const { XEventStore } = require("../src")
const axios = require('axios')

const eventStore = new XEventStore({
  state: {
    name: "x",
    datas: ["a", "b", "c"],
    banners: [],
    recommends: []
  },
  actions: {
    getHomeMultidata(ctx) {
      console.log(ctx)
      axios.get("http://123.207.32.32:8000/home/multidata").then(res => {
        const banner = res.data.data.banner
        const recommend = res.data.data.recommend
        // 赋值
        ctx.banners = banner
        ctx.recommends = recommend
      })
    }
  }
})

eventStore.onState("banners", (value) => {
  console.log("监听banners:", value)
})

eventStore.onState("recommends", (value) => {
  console.log("监听recommends", value)
})

// 同时监听多个数据
eventStore.onStates(["name", "datas"], (value) => {
  console.log("监听多个数据:", value) // 数组类型
})

// 数据变化
setTimeout(() => {
  eventStore.setState("name", "y")
  eventStore.setState("datas", ["d", "e"])
}, 1000);

```
