<template>
  <div class="align-center-main">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商务服务平台</el-breadcrumb-item>
    </el-breadcrumb>
    <ul class="nav clearfix">
      <li v-for="(item, index) in serviceList" :key="index" class="boxShadow" :class="{ 'Select': selectIndex === item.serviceId }" @click="goMenu(item.type, item.serviceId)">
        <img :src="item.picUrl" alt="">
        <span class="textOver"> {{ item.serviceName }} </span>
      </li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      selectIndex: 0,
      serviceList: [],
    }
  },
  methods: {
    goMenu(type, serviceId) {  // 路由定向
      this.selectIndex = serviceId;
      switch (type) {
        case 11:
          this.$router.push({ path: `/navigator/businessPlatform/BusinessNav/recommended/${serviceId}` });
          break;
        case 12:
          this.$router.push({ path: `/navigator/businessPlatform/BusinessNav/meetingRoom/${serviceId}` });
          break;
        case 16:
          this.$router.push({ path: `/navigator/businessPlatform/BusinessNav/other/${serviceId}` });
          break;
        default:
          break;
      }
    },
    getServiceList(flag) {  // 获取商务平台列表
      this.$http.post(`${this.URL_PREFIX}/app/get/park/service/list`, {
        parkId: this.parkIdList[0],
        parentId: 1002,
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.serviceList = res.resData.pageList ? res.resData.pageList : [];
          if (flag === 111) {
            this.goMenu(this.serviceList[0].type, this.serviceList[0].serviceId)
          }
        }
      });
    },
  },
  computed: {
    ...mapGetters(['parkIdList']),
  },
  mounted() {
    this.getServiceList(111);
  },
}
</script>


<style lang="scss" scoped>
.nav {
  margin-bottom: 20px;
  li {
    float: left;
    height: 86px;
    width: 284px;
    margin-right: 20px;
    margin-bottom: 20px;
    background-color: #fff;
    font-size: 24px;
    box-sizing: border-box;
    color: #333;
    border: 1px solid #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 44px;
    &:nth-of-type(4n) {
      margin-right: 0;
    }
    &.Select{
      border-color: #d9262c;
    }
    img {
      width: 44px;
      height: 44px;
      margin-right: 20px;
    }
    span {
      display: inline-block;
      width: 180px;
    }
  }
}
</style>
