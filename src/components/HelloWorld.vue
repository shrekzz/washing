<template>
  <div class="handle">
    <div class="header">
      <span>产线数据处理</span>
      <Divider class="line" />
    </div>
    <div class="content">
      <div class="tips">1.选择产线数据所在的目录</div>
      <div class="getFileBox">
        <Button class="chooseBtn" >选择文件目录</Button>
        {{ this.filePath }}
        <label class="getFilePath">
          <input style="display: none" class="getFilePath" type="file" webkitdirectory @change="getFilePath($event)" />
        </label>
      </div>
      <div>
        <div class="tips">2.选择需要的行(只能输入数字)</div>
        <div class="btn-group">
          <Button type="primary" class="add" @click="handleRow('add')">+</Button>
          <Button type="primary" class="sub" @click="handleRow('')">-</Button>
        </div>
        <div class="input-group">
          <Input class="input-row" v-for="(item, index) in rows" :key="index" type="number" v-model="rows[index]" />
        </div>
      </div>
      <div class="btn-group">
        <Button class="start" type="" @click="checkInsert">开始</Button>
        <Button class="open" type="primary" @click="openWork" >打开工作目录</Button>
      </div>
    </div>
  <div></div>
  </div>
</template>

<script>
import { readFile, mkdir, existsSync } from 'fs'
import { Button, Input, Divider } from 'ant-design-vue'
import { shell } from 'electron'
export default {
  name: 'HelloWorld',
  data () {
    return {
      rows: [0],
      filePath: ''
    }
  },
  components: {
    Button,
    Input,
    Divider
  },
  methods: {
    getFilePath (e) {
      const path = e.target.files[0].path
      this.filePath = path.slice(0, path.lastIndexOf('\\'))
      console.log(this.filePath)
    },
    handleRow (status) {
      if (status === 'add') {
        this.rows.push('')
      } else if (this.rows.length !== 1) {
        this.rows.pop()
      }
    },
    /* 处理输入 去重、去空、转为int */
    checkInsert () {
      const res = [...new Set(this.rows)].filter(item => item !== '').map(item => parseInt(item))
      console.log(res)
    },
    /* 打开工作目录 */
    openWork () {
      shell.openPath('d:/Washing_Output')
    }
  },
  mounted () {
    readFile('d:/abc.txt', (err, data) => {
      if (!err) {
        console.log(data)
      }
    })
  },
  created () {
    const WORK_DIR = 'd:/Washing_Output'
    if (existsSync(WORK_DIR)) {
      mkdir(WORK_DIR, err => {
        if (err) {
          console.log(err)
        }
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">

  .tips {
    margin: 10px 0;
    font-size: 15px;
  }
  .header {
    font-size: 20px;
    padding:10px 20px;
    font-weight: 700;
    .line {
      margin: 10px 0;
    }
  }
  .content {
    width: 60%;
    padding: 0 10px;
    margin: 0 auto;
    .getFileBox {
      position: relative;
      .getFilePath {
        position: absolute;
        top: 0;
        left: 0;
        width: 116px;
        height: 32px;
        cursor: pointer;
      }
    }
  }
  .btn-group {
    display: flex;
    margin: 5px 0;
    width: 100%;
    justify-content: space-between;
    .add, .sub{
      width: 48%;
      font-weight: 500;
      font-size: 18px;
    }
     .start, .open {
      width: 48%;
    }
  }
  .input-row {
    margin: 5px 0;
  }
  .input-group {
    max-height: 220px;
    overflow-y: auto;
  }
</style>
