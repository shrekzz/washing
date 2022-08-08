import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

<<<<<<< HEAD
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
  // callbackCache.forEach(cache => {
  //   if (cache.type === msg.type) {
  //     cache.callback && cache.callback(msg.data)
  //   }
  // })
  for (let i = 0; i < callbackCache.length; i++) {
    if (callbackCache[i].type === msg.type) {
      callbackCache[i].callback && callbackCache[i].callback(msg.data)
      callbackCache.splice(i, 1)
    }
  }
}) // 监听主进程的消息

=======
>>>>>>> v0.1.9
new Vue({
  render: h => h(App)
}).$mount('#app')
