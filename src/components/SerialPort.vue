<template>
  <div class="serial">
   <span class="tips">👩‍💼串口助手</span>
    <Button type="primary" @click="getSerialPort" class="refresh-btn" ><Icon class="refresh"  type="reload"  /></Button>
    <a-select class="serial-select" placeholder="选择串口" v-model="portPath">
      <a-select-option v-for="port in ports" :value="port.path" :key="port.pnpId">{{ port.path }}</a-select-option>
    </a-select>
    <Input class="baud-rate" v-model="baudRate" :disabled="!portStatus" type="number"/>
    <Button class="trigger-btn" @click="openSerialPort" :disabled="portPath=== '无端口'" :type="portStatus ? 'primary' : 'danger'"> {{ portStatus ? '打开串口' : '关闭串口' }} </Button>
    <Button :disabled="portStatus" @click="searchBT">搜索</Button>
    <div class="devices-box">
      <ul class="devices-action">
        <li @click="resetDevice()">🚮清除设备</li>
        <li @click="connectDevice()">🔗连接</li>
        <li>
          <a-select placeholder="模式" class="device-action-mode">
            <a-select-option @click="sendCommand('>OPEN\sA2DP\r\n')" key="A2DP">A2DP</a-select-option>
            <a-select-option @click="sendCommand('>OPEN\sHFP\r\n')" key="HFP">HFP</a-select-option>
          </a-select>
        </li>
        <li style="border: none;" @click="disconnectDevice()">✂断连</li>
      </ul>
      <ul class="devices-title">
        <li>蓝牙名</li>
        <li>地址</li>
        <li>RSSI</li>
        <li style="border: none;">状态</li>
      </ul>
      <div class="devices-list-box">
        <ul class="devices-list" v-for="(device, index) in devicesList" :key="device.DEVICE" :class="{ 'highlight': currentHighlight === index }" @click="checkDevice(device, index)">
          <li>{{ device.NAME }}</li>
          <li>{{ device.DEVICE }}</li>
          <li>{{ device.RSSI }}</li>
          <li style="border: none;">{{ device.STATUS }}</li>
        </ul>
      </div>

    </div>
    <div class="port-message-box">
      <div class="message-content" ref="messageContent">
        <span v-for="(item, index) in message" :key="index" class="message">{{ `[${item.time}] ${item.type === 'send' ? '👉发：' : '👈收：' } ${item.content}` }} </span>
      </div>
      <div class="command-box">
        <textarea class="command-input" ref="commandInput" v-model="command" ></textarea>
        <Button class="send-btn" @click="sendCommand(command, isHex ? 'hex' : 'utf-8')">发送</Button>
      </div>
    </div>
    快捷指令：
    <Button @click="sendCommand('>SPP_CH_SET=-1')" >物骐端口</Button>
    <Button @click="sendCommand('>SPP_CH_SET=12')" >BES端口</Button>
    <Checkbox class="checkHex" :checked="isHex" @change="isHex = !isHex">十六进制发送</Checkbox>
  </div>
</template>
<script>
import { Button, Select, Icon, Input, Checkbox } from 'ant-design-vue'
import { SerialPort } from 'serialport'
import { MinutesFormat } from '../utils/utils.js'

