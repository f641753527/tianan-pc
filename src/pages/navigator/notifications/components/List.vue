<template>
  <div class='notification-list'>
    <!-- <p class='header'><router-link to='/navigator' >首页</router-link> > 园区通知</p> -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>园区通知</el-breadcrumb-item>
    </el-breadcrumb>
    <div class='list boxShadow' v-loading="loading">
      <Item v-for='(item, index) in newsList' :key='index' :info='item'></Item>
    </div>
    <div class='pages main-pagination'>
      <el-pagination
      :page-size="8"
      layout="prev, pager, next, jumper" background
      @current-change="handleCurrentChange"
      :total="pageTotal">
    </el-pagination>
    </div>
  </div>
</template>

<script>
import Item from './child/Item';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      newsList : [],
      pageIndex: 1,
      pageTotal: 0,
      loading: false,
    };
  },
  components: { Item },
  methods: {
    getNewsList() {  // 获取通知列表
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 5000);
      this.$http.post(`${this.URL_PREFIX}/app/get/park/notice/list`, {
        parkId: this.parkIdList[0],
        currPage: this.pageIndex,
        pageRows: 8,
      }).then((response) => {
        const res = response.data;
        this.loading = false;
        if (res.resCode === '10000') {
          this.newsList = res.resData.pageList ? res.resData.pageList : [];
          this.pageTotal = res.resData.pageInfo ? res.resData.pageInfo.total : 0;
        }
      });
    },
    handleCurrentChange(val) {  // 改变页数
      this.pageIndex = val;
      this.getNewsList();
    },
  },
  mounted() {
    this.getNewsList();
  },
  computed: {
    ...mapGetters(['parkIdList']),
  },
}
</script>

<style lang="scss" scoped>
.notification-list{
  padding-bottom: 30px;
  .header{
    margin-bottom: 20px;
    a{
      color: #333333;
    }
    a:hover{
      text-decoration: underline;
      color: #999999;
    }
    font-size: 12px;
    line-height: 20px;
    color: #333333;
  }
  .list{
    // padding: 30px 15px;
    background: #FFFFFF;
  }
  .pages{
    margin-top: 30px;
    text-align: center;
  }
}
</style>

