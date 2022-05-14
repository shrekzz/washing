<template>
  <div id="app">
    <div v-show="loading"  class="loading" >
       <img src="./../build/loading.gif" />
    </div>
    <div class="loading" v-if="false">
      <div class="settingDialog"></div>
    </div>
    <a-menu class="menu" :selected-keys="[tabs[0]]" :default-selected-keys="[tabs[0]]"  mode="inline">
      <a-menu-item v-for="item in panes" :key="item.key" @click="changeTypes(item)">{{ item.menuContent }}</a-menu-item>
    </a-menu>
    <a-tabs v-if="activePanes.length !== 0" class="tabs" type="editable-card" v-model="tabs[0]" hide-add  size="large" @edit="onEdit">
      <a-tab-pane v-for="item in activePanes" :key="item.key" :tab="item.tab" @click="changeActived(item.key)">
        <component :is="item.tabContent"  @showLoading="showLoading" @setConfig="setConfig" :ref="item.key" :config="configuration" />
      </a-tab-pane>
    </a-tabs>
    <div class="home" v-else>
      <img src="./../build/home.png" class="home-pic"/>
      <span class="home-tips">左侧标签栏选择功能以开始</span>
    </div>
    <div class="footer">
      <a-tooltip placement="top">
        <template slot="title"><span class="tooltips">关于</span></template>
        <span class="setting">💬</span>
      </a-tooltip>
      <a-tooltip placement="topRight" :arrowPointAtCenter="true" >
        <template slot="title"><span class="tooltips">设置</span></template>
        <span class="setting" @click="changeTypes({
          key: 'setting',
          tab: '设置',
          menuContent: '',
          tabContent: 'setting'
        })">⚙</span>
      </a-tooltip>
    </div>
  </div>
</template>

<script>
import { Tabs, Tooltip, Menu } from 'ant-design-vue'
import { writeFile, existsSync, readFile } from 'fs'
import { logger } from './utils/log.js'

// 按需加载
const LineData = () => import('./components/LineData.vue')
const ApData = () => import('./components/ApData.vue')
const AutoFaq = () => import('./components/AutoFaq.vue')
const Setting = () => import('./components/Setting.vue')

export default {
  name: 'App',
  components: {
    LineData,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    ApData,
    AutoFaq,
    Setting,
    ATooltip: Tooltip,
    AMenu: Menu,
    AMenuItem: Menu.Item
  },
  methods: {
    callback (key) {
      console.log(key)
    },
    showLoading (e) {
      this.loading = e
    },
    changeTypes (item) {
      let flag = false
      this.tabs = [item.key]
      this.activePanes.forEach(pane => {
        if (pane.key === item.key) {
          flag = true
        }
      })
      if (!flag) {
        this.activePanes.push(item)
      }
    },
    changeActived (key) {
      this.tabs = [key]
    },
    /* 标签删除方法 */
    onEdit (targetKey, action) {
      if (action === 'remove') {
        if (targetKey === 'setting') {
          console.log(this.$refs.setting.$data)
        }
        let activeKey = this.tabs[0]
        let lastIndex
        this.activePanes.forEach((item, i) => {
          if (item.key === targetKey) {
            lastIndex = i - 1
          }
        })
        const panes = this.activePanes.filter(item => item.key !== targetKey)
        if (panes.length && activeKey === targetKey) {
          if (lastIndex >= 0) {
            activeKey = panes[lastIndex].key
          } else {
            activeKey = panes[0].key
          }
        }
        this.activePanes = panes
        this.tabs = [activeKey]
      }
    },
    setConfig (cfg = { workDir: 'D:/WASHING_WORK/', defaultTabs: [] }) {
      this.configuration = cfg
      const config = JSON.stringify(cfg)
      writeFile('./config.json', config, err => {
        if (err) {
          logger.error(err)
        }
      })
    }
  },
  data () {
    return {
      loading: false,
      tabs: ['ap'],
      panes: [
        {
          key: 'ap',
          tab: 'AP数据处理',
          menuContent: 'AP',
          tabContent: 'ap-data'
        },
        {
          key: 'line',
          tab: '产线数据处理',
          menuContent: '产线',
          tabContent: 'line-data'
        },
        {
          key: 'auto',
          tab: '自动输入FAQ',
          menuContent: 'Auto',
          tabContent: 'auto-faq'
        }
      ],
      activePanes: [],
      configuration: []
    }
  },
  created () {
    if (!existsSync('./config.json')) {
      this.setConfig()
    } else {
      readFile('./config.json', (err, data) => {
        if (err) {
          logger.error(err)
        } else {
          this.configuration = JSON.parse(data)
          const defaultTabs = this.configuration.defaultTabs
          for (let i = 0; i < defaultTabs.length; i++) {
            for (let j = 0; j < this.panes.length; j++) {
              if (this.panes[j].tab === defaultTabs[i]) {
                this.activePanes.push(this.panes[j])
                continue
              }
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="less">
body{
  -moz-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}
.home {
  overflow: hidden;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  background: #f5f4f4;
  .home-pic {
    margin: 0 auto;
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
    width: 300px;
    height: 250px;
  }
  .home-tips {
    color: #949494;
    letter-spacing: 2px;
    margin: 15px 0;
  }
}

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
.menu {
  float: left;
  width: 70px;
  height: 100vh;
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
