<template>
  <div class="ap-data">
    <div class="title">🙎‍♂️拖入文件进行处理 <Icon class="refresh" type="reload" @click="readDir"/></div>
    <div class="selector">
      <Checkbox :checked="isDraw" @change="isDraw = !isDraw">生成图表</Checkbox>
    </div>
    <div class="fileListBox" @drop="dropEvent($event)" @dragover.prevent="" >
      <div class="plus" v-if="fileLen">
        <span class="plus-pos">+</span>
      </div>
      <div class="file"  v-else>
        <ul class="fileListTitle">
          <li>文件名</li>
          <li>修改时间</li>
          <li>大小</li>
        </ul>
        <div class="file-scroller">
          <ul class="fileList" v-for="(file, index) in fileList" :key="index" @dblclick="openFile(file.name)">
            <li class="file-detail">{{ file.name }}</li>
            <li class="file-detail">{{ file.mtime }}</li>
            <li class="file-detail">{{ file.size }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="btn-group">
      <Button class="btn" @click="ApDataHandle">开始</Button>
      <Button class="btn" @click="clearDir" type="danger">清空工作目录</Button>
      <Button class="btn" @click="openDir" type="primary">打开工作目录</Button>
    </div>
  </div>
</template>

<script>
import { Button, Icon, Select, Checkbox } from 'ant-design-vue'
import { basename } from 'path'
import { copyFile, existsSync, mkdir, readdir, stat, unlink, writeFile } from 'fs'
import { timeFormat, sizeFormat, handleSheetList, handleSouncheck, scale } from '../utils/utils'
import { shell } from 'electron'
import xlsx from 'node-xlsx'
import { exec } from 'child_process'
import { logger } from '../utils/log.js'
export default {
  name: 'ApData',
  components: {
    Button,
    Icon,
    ASelect: Select,
    ASelectOption: Select.Option,
    Checkbox
  },
  props: ['config'],
  data () {
    return {
      fileList: [],
      WORK: this.config.workDir,
      WORK_DIR: this.config.workDir + 'input\\',
      OUTPUT_DIR: this.config.workDir + 'output\\',
      isDraw: false
    }
  },
  computed: {
    fileLen () {
      return this.fileList.length === 0
    }
  },
  methods: {
    dropEvent (e) {
      const files = e.dataTransfer.files
      if (files && files.length > 1) {
        for (const key in files) {
          if (files[key].path) {
            this.copyFiles(files[key].path)
          }
        }
      } else if (files.length === 1) {
        this.copyFiles(files[0].path)
      }
    },
    /* 复制文件 */
    copyFiles (fromFileName) {
      const fileName = basename(fromFileName)
      const toFileName = `${this.WORK_DIR}${fileName}`
      const _this = this
      copyFile(fromFileName, toFileName, 0, (err) => {
        if (err) {
          logger.error(err)
        } else {
          // 复制完重新获取一遍文件列表
          _this.readDir()
        }
      })
    },
    /* 读文件目录 */
    readDir () {
      const _this = this
      const temp = []
      readdir(this.WORK_DIR, (err, files) => {
        if (!err) {
          files.forEach(file => {
            stat(`${_this.WORK_DIR}${file}`, (err, stats) => {
              if (err) {
                logger.error(err)
              }
              temp.push({
                name: file,
                mtime: timeFormat(stats.mtime),
                size: sizeFormat(stats.size)
              })
            })
          })
          _this.fileList = temp
        } else {
          logger.error(err)
        }
      })
    },
    /* 清空目录 */
    clearDir () {
      const dir = this.WORK_DIR
      const _this = this
      readdir(dir, (err, files) => {
        if (err) {
          logger.error(err)
        }
        if (files && files.length > 0) {
          files.forEach(file => {
            unlink(`${dir}${file}`, err => {
              if (err) {
                logger.error(err)
              }
            })
          })
          _this.$message.info(' 😁 清空完成！')
        } else {
          _this.$message.info(' 🤕 工作目录已空！')
          // alert('工作目录已空！')
        }
      })
      this.fileList = []
    },
    /* 打开目录 */
    openDir () {
      shell.openPath(this.OUTPUT_DIR)
    },
    /* 打开文件 */
    openFile (filename) {
      logger.info(this.WORK_DIR + filename)
      exec(`"${filename}"`, { cwd: this.WORK_DIR })
    },
    /* AP数据处理 */
    ApDataHandle () {
      const _this = this
      readdir(_this.WORK_DIR, (err, files) => {
        if (err) {
          logger.error(err)
        }
        if (files && files.length >= 1) {
          _this.$emit('show-loading', true)
          const path = `${_this.WORK_DIR}`
          const filenames = files.map(file => path + file)
          _this.$ipcRenderer.send('message-to-renderer', { type: 'ap2worker', data: filenames })
          _this.$ipcRenderer.on('read4ap', sheetList => {
            sheetList.forEach((sheet, index) => {
              const resArr = sheet[0].name === 'Display' ? handleSouncheck(sheet) : handleSheetList(sheet)
              const buffer = xlsx.build([{ name: 'ANC曲线', data: resArr }])
              const time = timeFormat(new Date()).split('').filter(item => !isNaN(parseInt(item))).join('')
              const outputFileName = filenames[index].replace(/input/, 'output').replace(/\./, `-${time}.`).replace(/csv/, 'xlsx')
              writeFile(outputFileName, buffer, err => {
                if (err) {
                  logger.error(err)
                } else {
                  _this.$emit('show-loading', false)
                }
              })
              /* 画图方法 */
              if (_this.isDraw) {
                _this.draw(outputFileName, resArr[0].length, resArr.length)
              }
              logger.info('处理 ' + outputFileName + ' 完成')
            })
          })
          _this.$message.info(' 😀 数据处理完毕了！')
        } else {
          _this.$message.info(' 🙄 工作目录为空！')
        }
      })
    },
    /* 更换数据类型 */
    selectType (value) {
      this.dataType = value
    },
    /* 画图 */
    draw (filename, col, row) {
      // 通过CMD打开python画图, 路径加引号。避免某些文件名带空格
      const workerProcess = exec(`xlsx "${filename}" "${scale(col, row)}"`, { cwd: './' })
      logger.info(`xlsx "${filename}" ${scale(col, row)}`)
      workerProcess.stdout.on('data', function (data) {
        logger.info('stdout: ' + data)
      })
      // 打印错误的后台可执行程序输出
      workerProcess.stderr.on('data', function (data) {
        logger.error('stderr: ' + data)
      })
    }
  },
  created () {
    if (!existsSync(this.WORK)) {
      mkdir(this.WORK, err => {
        if (err) {
          logger.error(err)
        }
        mkdir(this.WORK_DIR, err => {
          if (err) {
            logger.error(err)
          }
        })
        mkdir(this.OUTPUT_DIR, err => {
          if (err) {
            logger.error(err)
          }
        })
      })
    }
  },
  mounted () {
    this.readDir()
  }
}
</script>

<style lang='less' scoped>
.ap-data {
  margin: 0 auto;
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}
.selector {
  width: 80%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  width: 80%;
  margin: 0 auto;
  font-size: 20px;
  font-weight: 500;
  .refresh {
    cursor: pointer;
    :hover {
      color: #1890ff;
    }
  }
}
.fileListBox {
  width: 80%;
  height: 260px;
  border: 10px rgba(199, 199, 199) dashed;
  border-radius: 10px;
  margin: 10px auto;
  &:hover {
    border: 10px #1890ff dashed;
    .plus {
      color: #1890ff;
    }
  }
  transition: border .3s;
  .plus {
    cursor: pointer;
    margin: 0 auto;
    top: 20%;
    width: 150px;
    height: 150px;
    position: relative;
    font-size: 130px;
    font-weight: 600;
    color: rgba(199, 199, 199);
    transition:  color .3s;
    .plus-pos {
      display: block;
      position: absolute;
      top: -35px;
      left: 30px;
    }
  }
  .fileListTitle, .fileList {
    cursor: auto;
    width: 100%;
    margin: 0;
    padding: 5px 10px;
    display: flex;
    justify-content: space-between;
    li {
      cursor: default;
      border-right: 2px solid #ebebeb;
      list-style: none;
      width: 33%;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
    }
    .file-detail {
      color: black;
      border: none;
    }
  }
  .fileList {
    padding: 0 10px;
     &:hover {
      background: rgba(229, 243, 255);
    }
    transition: .3s background;
  }
  .file-scroller {
    width: 100%;
    height: 200px;
    overflow-y: auto;
  }
}
.btn-group {
  margin: 0 auto;
  width: 80%;
  .btn {
    width: 33.3%;
  }
}
</style>
