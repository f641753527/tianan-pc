<template>
  <div class="activity align-center-main" v-loading="loading">
    <div class="box2 boxShadow" v-for="(item, index) in textList" :key="index" >
      <img :src="item.banner" alt="" class="in_b borred"  @click="activityDetails(item.activityId)">
      <div class="content">
        <h3 class="m_t40 titel" @click="activityDetails(item.activityId)">{{item.activityParkName}}</h3>
        <p class="m_t20"> <i class="iconfont  icon-shijian"></i>  时间：{{item.beginTime | DateFilter }} 至 {{item.endTime | DateFilter }}</p>
        <p class="m_t10"> <i class="iconfont  icon-dizhi"></i>  地点：{{item.cityName }} {{item.countyName}} {{item.address}}</p>
        <p class="m_t10"> <i class="iconfont  icon-renshu"></i>  名额：{{item.showNum}} 人</p>
        <div class="BMbtn m_t20"  @click="activityDetails(item.activityId)">报 名</div>
      </div>
    </div>
    
    <div class="fy main-pagination">
      <el-pagination background layout="prev, pager, next" :total="msgtotal"  @current-change="handleCurrentChange" :page-size="10"></el-pagination>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return{
      textList: [],
      msgtotal: 0,
      pageIndex: 1,
      loading: true,
    }
  },
  methods:{
    activityDetails(id) {
      this.$router.push({ path: `/navigator/activityDetails/${id}` });
    },
    getActivitylist() {
      this.$http.post(`${this.URL_PREFIX}/app/get/activity/info/list`, {
        currPage: this.pageIndex,
        pageRows: 10,
        parkId: this.parkIdList[0],
      }).then((res) => {
        if(res.data.resCode === '10000') {
          this.textList = res.data.resData.pageList;
          this.msgtotal = res.data.resData.pageInfo.total;
          this.loading = false;
        }
      })
      setTimeout(() => {
        this.loading = false;
      }, 5000);
    },
    handleCurrentChange(val) {  // 改变页数
      this.pageIndex = val;
      this.getActivitylist();
    },
  },
  created() {
    this.getActivitylist();
  },
  computed: {
    ...mapGetters(['parkIdList']),
  },
}
</script>
<style scoped lang="scss">
.box2{
  height: 300px;
  display: flex;
  margin-bottom: 20px;
  background-color: #fff;
  .borred{
    border-radius: 4px 0 0 4px;
  }
}
img{
  width: 535px;
  height: 300px;
  cursor: pointer;
}
.content{
  flex: 1;
  box-sizing: border-box;
  padding: 0 0 0 40px;
}
.iconfont{
  color: #999;
  font-size: 16px;
}
.BMbtn{
  width: 100px;
  height: 32px;
  border-radius: 7px;
  background-color: #D0021b;
  color: #fff;
  line-height: 32px;
  text-align: center;
  font-size: 16px;
  cursor: pointer;
}
.m_l40{
  margin-left: 40px;
}
.m_t40{
  margin-top: 40px;
}
.m_t20{
  margin-top: 20px;
}
.m_t10{
  margin-top: 10px;
}
.titel{
  font-size: 30px;
  cursor: pointer;
  min-height: 40px;
}
.fy{
  text-align: center;
  margin-top: 76px;
}
</style>

