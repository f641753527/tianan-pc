<template>
  <div class="ParkactivityDetails">
    <div class="box2 boxShadow">
      <img :src="this.info.banner" alt="" class="in_b" >
      <div class="content">
        <h3 class="m_t32 titel" >{{info.title}}</h3>
        <p class="m_t15"> <i class="iconfont  icon-shijian"></i>  {{info.beginTime | DateFilter}} 至 {{info.endTime | DateFilter}}</p>
        <p class="m_t5"> <i class="iconfont  icon-dizhi"></i>  {{info.address}}</p>
        <p class="m_t5"> <i class="iconfont  icon-renshu"></i>  {{info.showNum}}</p>
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
        return{}
      },
    },
  },
  // methods: {
  //   activityDetails(id) {
  //     this.$router.push({ path: `/navigator/activityDetails/${id}` });
  //   },
  // },
}
</script>
<style lang="scss" scoped>
.box2{
  height: 300px;
  display: flex;
  margin-bottom: 20px;
  background-color: #fff;
}
img{
  width: 535px;
  height: 300px;
  cursor: pointer;
  border-radius: 4px 0 0 4px;
}
.content{
  flex: 1;
  box-sizing: border-box;
  padding: 0 0 0 40px;
}
.iconfont{
  color: #999;
  font-size: 16px;
}
.BMbtn{
  width: 100px;
  height: 32px;
  border-radius: 7px;
  background-color: #D0021b;
  color: #fff;
  line-height: 32px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
}
.m_l40{
  margin-left: 40px;
}
.m_t32{
  margin-top: 32px;
}
.m_t15{
  margin-top: 15px;
}
.m_t5{
  margin-top: 5px;
}
.titel{
  font-size: 30px;
  cursor: pointer;
}
</style>
