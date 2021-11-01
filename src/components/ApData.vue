<template>
  <div>
    <div class="fileListBox">
      <div class="plus" v-if="false">
        <span class="plus-pos">+</span>
      </div>
      <div class="fileListTile" v-if="true">
        <ul>
          <li>文件名</li>
          <li>修改时间</li>
          <li>大小</li>
        </ul>
      </div>
    </div>
    <Button>开始</Button>
  </div>
</template>

<script>
import { Button } from 'ant-design-vue'
export default {
  name: 'ApData',
  components: {
    Button
  }
}
</script>

<style lang='less' scoped>
.fileListBox {
  // display: flex;
  // justify-content: center;
  // align-items: center;
  width: 80%;
  height: 260px;
  border: 10px rgba(199, 199, 199) dashed;
  border-radius: 10px;
  margin: 20px auto;
  &:hover {
    border: 10px #1890ff dashed;
    .plus {
      color: #1890ff;
    }
  }
  transition: border .3s;
  .plus {
    cursor: pointer;
    margin: 0 auto;
    top: 20%;
    width: 150px;
    height: 150px;
    position: relative;
    font-size: 130px;
    font-weight: 600;
    color: rgba(199, 199, 199);
    transition:  color .3s;
    .plus-pos {
      display: block;
      position: absolute;
      top: -35px;
      left: 30px;
    }
  }
  .fileListTile {
    width: 100%;
    ul {
      width: 100%;
      padding: 10px;
      margin: 0;
      display: flex;
      justify-content: space-between;
      li {
        list-style: none;
        width: 33%;
      }
    }
  }
}
</style>
