<template>
  <div class="property align-center-main">
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>物业服务平台</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    
    <ul class="nav clearfix">
      <li v-for="(item, index) in serviceList" :key="index" class="boxShadow" :class="{ 'Select': selectIndex === index }" @click="selectNav(item.serviceId, index)">
        <img :src="item.picUrl" alt="">
        <span class="textOver"> {{ item.serviceName }} </span>
      </li>
    </ul>
   
   <div class="content boxShadow" v-loading="loading">
      <div v-html="content" class="goodsContent" v-show="isText !== 2" ref="text"></div>
      <div class="myButton button" @click="booking" v-show="isText !== 2">预 约</div>
      <div class="form" v-show="isText === 2">
        <h3>{{ formInfo.formName }}</h3>
        <CustomForm :formObj="formInfo" @finishForm="submitForm" ref="customForm" v-if="isText === 2"></CustomForm>
      </div>
    </div>
    <SubmitSuccess v-if='submitSuccessFlag' @close='submitSuccessFlag = false;' class='submit-success' :tipsMsg="tipsMsg"></SubmitSuccess>

    <!-- 模态 -->
    <div class="modal" v-show='modalShow'>
      <div class="container">
        <div class="close" @click="closeModal">x</div>
        <h3>{{ formInfo.formName }}</h3>
        <div class="content">
          <CustomForm :formObj="formInfo" @finishForm="submitForm" ref="customForm" v-if="isText === 3"></CustomForm>
        </div>
      </div>
    </div>

    <!-- 弹窗登录 -->
    <MaskLogin v-show='showLogin' @close='showLogin = false'></MaskLogin>


  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { jsTimestampFilter } from '@/utils/filters.js';
import deepcopy from '@/utils/deepcopy';

export default {
  data(){
    return{
      serviceList:[],
      selectIndex: 0, // 控制红边框
      serviceId: 0,
      content: '', // 富文本内容
      formInfo: {},
      submitSuccessFlag: false,
      tipsMsg: '',
      loading: false,
      isText: 1,
      modalShow: false,
      showLogin: false,
      qiniuConfig: {},
    }
  },
  methods: {
    selectNav(serviceId, index) {  // 点击
      this.selectIndex = index;
      this.serviceId = serviceId;
      this.getInfo();
    },
    booking() {  // 预约
      if (!this.token) {
        this.showLogin = true;
        return false;
      }
      if (this.formInfo.formType === 3) {  // 富文本+表单
        this.modalShow = true;
      } else {
        // 直接预约接口
        this.submitForm();
      }
    },
    getServiceList() {  // 获取服务列表
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      });
      this.$http.post(`${this.URL_PREFIX}/app/get/park/service/list`, {
        parkId: this.parkIdList[0],
        parentId: 1001,
      }).then((response) => {
        const res = response.data;
        this.loading = false;
        if (res.resCode === '10000') {
          this.serviceList = res.resData.pageList ? res.resData.pageList : [];
          if (this.serviceList.length) {
            this.serviceId = this.serviceList[0].serviceId;
            this.getInfo();
          }
        }
      });
    },
    closeModal() {  // 关闭模态
      this.modalShow = false;
      this.$refs.customForm.resetForm();
    },
    getInfo() {  // 获取详情
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 5000);
      this.$http.post(`${this.URL_PREFIX}/app/get/park/service/form/tree`, {
        parkId: this.parkIdList[0],
        serviceId: this.serviceId,
      }, {
        headers: { token: this.token, },
      }).then((response) => {
        const res = response.data;
        this.loading = false;
        if (res.resCode === '10000') {
          this.content = res.resData.content;
          this.isText = res.resData.formType;  // 判断内容
          if (res.resData.formType !== 1) {
            this.formInfo = deepcopy(res.resData.formTreeDto);
            // 排除报错
            this.formInfo.itemList = this.formInfo.itemList ? this.formInfo.itemList : [];
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
    submitForm(content) {  // 提交表单
      const orderBody = {
        parkId: this.parkIdList[0],
        serviceId: this.serviceId,
      }
      if (this.isText !== 1) {
        orderBody.formId = this.formInfo.formId;
        orderBody.content = content;
      }
      this.$http.post(`${this.URL_PREFIX}/app/added/park/service/form/order`, orderBody,
      {
        headers: { token: this.token, },
      }).then((response) => {
        const res = response.data;
        this.submitSuccessFlag = true;
        if (res.resCode === '10000') {
          this.closeModal();
          this.tipsMsg = '订单提交成功！';
          if (res.resData.orderFee && res.resData.orderFee !== 0) {
            this.$router.push({ path: `/navigator/pay/paymentPage/${res.resData.orderId}` });
          }
        } else {
          this.tipsMsg = res.resDesc;
        }
      });
    },
  },
  mounted() {
    this.getServiceList();
  },
  computed: {
    ...mapGetters(['parkIdList', 'token']),
  },
  updated () {
    const imgs = this.$refs.text.querySelectorAll('img');
    const videos = this.$refs.text.querySelectorAll('video');
    imgs.forEach((val) => {
      val.style.maxWidth = '100%';
    });
  }
}
</script>

<style lang="scss" scoped>
@import "~@scss";

.property{
  padding-bottom: 18px;
}
// 导航条
.nav {
  margin-top: 20px;
  li {
    float: left;
    height: 86px;
    width: 284px;
    margin-right: 20px;
    margin-bottom: 20px;
    background-color: #fff;
    font-size: 24px;
    box-sizing: border-box;
    color: #333;
    border: 1px solid #fff;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 44px;
    &:nth-of-type(4n) {
      margin-right: 0;
    }
    &.Select{
      border-color: #d9262c;
    }
    img {
      width: 44px;
      height: 44px;
      margin-right: 20px;
    }
    span {
      display: inline-block;
      width: 180px;
    }
  }
}

// 富文本
.content {
  min-height: 200px;
  margin-top: 20px;
  margin-bottom: 20px;
  background-color: #fff;
  padding: 34px 40px 34px 0;
  .button {
    margin: 0 auto;
    margin-top: 30px;
  }
  .goodsContent {
	padding-left: 40px;
  }
  h3 {
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 20px;
  }
}
.submit-success{
  right: 30%;
  bottom: 50%;
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

