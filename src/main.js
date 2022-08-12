import Vue from 'vue'
import App from './App.vue'
import { ipcRenderer } from 'electron'
import { Modal, message } from 'ant-design-vue'
Vue.config.productionTip = false
Vue.use(Modal)

const callbackCache = []
Vue.prototype.$message = message
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

new Vue({
  render: h => h(App)
}).$mount('#app')
