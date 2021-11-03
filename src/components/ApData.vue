<template>
  <div class="ap-data">
    <div class="title">拖入文件进行处理 <Icon class="refresh" type="reload" @click="readDir"/></div>
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
          <ul class="fileList" v-for="(file, index) in fileList" :key="index">
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
import { Button, Icon } from 'ant-design-vue'
import { basename } from 'path'
import { copyFile, existsSync, mkdir, readdir, stat, unlink, writeFile } from 'fs'
import { timeFormat, sizeFormat, handleSheetList } from '../utils/utils'
import { shell } from 'electron'
import xlsx from 'node-xlsx'
export default {
  name: 'ApData',
  components: {
    Button,
    Icon
  },
  data () {
    return {
      fileList: [],
      WORK: 'D:\\WASHING_WORK\\',
      WORK_DIR: 'D:\\WASHING_WORK\\input\\',
      OUTPUT_DIR: 'D:\\WASHING_WORK\\output\\'
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
        files.forEach(item => {
          this.copyFiles(item.path)
        })
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
          console.log(err)
        } else {
          console.log('复制完成')
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
                console.log(err)
              }
              temp.push({
                name: file,
                mtime: timeFormat(stats.mtime),
                size: sizeFormat(stats.size)
              })
            })
          })
          _this.fileList = temp
        }
      })
    },
    /* 清空目录 */
    clearDir () {
      const dir = this.WORK_DIR
      readdir(dir, (err, files) => {
        if (err) {
          throw err
        }
        if (files && files.length > 0) {
          files.forEach(file => {
            unlink(`${dir}${file}`, err => {
              if (err) {
                throw err
              }
            })
          })
          alert('清空完成')
        } else {
          alert('工作目录已空！')
        }
      })
      this.fileList = []
    },
    /* 打开目录 */
    openDir () {
      shell.openPath('D:\\WASHING_WORK\\output')
    },
    /* AP数据处理 */
    ApDataHandle () {
      const _this = this
      _this.$emit('showLoading', true)
      readdir(_this.WORK_DIR, (err, files) => {
        if (err) {
          console.log(err)
        }
        if (files && files.length >= 1) {
          files.forEach(file => {
            const path = `${_this.WORK_DIR}${file}`
            const sheetlist = xlsx.parse(path)
            const buffer = xlsx.build([{ name: 'ANC曲线', data: handleSheetList(sheetlist) }])
            const time = timeFormat(new Date()).split('').filter(item => !isNaN(parseInt(item))).join('')
            writeFile(path.replace(/input/, 'output').replace(/\./, `-${time}.`).replace(/csv/, 'xlss'), buffer, err => {
              if (err) {
                console.log(err)
              } else {
                _this.$emit('showLoading', false)
                alert('处理完毕')
              }
            })
          })
        } else {
          alert('目录为空!')
        }
      })
    }
  },
  created () {
    if (!existsSync(this.WORK)) {
      mkdir(this.WORK, err => {
        if (err) {
          console.log(err)
        }
        mkdir(this.WORK_DIR, err => {
          if (err) {
            console.log(err)
          }
        })
        mkdir(this.OUTPUT_DIR, err => {
          if (err) {
            console.log(err)
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
}
.title {
  width: 80%;
  margin: 0 auto;
  font-size: 20px;
  font-weight: 500;
  .refresh {
    cursor: pointer;
  }
}
.fileListBox {
  // display: flex;
  // justify-content: center;
  // align-items: center;
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
