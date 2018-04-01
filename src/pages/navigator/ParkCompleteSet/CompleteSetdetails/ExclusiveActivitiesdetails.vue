<template>
  <div class="exclusiveActivitiesdetails align-center-main">
    <div class="header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/navigator/parkCompleteSet' }">园区配套平台</el-breadcrumb-item>
        <el-breadcrumb-item>园区专项活动详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="m_t20">
      <div class="box2 boxShadow">
        <img :src="welfareDetails.banner" alt="" class="in_b b_img">
        <div class="content">
          <h3 class="m_t40 titel"> {{welfareDetails.title}}</h3>
          <p class="youhui m_t20"> 园区用户专享：{{welfareDetails.discountLimit}}</p>
          <p class="m_t20 "> 福利来自：{{welfareDetails.providerName}}</p>
          <p class=" "> 发放数量：{{welfareDetails.showNum}}</p>
          <p class=" "> 有效期限：{{welfareDetails.beginTime | DateFilter}} 至 {{welfareDetails.endTime | DateFilter}}</p>
          <div class="BMbtn m_t20" @click="signUp">领 取</div>
          <SubmitSuccess v-if='submitSuccessFlag' @close='submitSuccessFlag = false;' class='submit-success' :tipsMsg='tips.tipsMsg'></SubmitSuccess>
        </div>
      </div>
      <div class="m_t20 boxShadow article">
        <p class="til">产品介绍</p>
        <div v-html="welfareDetails.content" ref="text"></div>
      </div>
    </div>
    <MaskLogin v-show='showLogin' @close='showLogin = false;'></MaskLogin>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return{
      submitSuccessFlag: false,
      showLogin: false,
      tips: {
        tipsMsg: '领取成功！',
      },
      welfareDetails:{},
    }
  },
  methods:{
    signUp() {
      if (this.token) {
        this.receive();
      } else {
        this.showLogin = true;
      }
    },
    receive() {
      this.$http.post(`${this.URL_PREFIX}/app/added/welfare/order`, {
        parkId: this.parkIdList[0],
        welfareId: this.$route.params.exclusiveActivitiesdetailsId,
      }, {
        headers: { token: this.token, },
      }).then((res) => {
        if(res.data.resCode === '10000') {
          this.submitSuccessFlag = true;
        } else {
          this.tips.tipsMsg = res.data.resDesc;
          this.submitSuccessFlag = true;
        }
      });
    },
    exclusiveDetails() {
      this.$http.post(`${this.URL_PREFIX}/app/get/welfare/info/detail`,{
        welfareId: this.$route.params.exclusiveActivitiesdetailsId,
        parkId: this.parkIdList[0],
      }).then((res) =>{
        if (res.data.resCode === '10000') {
          this.welfareDetails = res.data.resData;
        }
      });
    },
    updated() {
      const imgs = this.$refs.text.querySelectorAll('img');
      imgs.forEach((val) => {
        val.style.maxWidth = '100%';
      });
    },
  },
  created() {
    this.exclusiveDetails();
    this.$root.eventHub.$on('clearToken', (errMsg) => {
      this.$store.commit('change_token', '');
      this.showLogin = true;
      this.$message({
        message: errMsg,
        type: 'error',
        showClose: true,
      });
    });
  },
  computed: {
    ...mapGetters(['parkIdList', 'token']),
  },
}
</script>
<style lang="scss" scoped>
.exclusiveActivitiesdetails{
  padding-bottom: 18px;
}
.box2{
  height: 300px;
  display: flex;
  margin-bottom: 20px;
  background-color: #fff;
}
.b_img{
  width: 535px;
  height: 300px;
}
.content{
  flex: 1;
  box-sizing: border-box;
  padding: 0 0 0 40px;
  p{
    color: #666;
  }
  .youhui{
    color: #d12c32;
    font-size: 16px;
    font-weight: bold;
  }
  .submit-success{
    width: 196px;
    height: 110px;
    right: 40%;
    bottom: 40%;
    text-align: center;
  }
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
.article{
  box-sizing: border-box;
  padding: 40px;
  background-color: #fff;
  .til{
    font-size: 18px;
    font-weight: bold;
  }
}
.m_l40{
  margin-left: 40px;
}
.m_l20{
  margin-left: 20px;
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
}
.in_b{
  display: inline-block;
}
</style>
