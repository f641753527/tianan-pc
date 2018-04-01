<template>
  <div v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/navigator/businessPlatform', query: { serviceId : 1002 } }">商务服务平台</el-breadcrumb-item>
      <!-- <el-breadcrumb-item :to="{ path: `/navigator/businessPlatform/businessList`, query: { serviceId : 1002 } }">设备出租</el-breadcrumb-item> -->
      <el-breadcrumb-item>详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="header boxShadow">
      <img :src="categoryInfo.banner" alt="">
      <div class="title">
        <h3>{{ categoryInfo.title }}</h3>
        <div class="myButton" @click="booking" v-if="isText !== 2">预约</div>
      </div>
    </div>
    <div class="content boxShadow">
      <div v-html="categoryInfo.content" class="goodsContent" v-show="isText !== 2" ref="text"></div>
      <div class="form" v-show="isText === 2">
        <h3>{{ categoryForm.formName }}</h3>
        <CustomForm :formObj="categoryForm" @finishForm="submitForm" ref="customForm" v-if="isText === 2"></CustomForm>
      </div>
    </div>
    <SubmitSuccess v-if='submitSuccessFlag' @close='submitSuccessFlag = false;' class='submit-success' :tipsMsg="tipsMsg"></SubmitSuccess>

    <!-- 模态 -->
    <div class="modal" v-show='modalShow'>
      <div class="container">
        <div class="close" @click="closeModal">x</div>
        <h3>{{ categoryForm.formName }}</h3>
        <div class="content">
          <CustomForm v-if="isText === 3" :formObj="categoryForm" @finishForm="submitForm" ref="customForm"></CustomForm>
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
  data() {
    return {
      submitSuccessFlag: false,
      tipsMsg: '预约成功，请等待管理员与你联系。',
      categoryInfo: {},
      loading: false,
      isText: 1,
      categoryForm: {},
      form: [],
      modalShow: false,
      showLogin: false,
      qiniuConfig: {},
    }
  },
  mounted() {
    this.getInfo();
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
  methods: {
    booking() {  // 预约
      if (!this.token) {
        this.showLogin = true;
        return false;
      }
      if (this.categoryInfo.formType === 3) {  // 富文本+表单
        this.modalShow = true;
      } else {
        // 直接预约接口
        this.submitForm();
      }
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
      this.$http.post(`${this.URL_PREFIX}/app/get/facilities/rent/detail`, {
        parkId: this.parkIdList[0],
        serviceId: this.$route.query.serviceId,
        facilitiesId: this.$route.params.itemsId,
      }, {
        headers: { token: this.token, },
      }).then((response) => {
        const res = response.data;
        this.loading = false;
        if (res.resCode === '10000') {
          this.categoryInfo = res.resData;
          this.isText = res.resData.formType;  // 判断内容
          if (res.resData.formType !== 1) {
            this.categoryForm = deepcopy(res.resData.customForm);
            this.categoryForm.itemList = this.categoryForm.itemList ? this.categoryForm.itemList : [];   // 排除报错
            this.categoryForm.itemList.forEach((val) => {
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
        serviceId: this.$route.query.serviceId,
        bindingId: this.$route.params.itemsId, 
      }
      if (this.isText !== 1) {
        orderBody.formId = this.categoryInfo.formId;
        orderBody.content = content;
      }
      this.$http.post(`${this.URL_PREFIX}/app/added/park/service/form/order`, orderBody,
      {
        headers: { token: this.token, },
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.closeModal();
          if (res.resData.orderFee && res.resData.orderFee !== 0) {
            this.$router.push({ path: `/navigator/pay/paymentPage/${res.resData.orderId}` });
          }
          this.submitSuccessFlag = true;
          this.tipsMsg = '预约成功，请等待管理员与你联系！';
          if (res.resData.orderFee && res.resData.orderFee !== 0) {
            this.$router.push({ path: `/navigator/pay/paymentPage/${res.resData.orderId}` });
          }
        } else {
          this.tipsMsg = res.resDesc;
        }
      });
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss";

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
      margin-bottom: 40px;
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
// 富文本
.content {
  min-height: 200px;
  margin-top: 20px;
  margin-bottom: 20px;
  background-color: #fff;
  padding: 34px 40px 0;
 .goodsContent {
   padding-bottom: 34px;
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

