<template>
  <div class="style">
   <el-carousel height="600px" arrow="always" :interval="changTime" @change="changeBanber($event)" indicator-position="none">
    <el-carousel-item v-for="(item, index) in bannerList" :key="index" id="lunbo">
      <!-- <router-link :to="item.linkUrl == null ? '/' : item.linkUrl" v-if="item.type === 2"> -->
      <img :src="item.picUrl" :title="item.title" v-if="item.type === 2">
      <!-- </router-link> -->
      <video :src="item.videoUrl" controls onpageshow :id="'video' + index" @click="videoClick(index)" v-if="item.type === 1">您的浏览器暂不支持播放该视频，请升级至最新版浏览器。</video>
    </el-carousel-item>
  </el-carousel>
  <section class="notice align-center-main">
    <h3 class="aside boxShadow" @click="goPath('/navigator/notifications')">园区<br/>通知</h3>
    <div class="content boxShadow">
      <ul>
        <li v-for="(item,index) in noticeList" :key="index" @click="$router.push({ path: `/navigator/notifications/detail/${item.noticeId}` })">
          <h4>{{ item.noticeTitle }}</h4>
          <span class="noticeTime">{{ item.createTime | DateFilter }}</span>
        </li>
      </ul>
    </div>
  </section>
  <section class="activity align-center-main">
    <div class="header">
      <h3>园区活动</h3>
      <span class="checkMore" @click="goService(1006)">查看更多</span>
    </div>
    <ul class="content">
      <li v-for="(item, index) in activityList" :key="index" class="boxShadow" @click="$router.push({ path: `/navigator/activityDetails/${item.activityId}` })">
        <img :src="item.banner" alt="">
        <div class="title">
          <h4 class="textOver">{{ item.title }}</h4>
          <p class="time">{{ item.beginTime | DateFilter }} 至 {{ item.endTime | DateFilter }}</p>
        </div>
      </li>
    </ul>
  </section>
  <section class="align-center-main welfare">
    <div class="header">
      <h3>园区专享福利</h3>
      <span class="checkMore" @click="goPath('/navigator/parkCompleteSet/exclusiveActivities')">查看更多</span>
    </div>
    <div class="content">
      <div class="box boxShadow" v-for="(item, index) in welfareList" :key="index" @click="$router.push({ path: `/navigator/exclusiveActivitiesdetails/${item.welfareId}` })">
        <img :src="item.banner" alt="">
        <div class="imgContent">
          <h4>{{item.title}}</h4>
          <p class="youhui">{{item.discountLimit}}</p>
          <p>来自：{{item.providerName}}</p>
          <p class="time">有效期限：{{ item.beginTime | DateFilter }} 至 {{ item.endTime | DateFilter }}</p>
        </div>
      </div>
    </div>
  </section>
  <section class="serviceStyle clearfix">
    <div class="header align-center-main">
      <h3>八大服务</h3>
      <p>互联网行业解决方案领导品牌，值得信赖！</p>
    </div>
    <ul class="content align-center-main clearfix">
      <li v-for="(item, index) in serviceList" :key="index" @click="goService(item.type,item.serviceId)">
        <div class="icon">
          <img :src="item.picUrl" alt="">
        </div>
        <h3>{{item.serviceName}}</h3>
        <h4>
          {{ item.content }}
        </h4>
      </li>
    </ul>
  </section>
  <section class="cooperation align-center-main">
    <div class="header">
      <h3>求购合作</h3>
      <span class="checkMore" @click="goService(1008)">查看更多</span>
    </div>
    <ul class="content">
      <router-link :to="{ path: `/navigator/bbs/cooperationDetails/${item.serviceId}` }" v-for="item in CooperationList" :key="item.serviceId">
        <List :msg="item"></List>
      </router-link>
      <!-- <li v-for="(item, index) in cooperation" :key="index" class="boxShadow">
        <img :src="item.banner" alt="">
        <div class="blurb textOver">
          <el-tooltip :content="item.serviceName" placement="top" effect="light">
            <h3 class="textOver">{{ item.serviceName }}</h3>
          </el-tooltip>
          <p>
            <span>发布时间：{{ item.createTime| DateFilter }}</span>
            <span>结束时间：{{ item.endTime | DateFilter }}</span>
          </p>
          <p>
            <span>目标单价：{{ item.price }}</span>
            <span>类型描述：{{ item.typeDesc }}</span>
          </p>
          <p>
            <span>送货地址或服务地点：{{item.provinceName}}{{item.cityName}}{{item.countyName}}{{ item.address }}</span>
          </p>
        </div>
      </li> -->
    </ul>
  </section>
  <section class="customer">
    <div class="title">
      <s>————</s>
      <h3>知名客户</h3>
      <s>————</s>
      <h4>以优质的产品和完善的服务，让我们赢得了众多知名客户！</h4>
    </div>
    <ul>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  </section>
  <!-- 遮罩层播放视频 -->
  <div class="mask" v-show="maskFlag">
    <div class="close">
      <span @click="maskFlag = false">X</span>
    </div>
    <div class="content">
      <video :src="videoUrl" loop controls>您的浏览器暂不支持播放该视频，请升级至最新版浏览器。</video>
    </div>
  </div>
  </div>
