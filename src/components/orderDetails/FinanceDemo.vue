<template>
  <div>
    <li class="boxShadow"  @click="$router.push({ path: `/navigator/financePlatform/financeInfo/${financeId}` })">
      <div class="logo">
        <img :src="info.banner" alt="">
      </div>
      <h3 class="textOver">{{ info.title }}</h3>
    </li>
  </div>
</template>

<script>
export default {
  props: {
    info: {
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
  background-color: #fff;
  margin-right: 20px;
  margin-bottom: 20px;
  cursor: pointer;
  .logo {
    height: 160px;
    box-sizing: border-box;
    border-bottom: 2px solid #f6f6f6;
    display: flex;
    justify-content: center;
    align-items: center;
    img {
      width: 200px;
      height: 59px;
    }
  }
  h3 {
    font-size: 20px;
    line-height: 42px;
    font-weight: 600;
    padding: 0 14px;
  }
}
</style>
