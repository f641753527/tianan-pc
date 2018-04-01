<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: `/navigator/financePlatform/`, query: { serviceId : 1004 } }">金融服务平台</el-breadcrumb-item>
      <el-breadcrumb-item>详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="header boxShadow" v-loading="loading">
      <div class="imgStyle">
        <img :src="financeInfo.picUrl" alt="">
      </div>
      <div class="title">
        <h3>{{ financeInfo.serviceName }}</h3>
        <div class="myButton" @click="booking" v-if="isText !== 2">申请服务</div>
      </div>
    </div>
    <div class="content boxShadow" v-loading="loading">
      <div v-html="financeInfo.content" class="goodsContent"></div>
      <div class="form" v-if="isText === 2">
        <h3>{{ formInfo.formName }}</h3>
        <CustomForm :formObj="formInfo" @finishForm="submitForm" ref="customForm" v-if="isText === 2"></CustomForm>
      </div>
    </div>

   
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
    <!-- 消息弹框 -->
    <SubmitSuccess v-if='submitSuccessFlag' @close='submitSuccessFlag = false' class='submit-success' :tipsMsg="tipsMsg"></SubmitSuccess>

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
      showLogin: false,
      tipsMsg: '预约成功，请等待管理员与你联系！',
      financeInfo: {},
      loading: false,
      isText: 1,
      formInfo: {},
      form: [],
      modalShow: false,
    }
  },
  updated() {
	  const imgs = this.$el.querySelectorAll('.goodsContent img');
    imgs.forEach((val) => {
      val.style.maxWidth = '100%';
    });
  },
  computed: {
    ...mapGetters(['parkIdList', 'token']),
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    booking() {  // 预约
      if (!this.token) {
        this.showLogin = true;
        return false;
      }
      if (this.financeInfo.formType === 3) {  // 富文本+表单
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
      this.$http.post(`${this.URL_PREFIX}/app/get/park/service/form/tree`, {
        parkId: this.parkIdList[0],
        serviceId: this.$route.params.goodsId,
      }, {
        headers: { token: this.token, },
      }).then((response) => {
        const res = response.data;
        this.loading = false;
        if (res.resCode === '10000') {
          this.financeInfo = res.resData;
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
        serviceId: this.$route.params.goodsId,
      }
      if (this.isText !== 1) {
        formId: this.formInfo.formId,
        orderBody.content = content;
      }
      this.$http.post(`${this.URL_PREFIX}/app/added/park/service/form/order`, orderBody,
      {
        headers: { token: this.token, },
      }).then((response) => {
        const res = response.data;
        this.submitSuccessFlag = true;
        if (res.resCode === '10000') {
          // console.log(res);
          if (this.financeInfo.formType === 3) {
            this.closeModal();
          }
          if (res.resData.orderFee && res.resData.orderFee !== 0) {
            this.$router.push({ path: `/navigator/pay/paymentPage/${res.resData.orderId}` });
          }
          this.tipsMsg = '预约成功，请等待管理员与你联系！';
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
  .imgStyle {
    width: 534px;
    border-radius: 4px 0 0 4px;
    img {
      width: 100%;
      height: 100%;
    }
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

.submit-success {
  left: 50%;
  bottom: 50%;
  transform: translate(-50%, 50%);
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

