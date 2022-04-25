<template>
  <div class="Setting">
    <div class="SettingGlobal">
      <span class="title">全局设置</span>
      <div>默认打开标签</div>
      <CheckboxGroup :options="tabs" v-model="configuration.defaultTabs" @change="test" ></CheckboxGroup>
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
    </div>
    <Button>保存</Button>
  </div>
</template>

<script>
import { Input, Button, Checkbox } from 'ant-design-vue'
import { readFile } from 'fs'
export default {
  components: {
    Input,
    Button,
    CheckboxGroup: Checkbox.Group
  },
  data () {
    return {
      tabs: ['AP数据处理', '产线数据处理', '自动输入FAQ'],
      configuration: {
        defaultTabs: [],
        workDir: ''
      },
      editStatus: false
    }
  },
  methods: {
    getFilePath (e) {
      const path = e.target.files[0].path
      this.configuration.workDir = path.slice(0, path.lastIndexOf('\\')) + '/WASHING_WORK'
    },
    getConfig () {
      readFile('./config.json', (err, data) => {
        if (err) {
          console.log(err)
        } else {
          this.configuration = JSON.parse(data)
        }
      })
    },
    test () {
      console.log(this.configuration)
    }
  },
  created () {
    this.getConfig()
  },
  watch: {
    configuration: {
      deep: true,
      handler (newVal, oldVal) {
        this.editStatus = true
      }
    }
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
