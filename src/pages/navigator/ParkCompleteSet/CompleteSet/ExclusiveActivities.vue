<template>
  <div class="exclusiveActivities align-center-main"  v-loading="loading">
    <div class="clearfix">
      <div class="smallbox boxShadow" v-for="(item, index) in list" :key="index">
        <img :src="item.banner" alt="" @click="exclusiveActivitiesdetails(item.welfareId)">
        <div class="content">
          <p class="titel" @click="exclusiveActivitiesdetails(item.welfareId)">{{item.title}}</p>
          <p class="exclusive m_t5" @click="exclusiveActivitiesdetails(item.welfareId)">园区用户专享：{{item.discountLimit}}</p>
          <p class="welfare m_t5" @click="exclusiveActivitiesdetails(item.welfareId)">福利来自：{{item.providerName}}</p>
          <p class="timeLimit m_t5" @click="exclusiveActivitiesdetails(item.welfareId)">有效期限：{{item.beginTime | DateFilter}} 至 {{item.endTime | DateFilter}}</p>
        </div>
      </div>
    </div>
    <div class="fy main-pagination">
      <el-pagination background layout="prev, pager, next" :total="msgtotal" @current-change="handleCurrentChange" :page-size="20"></el-pagination>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return{
      pageIndex: 1,
      msgtotal: 0,
      list:[],
      loading: true,
    }
  },
  methods:{
    exclusiveActivitiesdetails(id) {
      this.$router.push({ path: `/navigator/exclusiveActivitiesdetails/${id}` });
    },
    exclusiveList() {
      this.$http.post(`${this.URL_PREFIX}/app/get/welfare/info/list`,{
        currPage: this.pageIndex,
        pageRows: 20,
        parkId: this.parkIdList[0],
      }).then((res) => {
        if (res.data.resCode === '10000') {
          this.list = res.data.resData.pageList;
          this.msgtotal = res.data.resData.pageInfo.total;
          this.loading = false;
        }
      });
      setTimeout(() => {
        this.loading = false;
      }, 5000);
    },
    handleCurrentChange(val) {  // 改变页数
      this.pageIndex = val;
      this.exclusiveList();
    },
  },
  created() {
    this.exclusiveList();
  },
  computed: {
    ...mapGetters(['parkIdList']),
  },
}
</script>
<style scoped lang="scss">
.exclusiveActivities{
  height: 100%;
}
.smallbox{
  float: left;
  width: 580px;
  flex: 1;
  height: 126px;
  display: flex;
  margin-right: 20px;
  margin-bottom: 20px;
  &:nth-of-type(2n) {
    margin-right: 0;
  }
  img {
    width: 168px;
    height: 126px;
    cursor: pointer;
    border-radius: 4px 0 0 4px;
  }
}
.content{
  box-sizing: border-box;
  padding: 10px 0 0 20px;
  flex: 1;
  background-color: #fff;
}
.titel{
  color: #333;
  font-size: 20px;
  cursor: pointer;
}
.exclusive{
  color: red;
  font-size: 16px;
  line-height: 20px;
  cursor: pointer;
}
.timeLimit{
  font-size: 12px;
  cursor: pointer;
}
.welfare{
  font-size: 12px;
  cursor: pointer;
}
.m_t5{
  margin-top: 5px;
}
.fy{
  text-align: center;
  margin-top: 76px;
}
</style>
