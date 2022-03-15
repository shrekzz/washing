<template>
  <div class="Setting">
    <div class="Setting-Global">
      <span class="title">全局设置</span>
      <div>默认打开标签</div>
      <CheckboxGroup :options="tabs" ></CheckboxGroup>
    </div>
    <div class="Setting-AP">
      <span class="title">AP数据处理</span>
      <div class="fileSelectBox">
        <span>选择工作目录：</span>
        <Input type="file" class="fileSelect" style="opacity: 0;" />
        <Input />
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
    CheckboxGroup: Checkbox.Group
  },
  data () {
    return {
      tabs: ['AP数据处理', '产线数据处理', '自动输入FAQ']
    }
  }
}
</script>

<style lang='less'>
  .Setting {
    margin: 5px 20px;
    .title {
      display: block;
      font-size: 20px;
      font-weight: 900;
    }
    Setting-AP {
      height: 50px;
      .fileSelectBox {
        position: relative;
        .fileSelect {
          position: absolute;
          top: 0;
          left: 0;
        }
      }
    }
  }
</style>
