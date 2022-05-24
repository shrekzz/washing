import Vue from 'vue'
import App from './App.vue'
const { ipcRenderer } = require('electron')

Vue.config.productionTip = false

const callbackCache = []
Vue.prototype.$ipcRenderer = {
  send: (msgType, msgData) => {
    ipcRenderer.send('message-from-renderer', {
      type: msgType,
      data: msgData
    })
  },
  on: (type, callback) => {
    callbackCache.push({
      type,
      callback
    })
  }
}
ipcRenderer.on('message-to-renderer', (sender, msg) => {
  callbackCache.forEach(cache => {
    if (cache.type === msg.type) {
      cache.callback && cache.callback(msg.data)
    }
  })
}) // 监听主进程的消息

new Vue({
  render: h => h(App)
}).$mount('#app')
