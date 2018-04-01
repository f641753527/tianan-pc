<template>
  <div v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/navigator/businessPlatform', query: { serviceId : 1002 } }">商务服务平台</el-breadcrumb-item>
      <!-- <el-breadcrumb-item :to="{ path: '/navigator/businessPlatform', query: { serviceId : 1002 } }">优选服务</el-breadcrumb-item> -->
      <el-breadcrumb-item>详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="goods boxShadow">
      <img :src="recommendedInfo.banner" alt="">
      <div class="introduce">
        <h3>{{ recommendedInfo.title }}</h3>
        <h4>{{ recommendedInfo.discountPrice }}  <span class="mark" v-if="recommendedInfo.discountMark === 1">折后价</span></h4>
        <p>原价：{{ recommendedInfo.originalPrice }}</p>
        <el-button type="primary" @click="showMask" size="medium" :disabled="btnDisabled">预订</el-button>
      </div>
    </div>
    <div class="content">
      <div class="left boxShadow">
        <img :src="recommendedInfo.couponImg" title="优惠券" class="couponImg">
        <h3>服务介绍</h3>
        <div class="text" v-html="recommendedInfo.content" ref="text"></div>
      </div>
      <div class="right">
        <div class="who boxShadow">
          <h3>谁在用</h3>
          <img :src="item" alt="" v-for="(item, index) in recommendedInfo.whoUsingList" :key="index">
        </div>
        <div class="customer boxShadow">
          <h3>客户说</h3>
          <div class="title clearfix">
            <img :src="recommendedInfo.customerLogo" alt="">
            <h4>{{ recommendedInfo.customerUser }}</h4>
            <p class="company">{{ recommendedInfo.customerName }}</p>
          </div>
          <p class="introduce">{{ recommendedInfo.customerDesc }}</p>
        </div>
        <div class="merchants boxShadow clearfix">
          <h3>服务提供商</h3>
          <img :src="recommendedInfo.sponsorLogo" alt="">
          <div class="introduce">
            <h4>{{ recommendedInfo.providerName }}</h4>
            <p>{{ recommendedInfo.sponsorLable }}</p>
            <p>{{ recommendedInfo.sponsorDesc }}</p>
          </div>
        </div>
      </div>
    </div>
    <SubmitSuccess v-if='submitSuccessFlag' @close='submitSuccessFlag = false;' class='submit-success' :tipsMsg="tipsMsg"></SubmitSuccess>
     <!-- 弹窗登录 -->
    <MaskLogin v-show='showLogin' @close='showLogin = false;'></MaskLogin>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      submitSuccessFlag: false,
      showLogin: false,
      btnDisabled: false,
      tipsMsg: '预约成功，请等待管理员与您联系!',
      recommendedInfo: {
        banner: '',   // 图片
      },
      loading: false,
    }
  },
  mounted () {
    this.getInfo();
  },
  methods: {
    showMask() {
      if (this.token) {
        this.submit();
      } else {
        this.showLogin = true;
      }
    },
    getInfo() {  // 获取优选服务详情
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 5000);
      this.$http.post(`${this.URL_PREFIX}/app/get/fine/service/info/detail`, {
        parkId: this.parkIdList[0],
        serviceId: this.$route.params.itemsId,
      }).then((response) => {
        const res = response.data;
        this.loading = false;
        if (res.resCode === '10000') {
          res.resData.whoUsingList = res.resData.whoUsing.split(',');
          this.recommendedInfo = res.resData;
        }
      });
    },
    submit() {  // 提交表单
      this.btnDisabled = true;
      this.$http.post(`${this.URL_PREFIX}/app/added/fine/service/order`, {
        parkId: this.parkIdList[0],
        serviceId: this.$route.params.itemsId,
      },{
        headers: { token: this.token, },
      }).then((response) => {
        const res = response.data;
        this.submitSuccessFlag = true;
        this.btnDisabled = false;
        this.tipsMsg = res.resDesc;
      });
    },
  },
  computed: {
    ...mapGetters(['parkIdList', 'token']),
  },
  updated() {
	const imgs = this.$refs.text.querySelectorAll('img');
  	imgs.forEach((val) => {
  	  val.style.maxWidth = '100%';
  	});
  },
}
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  margin: 20px 0;
}
.goods {
  height: 300px;
  background-color: #fff;
  display: flex;
  img {
    flex: 1;
    height: 300px;
    border-radius: 4px 0 0 4px;
  }
  .introduce {
    padding-top: 30px;
    padding-left: 30px;
    width: 634px;
    h3 {
      font-size: 30px;
      line-height: 30px;
    }
    h4 {
      color: #de2c32;
      font-size: 16px;
      margin-top: 20px;
    }
    .mark {
      margin-left: 20px;
      display: inline-block;
      padding: 2px 4px;
      border: 1px solid #de2c32;
      border-radius: 6px;
      font-size: 12px;
    }
    p {
      margin-top: 12px;
      margin-bottom: 30px;
      color: #666;
      font-size: 14px;      
    }
  }
}
.content {
  min-height: 500px;
  display: flex;
  margin-top: 20px;
  margin-bottom: 20px;
  .left {
    background-color: #fff;
    width: 710px;
    padding: 40px;
    overflow: hidden;
    .couponImg {
      width: 100%;
      height: 188px;
    }
    h3 {
      margin-top: 22px;
      margin-bottom: 10px;
      font-size: 18px;
      font-weight: 600;
    }
  }
  .right {
    width: 390px;
    margin-left: 20px;
    div {
      background-color: #fff;
    }
    h3 {
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    .who {
      height: 170px;
      margin-bottom: 20px;
      padding: 20px;
      overflow: hidden; 
      img {
        width: 60px;
        height: 60px;
        padding: 3px;
        border: 1px solid #ccc;
        border-radius: 50%;
        box-sizing: border-box;
        margin-right: 12px;
        margin-bottom: 12px;
        &:nth-of-type(5n) {
          margin-right: 0;
        }
      }
    }
    .customer {
      min-height: 188px;
      margin-bottom: 20px;
      padding: 20px;
      overflow: hidden; 
      .title {
        margin-bottom: 12px;
        img {
          width: 60px;
          height: 60px;
          padding: 3px;
          border: 1px solid #ccc;
          border-radius: 50%;
          box-sizing: border-box;
          margin-right: 12px;
          float: left;
        }
        h4 {
          font-size: 14px;
          font-weight: 600;
          color: #333;
        }
        p {
          font-size: 12px;
        }
        .company {
          color: #666;
          margin-top: 12px;
          line-height: 12px;
        }
        
      }
      .introduce {
        width: 350px;
        overflow: hidden; 
      }
    }
    .merchants {
      height: 118px;
      padding: 20px;
      img {
        width: 80px;
        height: 80px;
        border-radius: 5px;
        float: left;
        margin-right: 12px;
      }
      .introduce {
        height: 80px;
        width: 250px;
        float: left;
        h4 {
          font-size: 16px;
          font-weight: 600;
          color: #333;
          margin-bottom: 10px;
        }
        p {
          font-size: 12px;
          line-height: 20px;
          &:last-of-type {
            margin-top: 5px;
            color: #666;
          }
        }
      }
    }
  }
}
.submit-success{
  right: 30%;
  bottom: 50%;
}
</style>
