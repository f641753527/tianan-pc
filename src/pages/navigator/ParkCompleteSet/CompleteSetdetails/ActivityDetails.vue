<template>
  <div class="activityDetails align-center-main">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/navigator/parkCompleteSet' }">园区配套平台</el-breadcrumb-item>
        <el-breadcrumb-item>园区活动详情</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="m_t20">
        <div class="box2 boxShadow">
          <img :src="textList.banner" alt="" class="in_b b_img" >
          <div class="content">
            <h3 class="m_t40 titel textOver"> {{textList.title}}</h3>
            <p class="jiage m_t20"> 价格：{{textList.price}}元</p>
            <p class="m_t20 in_b"> <i class="iconfont  icon-shijian"></i> {{textList.beginTime | DateFilter}} 至 {{textList.endTime | DateFilter}}</p>
            <p class="m_t20 in_b m_l40 address"> <i class="iconfont  icon-dizhi"></i> {{textList.cityName}}{{textList.countyName}}{{textList.address}}</p>
            <p class="m_t10"> <i class="iconfont  icon-renshu"></i> {{textList.showNum}} 人</p>
            <div class="BMbtn m_t20" @click="signUp(textList.activityId)" v-if="formType === 1 || formType === 2 && textList.content.length !== 0">报 名</div>
            <SubmitSuccess v-if='submitSuccessFlag' @close='submitSuccessFlag = false;' class='submit-success' :tipsMsg='tips.tipsMsg'></SubmitSuccess>
          </div>
        </div>
        <div class="m_t20 article in_b ">
          <div v-html="textList.content" ref="text"></div>
          <div>
            <CustomForm :formObj="formInfo" @finishForm="submitForm" ref="customForm" v-if="formType === 2 && textList.content.length === 0"></CustomForm>
          </div>
        </div>
        <div class="m_t20 organizers in_b m_l20 boxShadow">
          <p class="til">主办方</p>
          <div class="m_t20">
            <img :src="textList.sponsorLogo" alt="" class="in_b zblogo">
            <div class="in_b zbrig">
              <p class="zbmingcheng">{{textList.sponsorName}}</p>
              <p class="zbzhongz">{{textList.sponsorDesc}}</p>
            </div>
          </div>
        </div>
        <!-- <div class="footbar in_b">
          <span class="cursor"><i class="iconfont icon-fenxiang"></i> 分享</span>
        </div> -->
      </div>
      <MaskLogin v-show='showLogin' @close='showLogin = false;'></MaskLogin>


    <!-- 模态 -->
    <div class="modal" v-show='modalShow'>
      <div class="container">
        <div class="close" @click="closeModal">x</div>
        <!-- <h3>{{ formInfo.formName }}</h3> -->
        <div class="content">
          <CustomForm :formObj="formInfo" @finishForm="submitForm" ref="customForm" v-if="formType === 2 && textList.content.length !== 0"></CustomForm>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { jsTimestampFilter } from '@/utils/filters.js';
import deepcopy from '@/utils/deepcopy';

