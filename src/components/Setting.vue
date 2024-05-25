<template>
  <div class="Setting">
    <div class="SettingGlobal">
      <span>🤷‍♂️以管理员模式打开设置才有效</span>
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
    <div class="SettingVersion">
      <span class="title">版本更新</span>
      <span>washing {{ version }}</span>
      <div class="autoUpdate">
        <Checkbox v-model="configuration.autoUpdateFlag" />
        <label>自动更新</label>
      </div>
    </div>
  </div>
</template>

<script>
import { Input, Button, Checkbox } from 'ant-design-vue'
export default {
  components: {
    Input,
    Button,
    Checkbox,
    CheckboxGroup: Checkbox.Group
  },
  props: ['config', 'version'],
  data () {
    return {
      tabs: ['AP数据处理', '产线数据处理', '串口工具'],
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
    .SettingVersion {
      .autoUpdate {
        margin-top: 5px;
        label {
          margin-right: 8px;
        }
      }
    }
  }
</style>
