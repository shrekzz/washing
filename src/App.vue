<template>
  <div id="app">
    <div v-if="loading"  class="loading" >
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
        <component :is="item.tabContent"  @show-loading="showLoading" @setConfig="setConfig" :ref="item.key" :config="configuration" :version="version" />
      </a-tab-pane>
    </a-tabs>
    <div class="home" v-else>
      <img src="./../build/home.png" class="home-pic"/>
      <span class="home-tips">左侧标签栏选择功能以开始</span>
    </div>
    <div class="footer">
      <a-tooltip placement="top">
        <template slot="title"><span class="tooltips">关于</span></template>
        <span class="setting" @click="visible = true" >💬</span>
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
    <a-drawer title="关于" placement="right" :closable="false" @close="close" :visible="visible" width="35%" >
      <div class="drawer">
        <div class="logo">
          <img src="./../build/home.png" />
          <div class="description">
            <span>washing</span>
            <span>v{{ version }}</span>
            <span>by: shrekz</span>
          </div>
        </div>
        <p>
        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="24" data-view-component="true" class="octicon octicon-mark-github">
          <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
        </svg><a @click="openBrowser" >shrekzz</a>
        </p>
        <p>&nbsp;📧 xiezhi26@gmail.com</p>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { shell } from 'electron'
import { Tabs, Tooltip, Menu, Drawer } from 'ant-design-vue'
import { writeFile, existsSync, readFile } from 'fs'
import { logger } from './utils/log.js'
import { version } from '../package.json'

// 按需加载
const LineData = () => import('./components/LineData.vue')
const ApData = () => import('./components/ApData.vue')
const AutoFaq = () => import('./components/AutoFaq.vue')
const Setting = () => import('./components/Setting.vue')
const LimitLine = () => import('./components/LimitLine.vue')

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
    AMenuItem: Menu.Item,
    LimitLine,
    ADrawer: Drawer
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
    setConfig (cfg = { workDir: 'D:/WASHING_WORK/', defaultTabs: [], autoUpdateFlag: false }) {
      this.configuration = cfg
      const config = JSON.stringify(cfg)
      writeFile('./config.json', config, err => {
        if (err) {
          logger.error(err)
        }
      })
    },
    close () {
      this.$nextTick(() => {
        this.visible = false
      })
    },
    openBrowser () {
      shell.openExternal('https://github.com/shrekzz/tool')
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
        },
        {
          key: 'limit',
          tab: '自动生成框线',
          menuContent: '框线',
          tabContent: 'limit-line'
        }
      ],
      activePanes: [],
      configuration: [],
      visible: false,
      version: version
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
          this.tabs = [this.activePanes[0].key]
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
.drawer {
  -moz-user-select: text;
  -khtml-user-select: text;
  user-select: text;
  .logo {
    margin-bottom: 1em;
    display: flex;
    img {
      width: 63px;
      height: 63px;
    }
    .description {
      :first-child {
        color: #111;
      }
      margin-left: 10px;
      width: 70px;
      span {
        display: inline-block;
      }
    }
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
