<template>
  <div class="autofaq">
    <div class="a-text"  >
      <div class="tips">👩‍🎤将鼠标悬停在第一个输入框，CTRL+Q开始。</div>
      ANC工具类型：<a-select :value="toolType" style="width: 120px;marginBottom: 10px" @change="selectType">
        <a-select-option value="BES">BES</a-select-option>
        <a-select-option value="wuqi">wuqi</a-select-option>
        <a-select-option value="Airoha">Airoha</a-select-option>
        <a-select-option value="BES Config">BES Config</a-select-option>
      </a-select>
      <a-textarea style="height: 270px" v-model="text" placeholder="请输入参数"></a-textarea>
    </div>
    <div class="select-config" v-if="toolType === 'BES Config'">
      <input type="file" @change="getFilePath($event)" />
      <div class="config">
        <span class="filter">FF: {{ FFIIR }}</span><br/>
        <span class="filter">FB: {{ FBIIR }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { BESConfig } from '../utils/utils'
import { readFile } from 'fs'
import { Input, Select } from 'ant-design-vue'
import { autoMove } from '../utils/autoFaq'
import { ipcRenderer } from 'electron'
import { logger } from '../utils/log'
export default {
  name: 'AutoFaq',
  components: {
    ATextarea: Input.TextArea,
    ASelect: Select,
    ASelectOption: Select.Option
  },
  data () {
    return {
      text: '',
      toolType: 'BES',
      FFIIR: [],
      FBIIR: [],
      stop: false
    }
  },
  methods: {
    autoInput () {
      if (this.text !== '') {
        let iirArr = this.text.replace(/,/g, '').replace(/[\n]/g, '').replace(/[\t]/g, ' ').split(' ').filter(item => item !== '').map(item => Number(item))
        iirArr = iirArr.slice(0, iirArr.length - 1)
        autoMove(iirArr, this.toolType)
      }
    },
    selectType (value) {
      this.toolType = value
    },
    getFilePath (e) {
      const _this = this
      readFile(e.target.files[0].path, { encoding: 'utf-8' }, (err, data) => {
        if (err) {
          logger.error(err)
        }
        const FF = data.split(/\r\n/)[177]
        const FB = data.split(/\r\n/)[514]
        _this.FFIIR = BESConfig(FF)
        _this.FBIIR = BESConfig(FB)
      })
    }
  },
  created () {
    // 全局监听ctrl+Q快捷键
    var _this = this
    ipcRenderer.on('autoInput', (e) => {
      _this.autoInput()
    })
  }
}
</script>

<style scopd lang='less'>
.autofaq {
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}
.a-text {
  width: 80%;
  margin: 0 auto;
  height: 352px;
}
.tips{
  font-size: 20px;
  margin-bottom: 10px;
}
.start-btn {
  width: 100%;
}
.select-config {
  width: 80%;
  margin: 10px auto;
  .config {
     height: 100px;
  }
}
</style>
