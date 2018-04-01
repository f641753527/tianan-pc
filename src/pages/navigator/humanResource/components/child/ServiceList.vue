<template>
  <div class='service-list'>
    <p class='type-list'>
      <span class='type' :class='{ "active": categoryId === "" }'
            @click.stop='switchType("")'>全部</span>
      <span class='type' v-for='(type, index) in jobTypeList' :key='index' :class='{ "active": categoryId === type.id }'
            @click.stop='switchType(type.id)'>{{type.name}}</span>
    </p>
    <div class='job-list'>
      <Job v-for='(job, index) in jobList' :key='index' :job='job'></Job>
    </div>
    <div class='pages main-pagination'>
      <el-pagination :page-size="condition.pageRows" @current-change="handleCurrentChange" layout="total, prev, pager, next, jumper" background :total="total"></el-pagination>
    </div>
  </div>
</template>

<script>
import Job from './ServiceItem';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      jobTypeList: [],
      jobList: [],
      categoryId: '',
      // 当前筛选类型
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
      this.getJobList();
    },
    getJobTypeListList() {
      this.$http.post(`${this.URL_PREFIX}/app/get/hr/service/category/list`, {
        parkId: this.parkIdList[0],
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.jobTypeList = res.resData.pageList ? res.resData.pageList : [];
        }
      });
    },
    getJobList() {
      this.$http.post(`${this.URL_PREFIX}/app/get/hr/service/info/list`, {
        ...this.condition,
        parkId: this.parkIdList[0],
        categoryId: this.categoryId,
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.jobList = res.resData.pageList ? res.resData.pageList : [];
          this.total = res.resData.pageInfo ? res.resData.pageInfo.total : 0;
        }
      });
    },
    // 类型筛选
    switchType(key) {
      this.categoryId = key;
      this.getJobList();
    },
  },
  components: { Job },
  computed: {
    ...mapGetters(['parkIdList']),
  },
  created() {
    this.getJobTypeListList();
    this.getJobList();
  },
};
</script>

<style lang="scss" scoped>
@import '~@scss';
.service-list{
  margin-top: 60px;
  .type-list{
    .type{
      display: inline-block;
      width: 100px;
      height: 30px;
      margin-right: 20px;
      border: 1px solid #c4c4c4;
      border-radius: 2px;
      line-height: 30px;
      text-align: center;
      color: #666666;
      cursor: pointer;
      &.active{
        background: $color-main;
        border-color: $color-main;
        color: #ffffff;
      }
    }
    .type:hover{
      background: $color-main;
      border-color: $color-main;
      color: #ffffff;
    }
  }
  .pages{
    margin-top: 30px;
    text-align: center;
  }
}
</style>

