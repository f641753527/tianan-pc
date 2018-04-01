<template>
  <div class="ParkexclusiveActivities">
    <div class="smallbox boxShadow">
      <img :src="info.banner" alt="">
      <div class="content">
        <p class="titel">{{info.title}}</p>
        <p class="exclusive m_t5">园区用户专享：{{info.discountLimit}}</p>
        <p class="welfare m_t5">福利来自：{{info.providerName}}</p>
        <p class="timeLimit m_t5">有效期限：{{info.beginTime | DateFilter}} 至 {{info.endTime | DateFilter}}</p>
      </div>
    </div>
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
.smallbox{
  width: 590px;
  flex: 1;
  height: 126px;
  display: flex;
  margin-right: 20px;
  img {
    width: 168px;
    height: 126px;
    cursor: pointer;
  }
}
.content{
  box-sizing: border-box;
  padding: 10px 0 0 20px;
  flex: 1;
  background-color: #fff;
}
.titel{
  color: #333;
  font-size: 20px;
  cursor: pointer;
}
.exclusive{
  color: red;
  font-size: 16px;
  line-height: 20px;
  cursor: pointer;
}
.timeLimit{
  font-size: 12px;
  cursor: pointer;
}
.welfare{
  font-size: 12px;
  cursor: pointer;
}
.m_t5{
  margin-top: 5px;
}
</style>
