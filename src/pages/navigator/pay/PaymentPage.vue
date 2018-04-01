<template>
  <div>
    <div class="payBox boxShadow">
      <div class="header">
        <h3>账单提交成功，请尽快付款！</h3>
        <p class="time">支付剩余：{{ time }}，逾期支付，订单将自动取消。</p>
        <!-- <p class="address">预订场地：{{ payInfo.address }}</p>
        <p class="bookingdate">预订时段：{{ payInfo.bookingdate }}</p> -->
        <p>{{ payInfo.title }}</p>
        <div v-for="(item,index) in payInfo.orderServiceList" :key="index">
          <p>预订时段：{{ item.beginTime | DateFilter('yyyy-MM-dd hh:mm') }} - {{ item.endTime | DateFilter('yyyy-MM-dd hh:mm') }}</p>
        </div>
      </div>
      <div class="content">
        <h3>应付金额</h3>
        <strong>{{ payInfo.totalFee / 100 | PriceFilter }} 元</strong>
        <img width="246px" height="246px" :src="'data:image/jpg;base64,' + payInfo.codeUrl">
        <!-- <img :src="data:image/png;base64,{{payInfo.codeUrl}}"> -->
        <div class="tip">
          <i class="iconfont icon-saoyisao"></i>
          <p>请使用微信扫一扫</p>
          <p>扫描二维码支付</p>
        </div>
      </div>
    </div>
    <!-- <button @click="stopTime"> 停止</button> -->
    <!-- 消息弹框 -->
    <SubmitSuccess v-if='submitSuccessFlag' @close='submitSuccessFlag = false;' class='submit-success' :tipsMsg="tipsMsg"></SubmitSuccess>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      payInfo: {
        address: '深圳南山',
        bookingdate: '2018-03-17',
        codeUrl: '',
        payCloseTime: 0,
      },
      meetingRoom: {},
      loading: false,
      submitSuccessFlag: false,
      tipsMsg: '',
      startTime: new Date(),
      timeInterval: null,
      payStatusInterval: null,
    }
  },
  computed: {
    ...mapGetters(['parkIdList', 'token']),
    time() {
      var endTime = this.payInfo.payCloseTime;
      var t = endTime - this.startTime.getTime();

      var hour =  Math.floor(t / 1000 / 3600);
      var min = Math.floor(t / 1000 / 60);
      var sec = Math.floor(t / 1000 % 60);
      if (hour < 10) {
        hour = '0' + hour;
      }
      if (min < 10) {
        min = '0' + min;
      }
      if (sec < 10) {
        sec = '0' + sec;
      }
      // const countDownTime = hour + ':' + min + ':' + sec;
      const countDownTime = hour < 0 ? `${hour}时${min}分${sec}秒` : `${min}分${sec}秒`;
      return countDownTime;
    },
  },
  mounted() {
    this.getInfo();
    this.payStatusInterval = setInterval(() => {
      this.payStatus();
    }, 5000);
  },
  methods: {
    stopTime() {
      clearInterval(this.timeInterval);
      clearInterval(this.payStatusInterval);
      this.timeInterval = null;
    },
    getInfo() {  // 获取支付详情
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      });
      const orderBody = {
        paymentId: 1,
        wxTradeType: 1,
      }
      if (this.$route.query.isBInd) {
        orderBody.bindSN = this.$route.params.orderid;
      } else {
        orderBody.orderId = this.$route.params.orderid;
      }
      this.$http.post(`${this.URL_PREFIX}/app/pay/user/order/info`, orderBody, {
        headers: { token: this.token, },
      })
      .then((response) => {
        const res = response.data;
        this.loading = false;
        if (res.resCode === '10000') {
          this.payInfo = res.resData;
          console.log(this.payInfo);
          this.timeInterval = setInterval(() => {
            this.payInfo.payCloseTime -= 1000;
            if (this.payInfo.payCloseTime <= this.startTime.getTime()) {
              this.stopTime();
            }
          }, 1000);
        } else {
          this.submitSuccessFlag = true;
          this.tipsMsg = res.resDesc;
        }
      });
    },
    payStatus() {  // 获取支付状态
      const orderBody = {
        paymentId: 1,
        wxTradeType: 1,
      }
      if (this.$route.query.isBInd) {
        orderBody.bindSN = this.$route.params.orderid;
      } else {
        orderBody.orderId = this.$route.params.orderid;
      }
      this.$http.post(`${this.URL_PREFIX}/app/get/user/order/info/pay`, orderBody,
      {
        headers: { token: this.token, },
      })
      .then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          // this.payInfo = res.resData.pageList ? res.resData.pageList : [];
          this.$router.push({ path: '/navigator/pay/paySuccess' });
        } else if (res.resCode === '13801' || res.resCode === '13802' || res.resCode === '13803'){
          this.submitSuccessFlag = true;
          this.tipsMsg = res.resDesc;
          setTimeout(() => {
            this.$router.push({ path: '/index' });
          }, 5000);
        }
      });
    },
    // payInfo() {  // 获取支付状态
    //   const orderBody = {};
    //   if (this.$route.query.isBInd) {
    //     orderBody.bindSN = this.$route.params.orderid;
    //   } else {
    //     orderBody.orderId = this.$route.params.orderid;
    //   }
    //   this.$http.post(`${this.URL_PREFIX}/app/get/user/order/info/pay`, orderBody)
    //   .then((response) => {
    //     const res = response.data;
    //     console.log(res);
    //     if (res.resCode === '10000') {
    //       // this.payInfo = res.resData.pageList ? res.resData.pageList : [];
    //       // this.router.push({ path: '' })
    //     } else {
         
    //     }
    //   });
    // },
  },
  beforeDestroy() {
    this.stopTime();
  }
}
</script>


<style lang="scss" scoped>
@import "~@scss";

.payBox {
  margin: 20px 0;
  min-height: 646px;
  background-color: #fff;
  .header {
    padding: 30px 40px;
    height: 146px;
    border-bottom: 2px solid $color-red;
    h3 {
      font-size: 20px;
      font-weight: 600;
    }
    p {
      font-size: 20px;
      font-weight: 600;
      line-height: 1.5;
    }
    .time {
      margin: 10px 0;
      color: $color-red;
      font-size: 18px;
    }
  }
  .content {
    text-align: center;
    padding: 30px;
    h3 {
      font-size: 16px;
      color: #333;
    }
    >strong {
      display: block;
      font-size: 30px;
      color: $color-red;
      margin-top: 4px;
    }
    img {
      display: block;
      width: 246px;
      height: 246px;
      margin: 10px auto;
    }
    .tip {
      width: 204px;
      height: 46px;
      border: 1px solid $color-red;
      border-radius: 4px;
      margin: 20px auto;
      text-align: left;
      padding: 20px;
      .icon-saoyisao {
        font-size: 48px;
        float: left;
        margin-right: 10px;
        color: $color-red;
      }
      p {
        float: left;
        font-size: 18px;
        line-height: 26px;
        color: $color-red;
      }
    }
  }
}

.submit-success {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
