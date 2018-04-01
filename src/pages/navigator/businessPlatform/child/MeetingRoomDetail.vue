<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/navigator/businessPlatform/businessNav', query: { serviceId : 1002 } }">商务服务平台</el-breadcrumb-item>
      <!-- <el-breadcrumb-item :to="{ path: '/navigator/businessPlatform/businessList/meetingRoom', query: { serviceId : 1002 } }">会议室出租</el-breadcrumb-item> -->
      <el-breadcrumb-item>详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="header boxShadow" v-loading="loading">
      <img :src="meetingInfo.roomPic" alt="">
      <div class="title">
        <h3>{{ meetingInfo.roomName }}</h3>
        <p class="price">价格：{{ meetingInfo.minFee / 100 | PriceFilter }} 元起</p>
        <p>容量: {{ meetingInfo.capacityNum }} 人</p>
        <p>其他设备: {{ meetingInfo.roomTag }} </p>
        <div class="myButton" @click="$router.push({ path: `/navigator/businessPlatform/letMeetingRoom/${$route.params.serviceId}`, query: { id: meetingInfo.id } })">预约</div>
      </div>
    </div>
    <div class="content boxShadow" v-loading="loading">
      <h3>会议室介绍</h3>
      <div v-html="meetingInfo.content" ref="text"></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      meetingInfo: {},
      loading: false,
    }
  },
  methods: {
    getInfo() {  // 获取服务详情
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 5000);
      this.$http.post(`${this.URL_PREFIX}/app/get/meeting/room/info/detail`, {
        parkId: this.parkIdList[0],
        id: this.$route.params.itemsId,
      }).then((response) => {
        const res = response.data;
        this.loading = false;
        if (res.resCode === '10000') {
          this.meetingInfo = res.resData;
        }
      });
    },
  },
  updated() {
    const imgs = this.$refs.text.querySelectorAll('img');
    imgs.forEach((val) => {
      val.style.maxWidth = '100%';
    });
  },
  computed: {
    ...mapGetters(['parkIdList']),
  },
  mounted() {
    this.getInfo();
  },
}
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  margin: 20px 0;
}
.header {
  display: flex;
  height: 300px;
  background-color: #fff;
  img {
    width: 535px;
    height: 100%;
    border-radius: 4px 0 0 4px;
  }
  .title {
    flex: 1;
    padding: 30px;
    h3 {
      font-size: 30px;
      font-weight: 600;
    }
    p {
      font-size: 12px;
      &:last-of-type {
        margin-bottom: 30px;
      }
    }
    .price {
      color: #de2c32;
      font-size: 16px;
      line-height: 40px;
      font-weight: 600;
      margin-bottom: 20px;
    }
  }
}
.content {
  min-height: 200px;
  margin-top: 20px;
  margin-bottom: 20px;
  background-color: #fff;
  padding: 34px 40px;
  h3 {
    font-weight: 600;
    margin-bottom: 20px;
  }
}
.submit-success{
  right: 30%;
  bottom: 50%;
}
</style>

