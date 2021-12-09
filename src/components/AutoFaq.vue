<template>
  <div class="a-text"  >
    <div class="tips">👩‍🎤将鼠标悬停在第一个输入框，CTRL+Q开始。</div>
    ANC工具类型：<a-select :value="toolType" style="width: 120px;marginBottom: 10px" @change="selectType">
      <a-select-option value="BES">BES</a-select-option>
      <a-select-option value="wuqi">wuqi</a-select-option>
      <a-select-option value="Airoha">Airoha</a-select-option>
    </a-select>
    <a-textarea style="height: 270px" v-model="text" placeholder="请输入参数"></a-textarea>
  </div>
</template>

<script>
import { Input, Select } from 'ant-design-vue'
import { autoMove } from '../utils/autoFaq'
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
      toolType: 'BES'
    }
  },
  methods: {
    autoInput () {
      let iirArr = this.text.replace(/,/g, '').replace(/[\n]/g, '').split(' ').filter(item => item !== '').map(item => Number(item))
      iirArr = iirArr.slice(0, iirArr.length - 1)
      autoMove(iirArr, this.toolType)
    },
    selectType (value) {
      this.toolType = value
    }
  },
  created () {
    // 全局监听ctrl+Q快捷键
    var _this = this
    document.onkeydown = function (e) {
      const key = window.event.keyCode
      if (key === 81 && e.ctrlKey) {
        _this.autoInput()
      }
    }
  }
}
</script>

<style scopd lang='less'>
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
</style>