export default {
  data() {
    return{
      submitSuccessFlag: false,
      showLogin: false,
      tips: {
        tipsMsg: '报名成功！等待企业与您联系。',
      },
      textList: {},
      formType: 0,
      formInfo: {},
      modalShow: false,
    }
  },
  methods:{
    // 报名
    signUp(id) {
      // if (this.token) {
      //   this.$router.push({ path: `/navigator/activityform/${id}` });  // 需要注释
      //   if (this.formType === 2) {
      //     this.$route.push({ path: `/navigator/activityform/${id}` });
      //   }else if(this.formType === 1) {
      //     this.submit();
      //   }
      // } else {
      //   this.showLogin = true;
      // }
      if (!this.token) {
        this.showLogin = true;
        return false;
      }
      if (this.formType === 2 && this.textList.content.length !== 0) {  // 富文本+表单
        this.modalShow = true;
      } else {
        // 直接预约接口
        this.submitForm();
      }
    },
    // 获取详情
    activityDetail() {
      this.$http.post(`${this.URL_PREFIX}/app/get/activity/info/detail`,{
        activityId: this.$route.params.activityId,
        parkId: this.parkIdList[0],
      }, {
        headers: { token: this.token, },
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.textList = res.resData;
          console.log(res);
          this.formType = res.resData.formFlag;
          if (res.resData.formFlag === 2) {  // 如果不是纯文本
            this.formInfo.itemList = res.resData.formItemList.length ? deepcopy(res.resData.formItemList) : [];
            this.formInfo.itemList.forEach((val) => {
              val.options = val.options ? val.options.split(',') : [];
              val.validate = false;
              if (val.type === 4) {
                val.defaultValue = jsTimestampFilter(new Date().getTime());
              } else if(val.type === 6) {
                val.defaultValue = [];
              }
            })
          }
        }
      });
    },
    closeModal() {  // 关闭模态
      this.modalShow = false;
      this.$refs.customForm.resetForm();
    },
    submitForm(content) {  // 提交
      const orderBody = {
        parkId: this.parkIdList[0],
        activityId: this.$route.params.activityId,
      }
      if (this.formType === 2) {
        orderBody.content = content;
      }
       this.$http.post(`${this.URL_PREFIX}/app/added/activity/order`,orderBody, {
        headers: { token: this.token, }
      })
       .then((response) => {
        const res = response.data;
        this.submitSuccessFlag = true;
        if(res.resCode === '10000') {
          this.closeModal();
          this.tips.tipsMsg = '报名成功！等待企业与您联系。';
          if (res.resData.orderFee && res.resData.orderFee !== 0) {
            this.$router.push({ path: `/navigator/pay/paymentPage/${res.resData.orderId}` });
          }
        }else{
          this.tips.tipsMsg = res.resDesc;
        }
      });
    },
  },
  mounted() {
    this.activityDetail();
  },
  updated() {
    const imgs = this.$refs.text.querySelectorAll('img');
    imgs.forEach((val) => {
      val.style.maxWidth = '100%';
    });
  },
  computed: {
    ...mapGetters(['parkIdList', 'token']),
  },
}
</script>
<style lang="scss" scoped>
@import "~@scss";

.activityDetails{
  padding-bottom: 18px;
  background-color: #f6f6f6;
}
.box2{
  height: 300px;
  display: flex;
  margin-bottom: 20px;
  background-color: #fff;
  .address{
    width: 360px;
    text-align: left;
  }
}
.b_img{
  width: 535px;
  height: 100%;
  border-radius: 4px 0 0 4px;
}
.content{
  flex: 1;
  box-sizing: border-box;
  padding: 0 0 0 40px;
  p{
    vertical-align: middle;
    height: 26px;
    line-height: 26px;
  }
  .submit-success{
    right: 40%;
    bottom: 40%;
  }
}
.iconfont{
  color: #999;
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
  width: 615px;
}
.in_b{
  display: inline-block;
}
.jiage{
  color:#de2c32;
  font-size: 16px;
}
.article{
  width: 788px;
  min-height: 200px;
  box-sizing: border-box;
  padding: 40px 40px 30px 40px;
  background-color: #fff;
  vertical-align: top;
  .til{
    font-size: 18px;
    font-weight: bold;
  }
}
.footbar{
  width: 788px;
  height: 60px;
  color: #999;
  border-top: 1px solid #f5f5f5;
  background-color: #fff;
  box-sizing: border-box;
  padding: 19px 40px;
  .cursor{
    cursor: pointer;
  }
}
.organizers{
  padding: 20px;
  width: 388px;
  height: 140px;
  background-color: #fff;
  box-sizing: border-box;
  .til{
    vertical-align: middle;
    font-size: 18px;
    font-weight: bold;
    height: 18px;
    line-height: 18px;
  }
  .zblogo{
    vertical-align: middle;
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
  .zbrig{
    vertical-align: middle;
    margin-left: 10px;
    width: 270px;
  }
  .zbmingcheng{
    font-size: 14px;
    font-weight: bold;
    width: 270px;
  }
  .zbzhongz{
    font-size: 12px;
    color: #666;
    width: 270px;
  }
}


// tag模态
.modal {
  @include modify_info;
  h3 {
    text-align: center;
    font-size: 20px;
    font-weight: 600;
  }
  .content {
    height: 80%;
    overflow: auto;
  }
}
</style>

