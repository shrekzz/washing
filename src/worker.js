const xlsx = require('node-xlsx')
const { ipcRenderer } = require('electron')
ipcRenderer.on('message-from-main', (event, arg) => {
  switch (arg.data.type) {
    case 'limit2worker':
      ipcRenderer.send('message-from-worker', { type: 'read4limit', data: xlsx.parse(arg.data.data) })
      break
    case 'ap2worker': {
      const sheet = []
      arg.data.data.forEach(file => {
        sheet.push(xlsx.parse(file))
      })
      ipcRenderer.send('message-from-worker', { type: 'read4ap', data: sheet })
      break
    }
    case 'line2worker':
      ipcRenderer.send('message-from-worker', { type: 'read4line', data: xlsx.parse(arg.data.data) })
      break
  }
})
