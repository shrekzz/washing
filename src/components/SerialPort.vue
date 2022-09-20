<template>
  <div class="serial">
   <span class="tips">👩‍💼串口助手</span>
    <Button type="primary" @click="getSerialPort" class="refresh-btn" ><Icon class="refresh"  type="reload"  /></Button>
    <a-select class="serial-select" placeholder="选择串口" v-model="portPath">
      <a-select-option v-for="port in ports" :value="port.path" :key="port.pnpId">{{ port.path }}</a-select-option>
    </a-select>
    <Button class="trigger-btn" @click="openSerialPort" :disabled="portPath=== '无端口'" :type="portStatus ? 'primary' : 'danger'"> {{ portStatus ? '打开串口' : '关闭串口' }} </Button>
    <div class="port-message-box">
      <div class="message-content">
        <span v-for="(item, index) in message" :key="index" class="message">{{ `[${item.time}] ${item.type === 'send' ? '👉发：' : '👈收：' } ${item.content}` }} </span>
      </div>
      <div class="command-box">
        <textarea class="command-input" v-model="command" ></textarea>
        <Button class="send-btn" @click="sendCommand(command)">发送</Button>
      </div>
    </div>
    快捷指令：
    <Button @click="sendCommand('>SPP_CH_SET=-1')" >物骐端口</Button>
    <Button @click="sendCommand('>SPP_CH_SET=12')" >BES端口</Button>
  </div>
</template>
<script>
import { Button, Select, Icon } from 'ant-design-vue'
import { SerialPort } from 'serialport'
import { MinutesFormat } from '../utils/utils.js'

export default {
  name: 'SerialPort',
  components: {
    Button,
    ASelect: Select,
    ASelectOption: Select.Option,
    Icon
  },
  data() {
    return {
      ports: [],
      portPath: '无端口',
      portStatus: true,
      message: [],
      command: ''
    }
  },
  methods: {
    getSerialPort() {
      // console.log(SerialPort)
      SerialPort.list().then((ports) => {
        console.log(ports) // 打印串口列表
        this.ports = ports
        this.portPath = ports[0].path
      }).catch((err) => {
        this.portPath = '无端口'
        console.log(err)
      })
    },
    openSerialPort () {
      this.portStatus = !this.portStatus
      if (!this.portStatus) {
        this.$serialPort = new SerialPort({
          path: this.portPath,
          baudRate: 921600,
          autoOpen: false
        })
        this.$serialPort.open(err => {
          if (err && err.message.includes('Access denied')) {
            this.portStatus = !this.portStatus
            this.$message.error('端口不存在或被占用')
          } else {
            this.$serialPort.on('data', data => {
              this.message.push({
                type: 'receive',
                time: MinutesFormat(new Date()),
                content: data
              })
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
    sendCommand(command) {
      console.log(command)
      this.$serialPort.write(command, err => {
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
    }
  },
  mounted() {
    this.getSerialPort()
  }
}
</script>
<style lang='less' socped>
.serial {
  width: 80%;
  padding: 0 10px;
  margin: 0 auto;
  .tips {
    margin: 10px 0;
    font-size: 20px;
    display: block;
  }
  .refresh-btn {
    border-top-right-radius: 0!important;
    border-bottom-right-radius: 0!important;
    border-bottom-left-radius: 0!important;
  }
  .trigger-btn{
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
  .port-message-box {
    position: relative;
    width: 100%;
    height: 360px;
    .message-content {
      width: 100%;
      overflow: auto;
      height: 240px;
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
      height: 120px;
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
}
</style>
