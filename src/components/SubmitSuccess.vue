<template>
  <div class='pane'>
    <h1 class='title'>{{title}}</h1>
    <p class='msg'>{{tipsMsg}}</p>
    <p class='close'><el-button class='confirm' size='mini' @click='confirm'>关闭</el-button></p>
  </div>
</template>

<script>
export default {
  props: {
    title:{
      type: String,
      default: '提示',
    },
    tipsMsg: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
      default: 3000,
    },
  },
  methods: {
    confirm(){
      this.$emit('close');
    },
  },
  created() {
    setTimeout(() => {
      this.$emit('close');
    }, this.duration);
  },
};
</script>

<style lang="scss" scoped>
.pane{
  position: fixed;
  z-index: 999;
  padding: 30px 40px;
  border: 1px solid #c4c4c4;
  background: #FFFFFF;
  width: 400px;
  .title{
    font-weight: 600;
    text-align: center;
  }
  .msg{
    margin-bottom: 20px;
    text-align: center;
    line-height: 36px;
  }
  .close{
    text-align: center;
    .confirm{
      background: #d0011b;
      border-color: #d0011b;
      color: #FFFFFF;
    }
  }
}
</style>

