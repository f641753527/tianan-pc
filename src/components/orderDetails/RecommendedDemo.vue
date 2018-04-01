<template>
  <div>
    <li class="boxShadow" @click="$router.push({ path: `/navigator/businessPlatform/recommendedDetail/${info.serviceId}`})">
      <img :src="info.banner" alt="">
      <h3 class="textOver">{{ info.title }}</h3>
      <h4>园区用户专享：{{ info.price }}</h4>
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
  height: 250px;
  margin-right: 20px;
  margin-bottom: 20px;
  background-color: #fff;
  cursor: pointer;
  img {
    width: 100%;
    height: 160px;
    border-radius: 4px 4px 0 0;
  }
  h3 {
    padding: 10px 20px 0;
    font-size: 20px;
    line-height: 30px;
  }
  h4 {
    padding: 0 20px;
    line-height: 30px;
    color: #de2c32;
    font-size: 16px;
  }
}
</style>

