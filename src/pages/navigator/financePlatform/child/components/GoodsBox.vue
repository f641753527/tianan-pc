<template>
  <div class="header boxShadow">
    <div class="logo">
      <img :src="imgSrc" alt="">
      </div>
      <h3>{{ title }}</h3>
  </div>
</template>


<script>
export default {
  data() {
    return {
    }
  },
   props: {
    imgSrc:{
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
  },
}
</script>

<style lang="scss" scoped>
.header {
  width: 285px;
  height: 222px;
  background-color: #fff;
  margin-bottom: 20px;
  cursor: pointer;
  .logo {
    height: 160px;
    box-sizing: border-box;
    border-bottom: 2px solid #f6f6f6;
    padding-left: 44px;
    padding-top: 50px;
    img {
      margin-top: 50px;
      width: 200px;
      height: 59px;
      margin: 0 auto;
    }
  }
  h3 {
    font-size: 20px;
    line-height: 62px;
    font-weight: 600;
    padding-left: 18px;
  }
}
</style>
