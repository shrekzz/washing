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
      <div class="tips" style="margin-top: 0">2.你需要的数据是行还是列？</div>
      <RadioGroup v-model="checkedType" buttonStyle="solid">
        <RadioButton value="row">行</RadioButton>
        <RadioButton value="column">列</RadioButton>
      </RadioGroup>
      <div class="tips" style="margin-top: 0">3.选择需要处理的表</div>
      <span class="no-names" v-if="filePath === ''">还未选择数据所在目录！</span>
      <CheckboxGroup v-if="filePath !== ''" class="checkboxgroup" :options="sheetListNames" v-model="checkedNames" ></CheckboxGroup>
      <div>
        <div class="tips">4.选择需要的行(只能输入数字)</div>
        <div class="btn-group">
          <Button type="primary" class="add" @click="handleRow('add')">加一行</Button>
          <Button type="primary" class="sub" @click="handleRow('')">减一行</Button>
        </div>
        <div class="input-group">
          <Input class="input-row" v-for="(item, index) in rows" :key="index" type="number" v-model="rows[index]" />
        </div>
      </div>
      <div class="btn-group">
        <Button class="start" type="" @click="checkInsert" :disabled="startFlag">开始</Button>
        <Button class="open" type="primary" @click="openWork" >打开工作目录</Button>
      </div>
    </div>
  <div></div>
  </div>
</template>

<script>
import { mkdir, existsSync, readdir, writeFile } from 'fs'
import { Button, Input, Checkbox, Radio } from 'ant-design-vue'
import { shell } from 'electron'
import xlsx from 'node-xlsx'
import { reverseArray, createArray } from '../utils/utils'

export default {
  name: 'LineData',
  data () {
    return {
      rows: [1],
      filePath: '',
      // 表名
      /// 选择数据类型: 行row， 列column；默认为行
      checkedType: 'row',
      sheetListNames: [],
      // 选中的表
      checkedNames: []
    }
  },
  components: {
    Button,
    Input,
    CheckboxGroup: Checkbox.Group,
    RadioGroup: Radio.Group,
    RadioButton: Radio.Button
  },
  methods: {
    getFilePath (e) {
      const path = e.target.files[0].path
      this.filePath = path.slice(0, path.lastIndexOf('\\'))
    },
    // 获取表内子表名
    getSheetListNames () {
      const _this = this
      readdir(_this.filePath, (err, files) => {
        if (err) {
          console.log(err)
        } else {
          const path = `${_this.filePath}/${files[0]}`
          xlsx.parse(path).forEach((item, index) => {
            _this.sheetListNames.push({
              label: item.name,
              value: index
            })
          })
        }
      })
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
      const res = [...new Set(this.rows)].filter(item => item !== '').map(item => parseInt(item))
      this.$emit('showLoading', true)
      this.handleData(res)
    },
    /* 打开工作目录 */
    openWork () {
      shell.openPath('d:/Washing_Output')
    },
    /* 开始处理数据 */
    handleData (res) {
      const handlePath = this.filePath
      // 储存选中的行
      const rowArr = res
      // 最终处理的表
      const sheets = []
      const _this = this
      // 二维数组，x： 第 x 个表、 y： 第 y 行
      const resSheet = createArray(this.checkedNames.length, rowArr.length)
      readdir(handlePath, (err, files) => {
        if (!err) {
          files.forEach(file => {
            const path = `${handlePath}/${file}`
            const sheetlist = xlsx.parse(path)
            if (this.checkedType === 'column') {
              rowArr.forEach(row => {
                sheetlist[row - 1].data = reverseArray(sheetlist[row - 1].data)
              })
            }
            _this.checkedNames.forEach((sheet, index) => {
              rowArr.forEach((row, rowIndex) => {
                resSheet[index][rowIndex].push(sheetlist[sheet].data[row - 1])
              })
            })
          })
          resSheet.forEach((sheet, sheetIndex) => {
            sheet.forEach((item, itemIndex) => {
              sheets.push({
                data: reverseArray(item),
                name: _this.sheetListNames[_this.checkedNames[sheetIndex]].label + rowArr[itemIndex]
              })
            })
          })
          const buffer = xlsx.build(sheets)
          writeFile('d:/Washing_Output/sheet.xlsx', buffer, function (err) {
            if (err) {
              console.log('写入失败: ', err)
            } else {
              _this.$emit('showLoading', false)
            }
          })
        }
      })
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
  },
  watch: {
    filePath (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.sheetListNames = []
        this.getSheetListNames()
      }
    }
  },
  computed: {
    startFlag () {
      return this.filePath === '' || this.checkedNames.length === 0
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
  .warning {
    position: absolute;
    z-index: 100;
    top: 50%;
    left: 50%;
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
    .checkboxgroup {
      width: 250px;
      margin-left: 16px;
      .checkboxgroup-item {
        display: none;
      }
    }
    .no-names {
      display: block;
      margin-left: 16px;
      color: red;
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
