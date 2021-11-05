<template>
  <div class="handle">
    <div class="content">
      <div class="tips" style="margin-top: 0">1️.选择产线数据所在的目录</div>
      <div class="getFileBox">
        <Button class="chooseBtn" >选择文件目录</Button>
        <label class="getFilePath">
          <input style="display: none" class="getFilePath" type="file" webkitdirectory @change="getFilePath($event)" />
        </label>
      </div>
      <div>
        <div class="tips">2.选择需要的行(只能输入数字)</div>
        <div class="btn-group">
          <Button type="primary" class="add" @click="handleRow('add')">加一行</Button>
          <Button type="primary" class="sub" @click="handleRow('')">减一行</Button>
        </div>
        <div class="input-group">
          <Input class="input-row" v-for="(item, index) in rows" :key="index" type="number" v-model="rows[index]" />
        </div>
      </div>
      <div class="btn-group">
        <Button class="start" type="" @click="checkInsert">开始</Button>
        <Button class="open" type="primary" @click="openWork" >打开工作目录</Button>
      </div>
    </div>
  <div></div>
  </div>
</template>

<script>
import { mkdir, existsSync, readdir, writeFile } from 'fs'
import { Button, Input } from 'ant-design-vue'
import { shell } from 'electron'
import xlsx from 'node-xlsx'
export default {
  name: 'LineData',
  data () {
    return {
      rows: [1],
      filePath: ''
    }
  },
  components: {
    Button,
    Input
  },
  methods: {
    getFilePath (e) {
      const path = e.target.files[0].path
      this.filePath = path.slice(0, path.lastIndexOf('\\'))
    },
    handleRow (status) {
      if (status === 'add') {
        this.rows.push('')
      } else if (this.rows.length !== 1) {
        this.rows.pop()
      }
    },
    /* 处理输入 去重、去空、转为int */
    checkInsert () {
      this.changeLoading()
      const res = [...new Set(this.rows)].filter(item => item !== '').map(item => parseInt(item))
      this.handleData(res)
    },
    /* 打开工作目录 */
    openWork () {
      shell.openPath('d:/Washing_Output')
    },
    /* 开始处理数据 */
    handleData (res) {
      const handlePath = this.filePath
      const rowArr = res
      const checkedList = rowArr.map(item => [])
      const sheets = []
      const _this = this
      // const reverseArray = (arr) => {
      //   const temp = []
      //   for (let i = 0; i < arr[0].length; i++) {
      //     temp[i] = []
      //   }
      //   for (let i = 0; i < arr.length; i++) {
      //     for (var j = 0; j < arr[i].length; j++) {
      //       temp[j][i] = arr[i][j] || ''
      //     }
      //   }
      //   return temp
      // }
      if (handlePath) {
        readdir(handlePath, (err, files) => {
          if (!err) {
            // let freq = []
            files.forEach(file => {
              const path = `${handlePath}/${file}`
              const sheetlist = xlsx.parse(path)
              checkedList.forEach((item, index) => {
                item.push(sheetlist[0].data[rowArr[index] - 1] ? sheetlist[0].data[rowArr[index] - 1] : [])
              })
            })
            console.log(checkedList[0].length)
            checkedList.forEach((item, index) => {
              sheets.push({
                data: item,
                name: 'sheet ' + index
              })
            })
            const buffer = xlsx.build(sheets)
            writeFile('d:/Washing_Output/sheet.xlsx', buffer, function (err) {
              if (err) {
                throw err
              } else {
                _this.$emit('showLoading', false)
              }
            })
          } else {
            console.log(err)
          }
        })
      }
    },
    changeLoading () {
      this.$emit('showLoading', true)
    }
  },
  created () {
    const WORK_DIR = 'D:/Washing_Output'
    if (!existsSync(WORK_DIR)) {
      mkdir(WORK_DIR, err => {
        if (err) {
          console.log(err)
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .tips {
    margin: 10px 0;
    font-size: 20px;
  }
  .content {
    width: 80%;
    padding: 0 10px;
    margin: 0 auto;
    .getFileBox {
      position: relative;
      .getFilePath {
        position: absolute;
        top: 0;
        left: 0;
        width: 116px;
        height: 32px;
        cursor: pointer;
      }
    }
  }
  .btn-group {
    display: flex;
    margin: 5px 0;
    width: 100%;
    justify-content: space-between;
    .add, .sub{
      width: 48%;
    }
     .start, .open {
      width: 48%;
    }
  }
  .input-row {
    margin: 5px 0;
  }
  .input-group {
    max-height: 130px;
    overflow-y: auto;
  }
</style>
