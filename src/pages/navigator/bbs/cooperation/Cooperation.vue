<template>
  <div>
    <ul class="content" v-loading="loading">
      <router-link :to="{ path: `/navigator/bbs/cooperationDetails/${item.serviceId}` }" v-for="item in CooperationList" :key="item.serviceId">
        <List :msg="item"></List>
      </router-link>
    </ul>
     <div class='pages main-pagination'>
        <el-pagination :page-size="16" layout="prev, pager, next, jumper" background @current-change="handleCurrentChange" :total="pageTotal"></el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import List from '../components/List';

export default {
  data() {
    return {
      CooperationList: [],
      pageIndex: 1,
      pageTotal: 0,
      loading: false,
    }
  },
  components: {
    List,
  },
  methods: {
    getList() {  // 获取求购服务列表
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 5000);
      this.$http.post(`${this.URL_PREFIX}/app/get/ask/service/list`, {
        parkId: this.parkIdList[0],
        currPage: this.pageIndex,
        pageRows: 16,
      }).then((response) => {
        const res = response.data;
        this.loading = false;
        if (res.resCode === '10000') {
          this.CooperationList = res.resData.pageList ? res.resData.pageList : [];
          this.pageTotal = res.resData.pageInfo ? res.resData.pageInfo.total : 0;
        }
      });
    },
    handleCurrentChange(val) {  // 改变页数
      this.pageIndex = val;
      this.getList();
    },
  },
  computed: {
    ...mapGetters(['parkIdList']),
  },
  mounted() {
    this.getList();
  },
}
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.pages{
  margin-top: 60px;
  margin-bottom: 60px;
  text-align: center;
}
</style>