</template>


<script>
import { mapGetters } from 'vuex';
import List from '../navigator/bbs/components/List';

export default {
  data() {
    return {
      changTime: 5000,   // 轮播时间
      maskFlag: false,
      videoUrl: '',
      bannerList: [],   // 轮播数据
      noticeList: [],   // 通知数据
      activityList: [],    // 活动数据
      welfareList: [],   // 福利
      CooperationList: [],   // 合作
      serviceList: [],    // 八大服务
    }
  },
  methods: {
    goPath(routerPath) {
      this.$router.push({ path: routerPath });
    },
    goService(type, serviceId) {  // 跳转八大服务
      switch (serviceId) {
        case 1001:    // 物业服务
          this.$router.push({ path: '/navigator/property', query: { serviceId: serviceId } });
          break;
        case 1002:    // 商务服务
          this.$router.push({ path: '/navigator/businessPlatform', query: { serviceId: serviceId } });
          break;
        case 1003:    // 政务平台
          this.$router.push({ path: '/navigator/governmentAffairsPlatform', query: { serviceId: serviceId } });
          break;
        case 1004:    // 金融服务
          this.$router.push({ path: '/navigator/financePlatform', query: { serviceId: serviceId } });
          break;
        case 1005:    // 人力资源
          this.$router.push({ path: '/navigator/humanResource', query: { serviceId: serviceId } });
          break;
        case 1006:    //  园区配套
          this.$router.push({ path: '/navigator/parkCompleteSet', query: { serviceId: serviceId } });
          break;
        case 1007:     // 产品路演
          this.$router.push({ path: '/navigator/production', query: { serviceId: serviceId } });
          break;
        case 1008:     // 信息交互
          this.$router.push({ path: '/navigator/bbs', query: { serviceId: serviceId } });
          break;
        default:
          break;
      }
    },
    changeBanber(bannerIndex) {  // 暂停视频
      const videos = this.$el.querySelectorAll('#lunbo video');
      videos.forEach((val) => {
        val.pause();
      });
    },
    videoClick(src) {
      // 弹框播放视频
      // this.maskFlag = true;
      // this.videoUrl = src;
      this.$el.querySelector(`#video${src}`).play();  // 点击播放视频
    },
    getBanner() {  // 获取首页轮播和通知
      this.$http.post(`${this.URL_PREFIX}/app/get/park/banner/index`, {
        parkId: this.parkIdList[0],
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.bannerList = res.resData.bannerList;
          this.noticeList = res.resData.noticeList;
          // this.bannerList.forEach((val) => {
          //   val.flag = true;
          // });
          // console.log(this.bannerList);
        }
      });
    },
    getIndexMsg() {  // 获取首页活动
      this.$http.post(`${this.URL_PREFIX}/app/get/park/service/index`, {
        parkId: this.parkIdList[0],
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.activityList = res.resData.activityList;
          this.welfareList = res.resData.welfareList;
          this.CooperationList = res.resData.askList;
        }
      });
    },
    getService() {  // 获取八大服务
      this.$http.post(`${this.URL_PREFIX}/app/get/park/service/list`, {
        parkId: this.parkIdList[0],
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.serviceList = res.resData.pageList;
        }
      });
    },
  },
  mounted() {
    this.getBanner();
    this.getIndexMsg();
    this.getService();
  },
  computed: {
    ...mapGetters(['parkIdList', 'token']),
  },
  components: {
    List,
  }
}
</script>

<style lang="scss" scoped>
.style {
  background-color: #f5f5f5;
}
.mask {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 999;
  background-color: rgba(0,0,0,.8);
  .close {
    position: absolute;
    left: 5%;
    right: 5%;
    top: 80px;
    padding: 0 10px;
    font-size: 30px;
    cursor: pointer;
    background-color: #fff;
    border-radius: 4px;
    color: #000;
    font-weight: 900;
    text-align: right;
  }
  .content {
    position: relative;
    top: 100px;
    margin: 20px 5%;
    height: 500px;
    background-color: #fff;
    z-index: 1000;
    video {
      width: 100%;
      height: 98%;
      cursor: pointer;
    }
  }
}

// carousel start
.el-carousel__item img, .el-carousel__item video {
  width: 100%;
  height: 100%;
}
.el-carousel__item {
  background-color: #000;
  color: #000;
  video {
    cursor: pointer;
  }
}

