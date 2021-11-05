<template>
  <div class="a-text" >
    <div class="tips">将ANC调试工具放大，输入faq，点击开始即可</div>
    <a-textarea style="height: 270px" v-model="text" ></a-textarea>
    <Button type="primary" class="start-btn" @click="showText">开始</Button>
  </div>
</template>

<script>
import { Input, Button } from 'ant-design-vue'
import { autoMove } from '../utils/autoFaq'
export default {
  name: 'AutoFaq',
  components: {
    ATextarea: Input.TextArea,
    Button
  },
  data () {
    return {
      text: '请输入'
    }
  },
  methods: {
    showText () {
      let iirArr = this.text.replace(/[\n]/g, '').split(' ').filter(item => item !== '').map(item => Number(item))
      iirArr = iirArr.slice(0, iirArr.length - 1)
      autoMove(iirArr)
    }
  }
}
</script>

<style scopd lang='less'>
.a-text {
  width: 80%;
  margin: 0 auto;
  height: 342px;
}
.tips{
  font-size: 20px;
  margin-bottom: 10px;
}
.start-btn {
  width: 100%;
}
</style>