export default {
  name: 'SerialPort',
  components: {
    Button,
    ASelect: Select,
    ASelectOption: Select.Option,
    Icon,
    Input,
    Checkbox
  },
  data() {
    return {
      ports: [],
      portPath: '无端口',
      portStatus: true,
      message: [],
      command: '',
      isHex: false,
      baudRate: 921600,
      devicesList: [],
      currentHighlight: null, // 当前高亮的索引
      checkedContent: [] // 点击的内容
    }
  },
  methods: {
    getSerialPort() {
      SerialPort.list().then((ports) => {
        this.ports = ports
        this.portPath = ports[0].path
      }).catch((err) => {
        this.portPath = '无端口'
        console.log(err)
      })
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const messageContent = this.$refs.messageContent
        if (messageContent) {
          messageContent.scrollTop = messageContent.scrollHeight
        }
      })
    },
    openSerialPort () {
      this.portStatus = !this.portStatus
      if (!this.portStatus) {
        this.$serialPort = new SerialPort({
          path: this.portPath,
          baudRate: parseInt(this.baudRate),
          autoOpen: false
        })
        this.$serialPort.open(err => {
          if (err && err.message.includes('Access denied')) {
            this.portStatus = !this.portStatus
            this.$message.error('端口不存在或被占用')
          } else {
            this.$serialPort.on('data', data => {
              // if (data.includes('action')) {
              console.log(data.toString('hex'))
              this.message.push({
                type: 'receive',
                time: MinutesFormat(new Date()),
                content: this.isHex ? data.toString('hex') : data
              })
              if (data.toString().includes('SPP_CONNECT')) {
                console.log('Connected')
                this.checkedContent.STATUS = 'Connected'
              } else if (data.toString().includes('SppDisconnectInd,spp_disconnect_abnormal_disconnect')) {
                this.checkedContent.STATUS = 'Not paired'
              }
              // }
              this.scrollToBottom()
            })
            console.log('open ok')
          }
        })
      } else {
        this.$serialPort.close(err => {
          if (err) {
            this.$message.error(err)
          } else {
            console.log('close ok')
          }
        })
      }
    },
    sendCommand(command, encodoing = 'utf-8') {
      this.$serialPort.write(command, encodoing, err => {
        if (err) {
          console.log(err)
        } else {
          console.log('write ok')
          this.message.push({
            type: 'send',
            time: MinutesFormat(new Date()),
            content: command
          })
        }
      })
    },
    addCtrlAListener(textarea) {
      textarea.addEventListener('keydown', event => {
        if (event.ctrlKey && event.key === 'a') {
          event.preventDefault() // 阻止默认行为
          textarea.select() // 全选当前文本框内的文本
        }
      })
    },
    searchBT() {
      this.isHex = false
      this.currentHighlight = null
      this.checkedContent = []
      const _this = this
      const startIndex = _this.message.length
      let deviceList = []
      _this.sendCommand('>SEARCH=5')
      _this.$emit('show-loading', true)
      setTimeout(function() {
        _this.sendCommand('>SEARCH STOP')
        console.log(_this.message)
        deviceList = _this.message.slice((startIndex)).map(item => {
          if (item.type !== 'send') {
            return item.content.toString('utf-8')
          }
        })
        console.log(deviceList)
        const parsedObjects = deviceList.map(item => {
        // 使用正则表达式来提取信息并创建对象
          if (typeof item === 'string') {
            const regex = /^DEVICE=(.*?)\s+RSSI=(-?\d+)\s+NAME=(.*?)\s+CLASS=(.*?)\s+/
            const matches = item.match(regex)
            if (matches) {
              return {
                DEVICE: matches[1],
                RSSI: parseInt(matches[2], 10), // 将RSSI转换为整数
                NAME: matches[3],
                STATUS: 'Not paired'
              }
            }
          }
          return null
        }).filter(item => item !== null) // 过滤掉null值
        // 去重
        const uniqueDevices = []
        parsedObjects.forEach(obj => {
          if (!uniqueDevices.some(device => device.DEVICE === obj.DEVICE)) {
            uniqueDevices.push(obj)
          }
        })
        _this.devicesList = uniqueDevices
        _this.$emit('show-loading', false)
      }, 10000)
    },
    checkDevice(item, index) {
      // 如果当前点击的项目已经是高亮的，则取消高亮
      if (this.currentHighlight === index) {
        this.currentHighlight = null
        this.checkedContent = ''
      } else {
        // 更新当前高亮的项目
        this.currentHighlight = index
        // 获取点击的内容
        this.checkedContent = item
      }
    },
    connectDevice() {
      if (this.checkedContent.STATUS !== 'Not paired') {
        console.log('no device')
        return
      }
      this.sendCommand(`>SPP_CONN=${this.checkedContent.DEVICE}\r\n`)
    },
    disconnectDevice() {
      this.sendCommand('>DISC\r\n')
      this.checkedContent.STATUS = 'Not paired'
    },
    resetDevice() {
      this.devicesList = []
      this.currentHighlight = null
      this.checkedContent = []
      this.sendCommand('>RST\r\n')
    }
  },
  mounted() {
    this.getSerialPort()
    this.addCtrlAListener(this.$refs.commandInput)
  },
  beforeDestroy() {
    if (this.$refs.commandInput) {
      this.$refs.commandInput.removeEventListener('keydown', this.preventCtrlA)
    }
    // 移除其他输入框的事件监听器
  }
}
</script>
<style lang='less' socped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
.highlight {
  background: #e6f7ff;
}