// carousel end
section {
  .header {
    line-height: 40px;
    h3 {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 10px;
      display: inline-block;
    }
    .checkMore {
      float: right;
      font-style: 14px;
      cursor: pointer;
    }
  }
}
// notice start
.notice {
  height: 100px;
  display: flex;
  margin-top: 20px;
  margin-bottom: 50px;
  .aside {
    height: 100px;
    width: 220px;
    background-color: #fff;
    font-size: 24px;
    font-weight: 600;
    color: #e55358;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .content{
    flex: 1;
    // height: 300px;
    background-color: #fff;
    margin-left: 20px;
    padding-top: 20px;
    padding-bottom: 20px;
    overflow: hidden;
    li {
      display: flex;
      background-color: #fff;
      padding: 0 190px 0 50px;
      font-size: 16px;
      h4 {
        flex: 1;
        line-height: 30px;
        font-weight: 400;
        &:hover{
          cursor: pointer;
          text-decoration: underline;
        }
      }
      .noticeTime {
        font-size: 14px;
      }
    }
  }
}
// notice end

// activity start
.activity {
  min-height: 275px;
  .content {
    overflow: hidden;
    li {
      float: left;
      width: 285px;
      height: 275px;
      margin-right: 20px;
      background-color: #fff;
      .title {
        padding: 20px;
      }
      h4 {
        width: 100%;
        height: 56px;
        overflow: hidden;
        font-size: 20px;
        font-weight: 600;
        // margin-bottom: 10px;
        cursor: pointer;
      }
      .time {
        font-size: 14px;
        color: #666;
      }
      img {
        width: 100%;
        height: 160px;
        cursor: pointer;
        border-radius: 4px 4px 0 0;
      }
      &:last-of-type {
        margin-right: 0;
      }
    }
  }
}
// activity end

// welfare start
.welfare{
  margin-top: 40px;
  min-height: 126px;
  padding-bottom: 80px;
  .content {
    display: flex;
  }
  .box {
    flex: 1;
    display: flex;
    width: 100%;
    height: 126px;
    background-color: #fff;
    cursor: pointer;
    &:first-of-type{
      margin-right: 20px;
    }
    img {
      width: 168px;
      border-radius: 4px 0 0 4px;
    }
    .imgContent {
      flex: 1;
      padding-left: 20px;
      padding-top: 16px;
      h4 {
        font-size: 20px;
        font-weight: 600;
        color: #333;
        line-height: 30px;
      }
      .youhui {
        color: #de2c32;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 15px;
      }
      p {
        line-height: 18px;
        font-size: 12px;
      }
    }
  }
}
// welfare end

// service start
.serviceStyle {
  background-color: #fff;
  .header {
    text-align: center;
    padding-top: 80px;
    padding-bottom: 40px;
    h3 {
      font-size: 30px;
      line-height: 30px;
      font-weight: 600;
    }
  }
  .content {
    padding-bottom: 80px;
    li {
      box-sizing: border-box;
      background-color: #fbfbfb;
      width: 285px;
      float: left;
      height: 240px;
      border: 1px solid #ccc;
      padding: 0 12px;
      margin-right: 20px;
      margin-bottom: 20px;
      cursor: pointer;
      &:nth-child(4n) {
        margin-right: 0;
      }
      .icon{
        margin: 24px auto 15px;
        background-color: #fff;
        width: 76px;
        height: 76px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      h3 {
        font-size: 16px;
        font-weight: 600;
        text-align: center;
        border-bottom: 1px solid #ccc;
        padding-bottom: 12px;
      }
      h4 {
        height: 70px;
        padding-top: 10px;
        font-size: 12px;
        line-height: 20px;
        text-align: center;
      }
    }
  }
}
// service end

// cooperation start
.cooperation {
  height: 503px;
  padding-top: 50px;
  .content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
// cooperation end

// customer start
.customer {
  height: 222px;
  background-color: #050607;
  padding-top: 38px;
  text-align: center;
  .title{
    h3 {
      display: inline-block;
      padding: 0 20px;
      font-size: 20px;
      color: #fff;
    }
    s {
      color: #4e4f4f;
      font-size: 20px;
    }
    h4 {
      font-size: 16px;
      color: #fff;
      line-height: 40px;
    }
  }
  ul {
    width: 850px;
    margin: 0 auto;
    margin-top: 25px;
    li {
      width: 100px;
      height: 100px;
      float: left;
      border-radius: 50%;
      background-color: #fff;
      margin-right: 85px;
      background-image: url('../../static/image/u134.png');
      background-repeat: no-repeat;
      background-size: 100% 100%; 
      &:last-of-type{
        margin-right: 0;
      }
    }
  }
}
// customer end


</style>

