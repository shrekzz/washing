<template>
  <div class="limit">
    <span class="tips">💁‍♂️选择待处理文件</span>
    <div class="getFileBox">
        <Button class="chooseBtn" >选择文件</Button>
        <label class="getFilePath">
          <input style="display: none" class="getFilePath" accept=".xlsx" type="file" @change="getFilePath($event)" />
        </label>
        {{ filePath }}
    </div>
    <div>例：文件格式如下：</div>
    <img src="./../../build/limit_eg.png" />
    <div class="tips"><span>🗡条件选择</span></div>
    <div class="limit_range">
      范围：<Input class=""  type="number" v-model="lowFreq" @change="checkInsert('lowFreq')" />
      <span style="margin: 0 10px">~</span>
      <Input  type="number" v-model="upFreq" @change="checkInsert('upFreq')" />
      <span style="margin: 0 10px">Hz</span>
    </div>
    <div class="limit_offset">
      上限：<div class="up"><Input addon-before="+"  type="number" v-model="up" @change="checkInsert('up')" /></div>
      下限：<div class="low"><Input type="number" addon-before="-" v-model="low" @change="checkInsert('low')" /></div>
    </div>
    <div class="btn-group">
      <Button class="start" type="" @change="checkInsert" :disabled="startFlag">开始</Button>
      <Button class="open" type="primary" @click="openWork" >打开工作目录</Button>
    </div>
  </div>
</template>

<script>
import { Input, Button } from 'ant-design-vue'
import { shell } from 'electron'

export default {
  name: 'LimitLine',
  components: {
    Input,
    Button
  },
  data () {
    return {
      filePath: '',
      lowFreq: 0,
      upFreq: 20000,
      low: 0,
      up: 0
    }
  },
  props: ['config'],
  methods: {
    getFilePath (e) {
      const path = e.target.files[0].path
      this.filePath = path
    },
    checkInsert (type) {
      switch (type) {
        case 'low':
          this.low = Number(this.low) >= 0 && Number(this.low) <= 10 ? Number(this.low) : 0
          break
        case 'up':
          this.up = Number(this.up) >= 0 && Number(this.up) <= 10 ? Number(this.up) : 0
          break
        case 'lowFreq':
          this.lowFreq = Number(this.lowFreq) < Number(this.upFreq) && Number(this.lowFreq) >= 0 ? Number(this.lowFreq) : 0
          break
        case 'upFreq':
          this.upFreq = Number(this.upFreq) > Number(this.lowFreq) && Number(this.upFreq) <= 20000 ? Number(this.upFreq) : 20000
      }
      this.$emit('showLoading', true)
    },
    openWork () {
      shell.openPath(this.config.workDir + 'output')
    }
  },
  computed: {
    startFlag () {
      return this.filePath === ''
    }
  }
}
</script>

<style lang="less">
.limit {
    width: 80%;
    padding: 0 10px;
    margin: 0 auto;
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }
    input[type="number"]{
        -moz-appearance: textfield;
    }
   .tips {
     margin: 10px 0;
     font-size: 20px;
   }
   .getFileBox {
      position: relative;
      margin:10px 0;
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
    margin: 5px 0;
    input {
      width: 75px;
    }
  }
  .limit_offset {
    margin: 5px 0;
    display: flex;
    align-items: center;
    .up, .low {
      width: 100px;
      input {
        width: 40px;
      }
    }
  }
  .btn-group {
    display: flex;
    margin: 15px 0;
    width: 100%;
    justify-content: space-between;
    .add, .sub{
      width: 48%;
    }
     .start, .open {
      width: 48%;
    }
  }
}
</style>
