<template>
  <div>
    <li class="boxShadow" @click="$router.push({ path: `/navigator/financePlatform/financeInfo/${info}` })">
      <!-- 办公室出租组件 -->
      <img :src="info.banner" alt="">
      <h3>{{ info.title }}</h3>
    </li>
  </div>
</template>

<script>
export default {
  props: {
    info:{
      type: Object,
      default() {
        return{}
      },
    },
  },
}
</script>

<style lang="scss" scoped>
li {
    width: 285px;
    height: 222px;
    margin-bottom: 20px;
    cursor: pointer;
    background-color: #fff;
    img {
      width: 100%;
      height: 160px;
      border-radius: 4px 4px 0 0;
    }
    h3 {
      line-height: 42px;
      text-align: center;
    }
  }
</style>
