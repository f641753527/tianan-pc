<template>
  <div>
    <li class="boxShadow" v-for="(item,index) in youxuan" :key="index" @click="jumpDetails(index)">
      <img :src="item.src" alt="">
      <h3 class="textOver">{{ item.title }}</h3>
      <h4>园区用户专享：{{ item.youhui }}</h4>
    </li>
  </div>
</template>

<script>
export default {
  props: {
    youxuan: {
      type: Array,
      default: '',
    },
  },
  methods: {
    jumpDetails(index) {
      this.$router.push({ path: `/navigator/businessPlatform/recommendedDetail/${index}` })
    }
  }
}
</script>


<style lang="scss" scoped>
li {
  float: left;
  width: 285px;
  height: 250px;
  margin-right: 20px;
  margin-bottom: 20px;
  background-color: #fff;
  border-radius: 4px;
  cursor: pointer;
  &:nth-of-type(4n) {
    margin-right: 0;
  }
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

