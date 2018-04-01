<template>
  <div>
    <!-- <BusinessList></BusinessList> -->
    <!-- 优选列表 -->
    <ul class="youxuan clearfix" v-loading="loading">
      <li class="boxShadow" @click="jumpDetails(item.serviceId)" v-for="item in yuanxuanArr" :key="item.serviceId">
        <img :src="item.banner" alt="">
        <h3 class="textOver">{{ item.title }}</h3>
        <h4>{{ item.discountPrice }}</h4>
      </li>
    </ul>
     <div class='pages main-pagination'>
        <el-pagination :page-size="24" layout="prev, pager, next, jumper" background @current-change="handleCurrentChange" :total="pageTotal"></el-pagination>
      </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex';
// import BusinessList from '../components/BusinessList';

export default {
  data() {
    return {
      pageIndex: 1,
      pageTotal: 0,
      yuanxuanArr: [],
      loading: false,
    }
  },
  methods: {
    goMenu(routerPath) {
      this.$router.push({ path: routerPath, query: { serviceId: 1002 } });
    },
    jumpDetails(index) {
      this.$router.push({ path: `/navigator/businessPlatform/recommendedDetail/${index}` })
    },
    getList() {  // 获取优选服务列表
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 5000);
      this.$http.post(`${this.URL_PREFIX}/app/get/fine/service/info/list`, {
        parkId: this.parkIdList[0],
        currPage: this.pageIndex,
        pageRows: 24,
      }).then((response) => {
        const res = response.data;
        this.loading = false;
        if (res.resCode === '10000') {
          this.yuanxuanArr = res.resData.pageList ? res.resData.pageList : [];
          this.pageTotal = res.resData.pageInfo ? res.resData.pageInfo.total : 0;
        }
      });
    },
    handleCurrentChange(val) {  // 改变页数
      this.pageIndex = val;
      this.getList();
    },
  },
  mounted() {
    this.getList();
  },
  computed: {
    ...mapGetters(['parkIdList']),
  },
  // components: {
  //   BusinessList,
  // }
}
</script>

<style lang="scss" scoped>
// 优选
.youxuan {
  min-height: 300px;
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
}

.pages{
  margin-top: 60px;
  margin-bottom: 60px;
  text-align: center;
}
</style>
