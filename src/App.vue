<template>
  <div id="app">
    <div v-show="loading"  class="loading" >
       <Spin size="large" tip="处理中..." />
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
  </div>
</template>

<script>
import LineData from './components/LineData.vue'
import ApData from './components/ApData.vue'
import AutoFaq from './components/AutoFaq.vue'
import { Tabs, Spin } from 'ant-design-vue'

export default {
  name: 'App',
  components: {
    LineData,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    Spin,
    ApData,
    AutoFaq
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
</style>
