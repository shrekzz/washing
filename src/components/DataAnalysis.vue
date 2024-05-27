<template>
  <div class="limit">
    <span class="tips">💁‍♂️选择待处理文件</span>
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
    <div>例：文件格式如下：</div>
    <img src="./../../build/limit_eg.png" />
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
import { Input, Button } from 'ant-design-vue'
import { shell } from 'electron'
import { updateDataWithDeviations } from './../utils/DataAnalysis.js'
import { writeFile } from 'fs'
import xlsx from 'node-xlsx'

export default {
  name: 'LimitLine',
  components: {
    Input,
    Button
  },
  data() {
    return {
      filePath: '',
      sheet: []
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
        console.log(updateDataWithDeviations(arg[0].data))
        const buffer = xlsx.build([
          {
            name: 'Ana',
            data: updateDataWithDeviations(arg[0].data)
          }
        ])
        writeFile(
          `${
            this.config.workDir
          }/output/shrekz${new Date().getMinutes()}${new Date().getSeconds()}.xlsx`,
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
