<template>
  <div class="limit">
    <span class="tips">💁‍♂️选择待处理文件 (CPK计算)</span>
    <div class="getFileBox">
      <Button class="chooseBtn">选择文件</Button>
      <label class="getFilePath">
        <input
          style="display: none"
          class="getFilePath"
          accept=".xlsx"
          type="file"
          @change="getFilePath($event)"
        />
      </label>
      {{ filePath }}
    </div>
    <a-select style="width: 140px;" v-model="type">
      <a-select-option value="CPK"  key="CPK">CPK计算</a-select-option>
      <a-select-option value="Scatter" key="Scatter">曲线离散度（减均值）</a-select-option>
    </a-select>
    <div style="margin: 10px 5px 10px 10px;">⚠计算CPK文件格式如下,需要上下限：</div>
    <img style="width: 400px;" src="./../../build/limit_eg.png" />
    <div class="btn-group">
      <Button class="start" type="" @click="startWork"
        >开始</Button
      >
      <Button class="open" type="primary" @click="openWork"
        >打开工作目录</Button
      >
    </div>
  </div>
</template>

<script>
import { Input, Button, Select } from 'ant-design-vue'
import { shell } from 'electron'
import { updateDataWithDeviations, updateDataWithCPK } from './../utils/DataAnalysis.js'
import { writeFile } from 'fs'
import { reverseArray } from '../utils/utils'
import xlsx from 'node-xlsx'

export default {
  name: 'LimitLine',
  components: {
    Input,
    Button,
    ASelect: Select,
    ASelectOption: Select.Option
  },
  data() {
    return {
      filePath: '',
      sheet: [],
      type: 'CPK'
    }
  },
  props: ['config'],
  methods: {
    getFilePath(e) {
      this.filePath = e.target.files[0].path ? e.target.files[0].path : this.filePath
    },
    openWork() {
      shell.openPath(this.config.workDir + 'output')
    },
    startWork() {
      const _this = this
      this.$emit('show-loading', true)
      this.$ipcRenderer.send('message-to-renderer', {
        type: 'limit2worker',
        data: this.filePath
      })
      this.$ipcRenderer.on('read4limit', arg => {
        const sheet = arg[0].data
        let tempSheet = []
        if (sheet[0][sheet[0].length - 1] >= 10000) {
          // 横向数据
          if (_this.type === 'Scatter') {
            tempSheet = reverseArray(sheet)
          } else {
            tempSheet = sheet
          }
        } else {
          if (_this.type === 'CPK') {
            tempSheet = reverseArray(sheet)
          } else {
            tempSheet = sheet
          }
        }
        const buffer = xlsx.build([
          {
            name: _this.type === 'CPK' ? 'CPK' : '离散度',
            data: _this.type === 'CPK' ? updateDataWithCPK(tempSheet) : updateDataWithDeviations(tempSheet)
          }
        ])
        writeFile(
          `${
            this.config.workDir
          }/output/数据分析_${new Date().getMinutes()}${new Date().getSeconds()}.xlsx`,
          buffer,
          err => {
            if (err) {
              console.log(err)
            } else {
              _this.$emit('show-loading', false)
              _this.$message.info(' 😀 数据处理完毕了！')
            }
          }
        )
      })
    }
  },
  computed: {
    startFlag() {
      return this.filePath === ''
    }
  },
  mounted() {}
}
</script>

<style lang="less" >
.limit {
  width: 80%;
  padding: 0 10px;
  margin: 0 auto;
  .question {
    margin-left: 5px;
    cursor: pointer;
    :hover {
      color: #1890ff;
    }
  }
  .tips {
    margin: 10px 0;
    font-size: 20px;
  }
  .getFileBox {
    position: relative;
    margin: 10px 0;
    .getFilePath {
      position: absolute;
      top: 0;
      left: 0;
      width: 88px;
      height: 32px;
      cursor: pointer;
    }
  }
  .btn-group {
    display: flex;
    margin: 15px 0;
    width: 100%;
    justify-content: space-between;
    .add,
    .sub {
      width: 48%;
    }
    .start,
    .open {
      width: 48%;
    }
  }
}
</style>
