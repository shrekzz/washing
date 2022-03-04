<template>
  <div id="app">
    <div v-show="loading"  class="loading" >
       <img src="./../build/loading.gif" />
    </div>
    <div class="loading" v-if="false">
      <div class="settingDialog"></div>
    </div>
    <a-tabs default-active-key="1" @change="callback" size="large">
        <a-tab-pane key="1" tab="AP数据处理" force-render>
        <ap-data @showLoading="showLoading" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="产线数据处理">
        <line-data @showLoading="showLoading" />
      </a-tab-pane>
      <a-tab-pane key="3" tab="自动输入FAQ" >
        <auto-faq></auto-faq>
      </a-tab-pane>
    </a-tabs>
    <div class="footer">
      <a-tooltip placement="top">
        <template slot="title"><span class="tooltips">关于</span></template>
        <span class="setting">💬</span>
      </a-tooltip>
      <a-tooltip placement="topRight" :arrowPointAtCenter="true">
        <template slot="title"><span class="tooltips">设置</span></template>
          <span class="setting">⚙</span>
      </a-tooltip>
    </div>
  </div>
</template>

<script>
import { Tabs, Tooltip } from 'ant-design-vue'
// 按需加载
const LineData = () => import('./components/LineData.vue')
const ApData = () => import('./components/ApData.vue')
const AutoFaq = () => import('./components/AutoFaq.vue')

export default {
  name: 'App',
  components: {
    LineData,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    ApData,
    AutoFaq,
    ATooltip: Tooltip
  },
  methods: {
    callback (key) {
      console.log(key)
    },
    showLoading (e) {
      this.loading = e
    }
  },
  data () {
    return {
      loading: false
    }
  }
}
</script>

<style lang="less">

.loading{
  margin: 0 auto;
  width: 100%;
  position: absolute;
  top: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
}
.settingDialog {
  width: 600px;
  height: 300px;
  background: white;
}
.footer {
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  width: 100%;
  position: fixed;
  height: 20px;
  background: #87c5ff;
  bottom: 0;
  text-align: right;
  .tooltips {
    font-size: 8px;
  }
  .setting {
    transition: background .3s;
    cursor: pointer;
    padding: 0 2px;
    margin-right: 5px ;
    &:hover {
      background: #6c92b43f;
    }
  }
}
</style>
