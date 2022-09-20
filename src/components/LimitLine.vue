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
    <div class="tips"><span>🗡条件选择</span></div>
    <div class="limit_range">
      范围：<Input
        class=""
        type="number"
        v-model="lowFreq"
        @blur="checkRange"
      />
      <span style="margin: 0 10px">~</span>
      <Input type="number" v-model="upFreq" @blur="checkRange" />
      <span style="margin: 0 10px">Hz</span>
      <span class="rangeTips">{{ rangeTips }}</span>
    </div>
    <div class="limit_offset">
      上限：
      <div class="up">
        <Input addon-before="+" type="number" v-model="up" @blur="checkLimit" />
      </div>
      下限：
      <div class="low">
        <Input
          type="number"
          addon-before="-"
          v-model="low"
          @blur="checkLimit"
        />
      </div>
      <span class="offsetTips">{{ offsetTips }}</span>
    </div>
    <div class="btn-group">
      <Button class="start" type="" @click="startWork" :disabled="startFlag"
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
import LimitFactory from './../utils/LimitFactory'
import xlsx from 'node-xlsx'
import { writeFile } from 'fs'

export default {
  name: 'LimitLine',
  components: {
    Input,
    Button
  },
  data() {
    return {
      filePath: '',
      lowFreq: 50,
      upFreq: 1000,
      low: 3,
      up: 3,
      sheet: [],
      rangeTips: '✔',
      offsetTips: '✔'
    }
  },
  props: ['config'],
  methods: {
    getFilePath(e) {
      const path = e.target.files[0].path
      this.filePath = path
    },
    checkLimit() {
      if (this.low === '' || this.up === '') {
        this.offsetTips = '框线偏移不能为空'
      } else if (
        this.low < 0 ||
        this.up < 0 ||
        this.low >= 10 ||
        this.up >= 10
      ) {
        this.offsetTips = '框线偏移越界'
      } else {
        this.offsetTips = '✔'
      }
    },
    checkRange() {
      // 上下限校验
      if (this.lowFreq === '' || this.upFreq === '') {
        this.rangeTips = '范围不能为空！'
      } else if (this.lowFreq < 10 || this.upFreq > 20000) {
        this.rangeTips = '范围应在10~20000Hz！'
      } else if (this.lowFreq >= this.upFreq) {
        this.rangeTips = '请输入正确的范围！'
      } else {
        this.rangeTips = '✔'
      }
    },
    openWork() {
      shell.openPath(this.config.workDir + 'output')
    },
    startWork() {
      const _this = this
      if (this.rangeTips === '✔' && this.offsetTips === '✔') {
        this.$emit('show-loading', true)
        this.$ipcRenderer.send('message-to-renderer', {
          type: 'limit2worker',
          data: this.filePath
        })
        this.$ipcRenderer.on('read4limit', arg => {
          const LF = new LimitFactory(
            arg[0].data,
            [this.low, this.up],
            [this.lowFreq, this.upFreq]
          )
          const res = LF.getResult()
          const buffer = xlsx.build([
            {
              name: 'ANC',
              data: res
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
  // input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type='number'] {
    -moz-appearance: textfield;
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
      width: 116px;
      height: 32px;
      cursor: pointer;
    }
  }
  .limit_range {
    display: flex;
    align-items: center;
    margin: 10px 0;
    input {
      width: 75px;
    }
    .rangeTips {
      color: red;
      margin-left: 5px;
    }
  }
  .limit_offset {
    margin: 10px 0;
    display: flex;
    align-items: center;
    .up,
    .low {
      width: 100px;
      input {
        width: 40px;
      }
    }
    .offsetTips {
      margin-left: -20px;
      color: red;
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
