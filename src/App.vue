<template>
  <div id="app">
    <div v-show="loading"  class="loading" >
       <Spin size="large" tip="处理中..." />
    </div>
    <div class="loading" v-if="false">
      <div class="settingDialog"></div>
    </div>
    <a-tabs default-active-key="1" @change="callback" size="large">
      <a-tab-pane key="1" tab="产线数据处理">
        <line-data @showLoading="showLoading" />
      </a-tab-pane>
      <a-tab-pane key="2" tab="AP数据处理" force-render>
        <ap-data @showLoading="showLoading" />
      </a-tab-pane>
      <a-tab-pane key="3" tab="自动输入FAQ" >
        <auto-faq></auto-faq>
      </a-tab-pane>
    </a-tabs>
    <div class="footer">
      <a-tooltip placement="top">
        <template slot="title"><span class="tooltips">(施工中)</span></template>
        <span class="setting">💬</span>
      </a-tooltip>
      <a-tooltip placement="top">
        <template slot="title"><span class="tooltips">(施工中)</span></template>
          <span class="setting">⚙</span>
      </a-tooltip>
    </div>
  </div>
</template>

<script>
import LineData from './components/LineData.vue'
import ApData from './components/ApData.vue'
import AutoFaq from './components/AutoFaq.vue'
import { Tabs, Spin, Tooltip } from 'ant-design-vue'

export default {
  name: 'App',
  components: {
    LineData,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    Spin,
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
