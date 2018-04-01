<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>信息交互平台</el-breadcrumb-item>
    </el-breadcrumb>
    <ul class="nav clearfix">
      <li v-for="(item,index) in navList" :key="index" class="boxShadow" :class="{ 'select': selectIndex === item.type }" @click="selectNav(item.type)">
        <img :src="item.picUrl" alt="">
        <h3>{{ item.serviceName }}</h3>
      </li>
    </ul>
    <!-- <router-view></router-view> -->
    <BbsIndex v-if="selectIndex === 15"></BbsIndex>
    <Cooperation v-if="selectIndex === 8"></Cooperation>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Cooperation from '@/pages/navigator/bbs/cooperation/Cooperation';
import BbsIndex from './bbs/Index';

export default {
  data() {
    return {
      navList: [],
      selectIndex: 1,
    }
  },
  methods: {
    selectNav(index) {
      this.selectIndex = index;
    },
    getNavList(flag) {  // 获取商务平台列表
      this.$http.post(`${this.URL_PREFIX}/app/get/park/service/list`, {
        parkId: this.parkIdList[0],
        parentId: this.$route.query.serviceId,
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.navList = res.resData.pageList ? res.resData.pageList : [];
          this.selectIndex = this.navList[0].type;
        }
      });
    },
  },
  mounted() {
    this.getNavList();
  },
  computed: {
    ...mapGetters(['parkIdList']),
  },
  components: {
    BbsIndex, Cooperation
  }
}
</script>

<style lang="scss" scoped>
.nav {
  margin-bottom: 26px;
  li {
    width: 284px;
    padding: 0 30px;
    height: 88px;
    float: left;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    margin-bottom: 20px;
    cursor: pointer;
    &:nth-of-type(4n) {
      margin-right: 0;
    }
    &.select {
      border: 1px solid red;
    }
    h3 {
      font-size: 24px;
      font-weight: 600;
      width: 180px;
    }
    img {
      width: 44px;
      height: 44px;
      margin-right: 20px;
    }
  }
}
</style>
