<template>
  <div class='production-list'>
    <!-- <p class='header'><router-link to='/navigator' >首页</router-link> > 产品路演平台</p> -->
     <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>产品路演平台</el-breadcrumb-item>
      <!-- <el-breadcrumb-item>详情</el-breadcrumb-item> -->
    </el-breadcrumb>
    <div class='list'>
      <Item v-for='(item, index) in productionList' :key='index' :info='item'></Item>
    </div>
    <div class='pages main-pagination'>
      <el-pagination
      :page-size="condition.pageRows" @current-change="handleCurrentChange"
      layout="total, prev, pager, next, jumper" background
      :total="total">
    </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Item from './child/Item';

export default {
  data() {
    return {
      productionList : [],
      condition: {
        currPage: 1,
        pageRows: 10,
      },
      total: 0,
    };
  },
  methods: {
    // 分页
    handleCurrentChange(page) {
      this.condition.currPage = page;
      this.getList();
    },
    getList() {
      this.$http.post(`${this.URL_PREFIX}/app/get/products/roadshow/list`, {
        ...this.condition,
        parkId: this.parkIdList[0],
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.productionList = res.resData.pageList ? res.resData.pageList : [];
          this.total = res.resData.pageInfo ? res.resData.pageInfo.total : 0;
        }
      });
    },
  },
  computed: {
    ...mapGetters(['parkIdList']),
  },
  components: { Item },
  created() {
    this.getList();
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss';
.production-list{
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
  .pages{
    margin-top: 60px;
    text-align: center;
  }
}
</style>

