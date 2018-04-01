<template>
  <div class="CustomDemo">
    <div v-for="(item, index) in info.content" :key="index">
      <p class="" v-if="item.type !== 7"><span class="lable">{{item.title}} </span><span class="m_l20 in_b">{{item.value}}</span></p>
      <div class="" v-if="item.type === 7">
        <span class="lable"> {{item.title}} </span>
        <img :src="item.value" alt="" class="img_b">
      </div>
    </div>

  </div>
</template>
<script>
export default {
  props: {
    info: {
      type: Object,
      default() {
        return{};
      },
    },
  },
}
</script>
<style lang="scss" scoped>
.CustomDemo{
  font-size: 16px;
  >div {
    transform: translateX(-30deg);
  }
}
.lable{
  display: inline-block;
  vertical-align: middle;
  width: 192px;
  text-align: center;
}
.img_b{
  display: inline-block;
  vertical-align: top;
  width: 114px;
  height: 117px;
  margin-left: 20px;
}
.m_l20{
  margin-left: 20px;
}
.in_b{
  display: inline-block;
}
</style>
