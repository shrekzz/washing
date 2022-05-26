'use strict'

import { app, protocol, BrowserWindow, Menu, globalShortcut, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const isDevelopment = process.env.NODE_ENV !== 'production'

function sendWindowMessage(targetWindow, message, payload) {
  if (typeof targetWindow === 'undefined') {
    console.log('Target window does not exist')
    return
  }
  targetWindow.webContents.send(message, payload)
}
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

Menu.setApplicationMenu(null)

async function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 594,
    height: 677,
    icon: '../logo.ico',
    resizable: isDevelopment,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })
  const workerWindow = new BrowserWindow({
    show: false,
    webPreferences: { 
      nodeIntegration: true,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    await workerWindow.loadFile('../public/worker.html')
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
    workerWindow.loadURL('app://./worker.html')
  }
  // 全局监听快捷键
  globalShortcut.register('CommandOrControl+Q', () => {
    win.webContents.send('autoInput', 'you is sb')
  })
  globalShortcut.register('ESC', () => {
    win.webContents.send('stopInput')
  })
  
  win.on('closed', function () {
    app.quit()
  })

  workerWindow.webContents.openDevTools()
  workerWindow.on('closed', () => {
    console.log('background window closed')
  })
   // test
  ipcMain.on('message-from-worker', (event, arg) => {
    sendWindowMessage(win, 'message-to-renderer', arg)
  })
  ipcMain.on('message-from-renderer', (event, arg) => {
    sendWindowMessage(workerWindow, 'message-from-main', arg)
  })
  ipcMain.on('ready', (event, arg) => {
    console.info('child process ready')
  })
}
// 解决无法使用 robotjs

app.allowRendererProcessReuse = false
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
  //  // Unregister a shortcut.
  //  globalShortcut.unregister('CommandOrControl+Q')
  
  //  // Unregister all shortcuts.
  //  globalShortcut.unregisterAll()
  //    // On macOS it is common for applications and their menu bar
  //    // to stay active until the user quits explicitly with Cmd + Q
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
