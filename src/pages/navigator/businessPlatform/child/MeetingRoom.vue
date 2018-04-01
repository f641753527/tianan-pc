<template>
  <div class="align-center-main">
    <!--  会议室列表  -->
    <ul class="meeting_room"  v-loading="loading">
      <li class="boxShadow" v-for="(item, index) in meetingRoomList" :key="index">
        <img :src="item.roomPic" alt="">
        <div class="content">
          <h3>{{ item.roomName }}</h3>
          <h4>价格：{{ item.minFee / 100 | PriceFilter }} 元起</h4>
          <p>容量：{{ item.capacityNum }} 人</p>
          <p>其他设备：{{ item.roomTag == '' ? '暂无详情' : item.roomTag }}</p>
          <div class="myButton button" @click="jumpDetails(item.id)">预订</div>
        </div>
      </li>
    </ul>
    <div class='pages main-pagination'>
      <el-pagination :page-size="6" layout="prev, pager, next, jumper" background @current-change="handleCurrentChange" :total="pageTotal"></el-pagination>
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
      loading: false,
      meetingRoomList: [],
    }
  },
  methods: {
    jumpDetails(index) {
      this.$router.push({ path: `/navigator/businessPlatform/meetingRoomDetail/${this.$route.params.serviceId}/${index}` })
    },
    getList() {  // 获取服务列表
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 5000);
      this.$http.post(`${this.URL_PREFIX}/app/get/meeting/room/info/list`, {
        parkId: this.parkIdList[0],
        currPage: this.pageIndex,
        pageRows: 6,
      }).then((response) => {
        const res = response.data;
        this.loading = false;
        if (res.resCode === '10000') {
          this.meetingRoomList = res.resData.pageList || [];
          this.pageTotal = res.resData.pageInfo.total;
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
}
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  margin: 20px 0;
}
// 会议室
.meeting_room{
  li {
    width: 100%;
    height: 300px;
    background-color: #fff;
    margin-bottom: 20px;
    border-radius: 4px;
    display: flex;
    img {
      width: 535px;
      height: 100%;
      border-radius: 4px 0 0 4px;
    }
    .content{
      flex: 1;
      padding-left: 30px;    
      h3 {
        margin-top: 32px;
        margin-bottom: 20px;
        font-size: 30px;
        line-height: 30px;
      }
      h4 {
        font-size: 16px;
        color: #de2c32;
        margin-bottom: 25px;
      }
      p {
        color: #666;
        font-size: 14px;
      }
    }
  }
}

.button {
  margin-top: 35px;
}
.pages{
  margin-top: 60px;
  margin-bottom: 60px;
  text-align: center;
}
</style>
