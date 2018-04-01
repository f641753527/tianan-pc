<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>金融服务平台</el-breadcrumb-item>
    </el-breadcrumb>
    <ul class="content clearfix" v-loading="loading">
      <li class="boxShadow" v-for="(item, index) in serviceList" :key="index" @click="$router.push({ path: `/navigator/financePlatform/financeInfo/${item.serviceId}` })">
        <div class="logo">
          <img :src="item.picUrl" alt="">
        </div>
        <h3 class="textOver">{{ item.serviceName }}</h3>
      </li>
    </ul>
   <!--  <div class='pages main-pagination'>
      <el-pagination
        :page-size="1"
        layout="prev, pager, next, jumper" background
        :total="56">
      </el-pagination>
    </div> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      serviceList: [],
      loading: false,
    }
  },
  methods: {
    getServiceList() {  // 获取商务平台列表
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 5000);
      this.$http.post(`${this.URL_PREFIX}/app/get/park/service/list`, {
        parkId: this.parkIdList[0],
        parentId: 1004,
      }).then((response) => {
        const res = response.data;
        this.loading = false;
        if (res.resCode === '10000') {
          this.serviceList = res.resData.pageList ? res.resData.pageList : [];
        }
      });
    },
  },
  computed: {
    ...mapGetters(['parkIdList']),
  },
  mounted() {
    this.getServiceList();
  },
}
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  margin: 20px 0;
}
.content {
  li {
    float: left;
    width: 285px;
    // height: 222px;
    background-color: #fff;
    margin-right: 20px;
    margin-bottom: 20px;
    cursor: pointer;
    &:nth-of-type(4n) {
      margin-right: 0;
    }
    .logo {
      height: 160px;
      box-sizing: border-box;
      border-bottom: 2px solid #f6f6f6;
      img {
        width: 100%;
        height: 100%;
      }
    }
    h3 {
      font-size: 20px;
      font-weight: 600;
      padding: 18px;
      width: 250px;
    }
  }
}
// .pages{
//     margin-top: 20px;
//     margin-bottom: 20px;
//     text-align: center;
//   }
</style>
