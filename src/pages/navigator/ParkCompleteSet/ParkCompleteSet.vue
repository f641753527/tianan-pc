<template>
  <div class="ParkCompleteSet">
    <div class="header align-center-main">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>园区配套平台</el-breadcrumb-item>
        <el-breadcrumb-item>{{routerName}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="">
        <!-- <router-link to="/navigator/parkCompleteSet/activity"> -->
          <div class="box1 boxShadow" :class="{'select' : action === item.type }" v-for="(item, index) in tebList" :key="index"
          @click="Jump(item.type)">
            <img :src="item.picUrl" alt="" class="img_b">
            <p class=""> <span class="text textOver">{{item.serviceName}}</span> </p>
          </div>
        <!-- </router-link> -->
        <!-- <router-link to="/navigator/parkCompleteSet/foodCourt">
          <div class="box1 boxShadow" :class="{'select' : $route.name == 'foodCourt'}">
            <img src="" alt="" class="icon">
            <p> <span>园区美食街</span> </p>
          </div>
        </router-link>
        <router-link to="/navigator/parkCompleteSet/exclusiveActivities">
          <div class="box1 boxShadow" :class="{'select' : $route.name == 'exclusiveActivities'}">
            <img src="" alt="" class="icon">
            <p> <span>园区专享活动</span> </p>
          </div>
        </router-link> -->
      </div>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      huodong: true,
      meishi: false,
      zhuanxiang: false,
      routerName: '园区活动',
      tebList:[],
      parentId: 1006,
      action: 0,
    };
  },
  methods: {
    getList() {
      this.$http.post(`${this.URL_PREFIX}/app/get/park/service/list`, {
        parkId: this.parkIdList[0],
        parentId: this.parentId,
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.tebList = res.resData ? res.resData.pageList : [];
          this.Jump(res.resData.pageList[0].type);
        }
      });
    },
    Jump(type) {
      this.action = type;
      if(type === 13) {
        this.$router.push({ path: `/navigator/parkCompleteSet/activity` });
      }else if(type === 9) {
        this.$router.push({ path: `/navigator/parkCompleteSet/foodCourt` });
      }else if(type === 14) {
        this.$router.push({ path: `/navigator/parkCompleteSet/exclusiveActivities` });
      }
    },
  },
  created() {
    this.getList();
  },
  watch: {
    $route() {
      switch (this.$route.name) {
        case 'activity':
          this.routerName = '园区活动';
          break;
        case 'foodCourt':
          this.routerName = '园区美食街';
          break;
        case 'exclusiveActivities':
          this.routerName = '园区专享活动';
          break;
        default:
          break;
      };
    } ,
  },
  computed: {
    ...mapGetters(['parkIdList']),
  },
}
</script>
<style lang="scss" scoped>

.ParkCompleteSet{
  padding-bottom: 18px;
  background-color: #f6f6f6;
} 
p{
  display: inline-block;
  font-size: 24px;
  color: #333;
}
.box1{
  // margin-top: 22px;
  margin-right: 18px;
  width: 285px;
  height: 88px;
  display: inline-block;
  line-height: 88px;
  background-color: white;
  text-align: center;
  border: 1px solid #fff;
  box-sizing: border-box;
  cursor: pointer;
  span, i, img, p{
    display: inline-block;
    vertical-align: middle;
  }
  .text{
    width: 200px;
  }
  .img_b{
    margin-left: 30px;
    width: 44px;
    height: 44px;
}
}
.select {
  border-color: red;
}
.content{
  margin-top: 40px;
}
.icon{
  width: 44px;
  height: 41px;
}
</style>