.serial {
  width: 80%;
  padding: 0 10px;
  margin: 0 auto;
  .tips {
    margin: 10px 0;
    font-size: 20px;
    display: block;
  }
  .baud-rate {
    width: 80px;
  }
  .refresh-btn {
    border-top-right-radius: 0!important;
    border-bottom-right-radius: 0!important;
    border-bottom-left-radius: 0!important;
  }
  .trigger-btn {
    border-top-left-radius: 0!important;
    border-bottom-right-radius: 0!important;
    border-bottom-left-radius: 0!important;
  }
  .serial-select {
    width: 100px;
    height: 32px;
    .ant-select-selection {
      border-radius: 0!important;
    }
  }
  .devices-box {
    .devices-action {
      padding: 0;
      background: #f0f0f0;
      border-radius: 5px 5px 0 0 ;
      .device-action-mode {
        width: 100%;
        .ant-select-selection {
          border: 0!important;
          background: none!important;
          border-radius: 0;
          border-color: none!important;
          outline: none!important;
          margin: 0;
          &:hover {
            border: 0!important;
            border-color: none!important;
          }
          .ant-select-selection__placeholder{
            color: rgba(0, 0, 0, 0.65)
          }
        }
      }
      li{
        padding: 5px 10px;
        transition: background-color 0.3s ease;
      }
      li:hover {
        background: #e6f7ff;
        cursor: pointer;
      }
    }
    ul {
      cursor: auto;
      width: 100%;
      margin: 0;
      padding: 5px 10px;
      display: flex;
      justify-content: space-between;
      border: 1px solid #d9d9d9;
      li {
        cursor: default;
        border-right: 2px solid #d9d9d9;
        list-style: none;
        width: 25%;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
        padding-left: 5px;
      }
    }
    .devices-list-box {
      height: 120px;
      border: 1px solid #ebebeb;
      border-top: none;
      .devices-box {
        padding: 0;
      }
    }
  }
  .port-message-box {
    position: relative;
    width: 100%;
    height: 200px;
    .message-content {
      width: 100%;
      overflow: auto;
      height: 120px;
      -moz-user-select: text;
      -khtml-user-select: text;
      user-select: text;
      border: 1px solid #ebebeb;
      background: #f0f0f0;
      .message {
        display: block;
        margin-top: 10px;
        margin-left: 10px;
      }
    }
    .command-box {
      height: 80px;
      width: 100%;
      border: 1px solid #ebebeb;
      .command-input{
        margin-top: 10px;
        padding: 0 12px;
        width: 100%;
        outline: none;/*边线不显示*/
        resize: none;/*禁止拉伸*/
        // background:#05E02E;/*带点绿*/
        // border: 1px solid #05E02E;
        border: none;
        // border-top: 1px solid #ebebeb;
        appearance:none;
        height: 67px;
        font-size: 14px;
        overflow: auto;
      }
      .send-btn {
        position: absolute;
        right: 8px;
        bottom: 5px;
        float: right;
        width: 80px;
      }
    }
  }
  .checkHex {
    position: absolute;
    right: 58px;
    bottom: 5px;
  }
}
</style>
