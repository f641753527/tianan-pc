<template>
  <div class="align-center-main" v-loading="loading">
    <!--  办公室列表  -->
    <ul class="office clearfix">
      <li class="boxShadow" v-for="(item2, index) in categoryList" :key="index" @click="jumpDetails(item2.facilitiesId)">
        <img :src="item2.banner" alt="">
        <h3>{{ item2.title }}</h3>
      </li>
    </ul>
     <div class='pages main-pagination'>
        <el-pagination :page-size="24" layout="prev, pager, next, jumper" background @current-change="handleCurrentChange" :total="pageTotal"></el-pagination>
      </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      categoryList: [],
      loading: false,
      pageTotal: 0,
      pageIndex: 1,
    }
  },
  methods: {
    jumpDetails(index) {
      this.$router.push({ path: `/navigator/businessPlatform/OtherDetail/${index}`, query: { serviceId: this.$route.params.otherId } })
    },
    handleCurrentChange(val) {  // 改变页数
      this.pageIndex = val;
      this.getList();
    },
    getList() {  // 获取列表
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 5000);
      this.$http.post(`${this.URL_PREFIX}/app/get/facilities/rent/list`, {
        parkId: this.parkIdList[0],
        serviceId: this.$route.params.otherId,
        currPage: this.pageIndex,
        pageRows: 24,
      }).then((response) => {
        const res = response.data;
        this.loading = false;
        if (res.resCode === '10000') {
          this.categoryList = res.resData.pageList ? res.resData.pageList : [];
          this.pageTotal = res.resData.pageInfo ? res.resData.pageInfo.total : 0;
        }
      });
    },
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters(['parkIdList']),
  },
  watch: {
    $route() {
      this.getList();
    }
  }
}
</script>

<style lang="scss" scoped>

.office {
  li {
    float: left;
    width: 285px;
    height: 222px;
    margin-right: 20px;
    margin-bottom: 20px;
    cursor: pointer;
    background-color: #fff;
    &:nth-of-type(4n) {
      margin-right: 0;
    }
    img {
      width: 100%;
      height: 160px;
      border-radius: 4px 4px 0 0;
    }
    h3 {
      height: 62px;
      line-height: 62px;
      text-align: center;
    }
  }
}

.pages{
  margin-top: 60px;
  margin-bottom: 60px;
  text-align: center;
}
</style>
