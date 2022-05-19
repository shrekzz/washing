<template>
  <div class="Setting">
    <div class="SettingGlobal">
      <span class="title">全局设置</span>
      <div>默认打开标签</div>
      <CheckboxGroup :options="tabs" v-model="configuration.defaultTabs" ></CheckboxGroup>
    </div>
    <div class="SettingAP">
      <span class="title">AP数据处理</span>
      <span>选择工作目录</span>
      <div class="fileSelectBox">
        <Input type="file" class="fileSelect filePath" webkitdirectory  @change="getFilePath"/>
        <Input v-model="configuration.workDir" class="filePath"/>
      </div>
    </div>
    <div >
      <span class="title">版本更新</span>
      ver 0.1.8
    </div>
  </div>
</template>

<script>
import { Input, Button, Checkbox } from 'ant-design-vue'
export default {
  components: {
    Input,
    Button,
    CheckboxGroup: Checkbox.Group
  },
  props: ['config'],
  data () {
    return {
      tabs: ['AP数据处理', '产线数据处理', '自动输入FAQ', '自动生成框线'],
      configuration: this.config
    }
  },
  methods: {
    getFilePath (e) {
      const path = e.target.files[0].path
      this.configuration.workDir = path.slice(0, path.lastIndexOf('\\')) + '/WASHING_WORK'
    }
  },
  beforeDestroy () {
    this.$emit('setConfig', this.configuration)
  }
}
</script>

<style lang="less">
  .Setting {
    margin: 5px 20px;
    .title {
      display: block;
      font-size: 20px;
      font-weight: 900;
    }
    .SettingAP {
      margin-top: 5px;
      .fileSelectBox {
        position: relative;
        .fileSelect {
          position: absolute;
          opacity: 0!important;
          top: 0;
          left: 0;
          z-index: 99;
        }
        .filePath {
          width: 60%;
        }
      }
    }
  }
</style>
