import { autoUpdater, NoOpLogger } from "electron-updater";
// import config from ".././package.json";
import { ipcMain, app, dialog } from "electron";
import { logger } from '../utils/log.js'

let mainWindow = null;
autoUpdater.autoDownload = false;
let canQuit = false;
let version = ''

export function updateHandle(window) {
  mainWindow = window;
  let message = {
    error: "检查更新出错",
    checking: "正在检查更新……",
    updateAva: "检测到新版本，正在下载……",
    updateNotAva: "现在使用的就是最新版本，不用更新",
  };

  // autoUpdater.setFeedURL(feedUrl);
  autoUpdater.checkForUpdates();

  //监听升级失败事件
  autoUpdater.on("error", function (error) {
    sendUpdateMessage({
      cmd: "error",
      message: error,
    });
    logger.error("监听系统升级事件失败");
  });

  //监听开始检测更新事件
  autoUpdater.on("checking-for-update", function (message) {
    sendUpdateMessage({
      cmd: "checking-for-update",
      message: message,
    });
    console.log("检查");
    logger.info("开始监听系统升级事件");
  });
  //监听没有可用更新事件
  autoUpdater.on("update-not-available", function (message) {
    sendUpdateMessage({
      cmd: "update-not-available",
      message: message,
    });
    logger.info("没有发现新版本");
  });
  //监听发现可用更新事件
  autoUpdater.on("update-available", function (message) {
    version = message.version
    sendUpdateMessage({
      cmd: "update-available",
      message: message,
    });
    autoUpdater.autoDownload = true;
    logger.info("发现有新版本");
  });

  // 更新下载进度事件
  autoUpdater.on("download-progress", function (progressObj) {
    //事件没触发可能更新包已下载
    sendUpdateMessage({
      cmd: "download-progress",
      message: progressObj,
    });
    logger.info("更新下载进度...");
  });

  autoUpdater.on("close", (event) => {
    if (!canQuit) {
      mainWindow.hide();
      mainWindow.setSkipTaskbar(true);
      event.preventDefault();
    }
  });

  //监听下载完成事件
  autoUpdater.on(
    "update-downloaded",
    function (event, releaseNotes, releaseName, releaseDate, updateUrl) {
      logger.info("下载包成功");
      sendUpdateMessage({
        cmd: "update-downloaded",
        message: {
          releaseNotes,
          releaseName,
          releaseDate,
          updateUrl,
        },
      });
      // //退出并安装更新包
      // if (process.platform !== "darwin") {
      //   canQuit = true;
      //   // autoUpdater.quitAndInstall();
      //   setImmediate(() => autoUpdater.quitAndInstall(true, true));
      //   logger.info('下载完成，退出并且安装更新包')
      // }
      app.whenReady().then(() => {
        logger.info("下载提示");
        let clickId = dialog.showMessageBoxSync({
          type: "info",
          title: "升级提示",
          essage: `已为你升级到最新版V${version}，是否立即体验`,
          buttons: ["立即体验", "稍后体验"],
          cancelId: 1,
        });
        if (clickId === 0) {
          logger.info("下载完成，退出并且安装更新包");
          canQuit = true;
          setImmediate(() => autoUpdater.quitAndInstall(true, true));
        } else {
          sendUpdateMessage({
            cmd: "update-await",
            message: "稍后重启",
          });
        }
      });
    }
  );

  //接收渲染进程消息，开始检查更新
  // ipcMain.on("checkForUpdate", (e, arg) => {
  //   //执行自动更新检查
  //   // sendUpdateMessage({cmd:'checkForUpdate',message:arg})
  //   if (arg) {
  //     autoUpdater.autoDownload = true;
  //   }
  //   console.log(e,arg,'hhhh');
  //   autoUpdater.checkForUpdates();
  // });
}
//给渲染进程发送消息
// function sendUpdateMessage(text) {
//   mainWindow.webContents.send("message", text);
// }
