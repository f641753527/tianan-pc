<template>
  <div class="align-center-main">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/navigator/parkCompleteSet' }">园区配套平台</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/navigator/parkCompleteSet/foodCourt' }">园区美食街</el-breadcrumb-item>
      <el-breadcrumb-item>确认支付</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :model="bookingForm" :rules="bookingFormRules" ref="bookingForm" class="content boxShadow" size="small">
      <h3>个人信息/地址：</h3>
      <el-form-item prop="userName">
        <el-input v-model="bookingForm.userName" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item prop="userMobile">
        <el-input placeholder="请输入手机号" v-model="bookingForm.userMobile"></el-input>
      </el-form-item>
      <el-form-item prop="address">
        <el-input placeholder="请输入地址" v-model="bookingForm.address" type="textarea" :rows="2"></el-input>
      </el-form-item>
      <h3>附言：</h3>
      <el-form-item prop="remark">
        <el-input type="textarea" :rows="3" placeholder="请输入留言信息" v-model="bookingForm.remark"></el-input>
      </el-form-item>
      <div class="payMethod">
        <h3 class="in_b">支付方式：</h3>
        <span>
          <i class="iconfont icon-weixinzhifu"></i>
          微信支付</span>
      </div>
      <div>
        <h3 class="in_b">支付金额：</h3>
        <strong>{{ totalPrice / 100 | PriceFilter }} 元</strong>
      </div>
      <!-- <div class="myButton button" @click="submit('bookingForm')">立即支付</div> -->
      <el-button type="primary" @click="submit('bookingForm')" size="medium" class="button" :disabled="btnDisabled">立即支付</el-button>
    </el-form>

     <!-- 弹窗登录 -->
    <MaskLogin v-show='showLogin' @close='showLogin = false;'></MaskLogin>
    <!-- 消息弹框 -->
    <SubmitSuccess v-if='submitSuccessFlag' @close='submitSuccessFlag = false;' class='submit-success' :tipsMsg="tipsMsg"></SubmitSuccess>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { jsTimestampFilter } from '@/utils/filters.js';
import deepcopy from '@/utils/deepcopy';

export default {
  data() {
    const validateMobile = (rule, value, callback) => {
      if (!value) {
        return;
      }
      if (!/^1[3|4|5|7|8|9][0-9]\d{8}$/.test(value)) {
        callback(new Error('手机号错误!'));
      } else {
        callback();
      }
    };
    return {
      showLogin: false,
      submitSuccessFlag: false,
      btnDisabled: false,
      tipsMsg: '提交订单成功!',
      bookingForm: {
        userName: '',
        userMobile: '',
        address: '',
        remark: '',
      },
      goodsCart: [],
      bookingFormRules: {
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur，change' },
          { min: 2, message: '姓名长度至少为2', trigger: 'blur，change' }
        ],
        userMobile: [
          { required: true, message: '请输入手机号', trigger: 'blur，change' },
          { validator: validateMobile, trigger: 'blur，change' },
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur，change' },
        ],
      }
    }
  },
  methods: {
    submit(formName) {  // 提交验证
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.token) {
            this.submitOrder();
          } else {
            this.showLogin = true;
          }
        } else {
          return false;
        }
      });
    },
    submitOrder() {  // 提交表单
      this.btnDisabled = true;
      const orderList = deepcopy(this.goodsCart);
      const OrderBody = {
        parkId: this.parkIdList[0],
        userName: this.bookingForm.userName,
        userMobile: this.bookingForm.userMobile,
        address: this.bookingForm.address,
        num: this.totalNum,
        price: this.totalPrice,
        orderList: orderList,
      }
      if (this.bookingForm.remark !== '') {
        OrderBody.remark = this.bookingForm.remark;
      }
      // http
      this.$http.post(`${this.URL_PREFIX}/app/added/food/order`, OrderBody,
      {
        headers: { token: this.token, },
      })
      .then((response) => {
        const res = response.data;
        this.submitSuccessFlag = true;
        this.btnDisabled = true;
        if (res.resCode === '10000') {
          this.tipsMsg = '提交订单成功';
          setTimeout(() => {
            if (res.resData.bindSn) {  // 存在则说明多商家，使用bindSn
              this.$router.push({ path: `/navigator/pay/paymentPage/${res.resData.bindSn}` , query: { 'isBInd': 1 } });
            } else { // 不存在则说明一个商家，使用orderId
              this.$router.push({ path: `/navigator/pay/paymentPage/${res.resData.orderId[0]}`});
            }
          }, 1500);
          this.$store.commit('change_cart');  // 清空购物车
        } else {
          this.tipsMsg = res.resDesc;
        }
      });
    }
  },
  mounted() {
    if (this.shoppingCart.length === 0 || !this.token ) {
      this.$router.push({ path: '/navigator/parkCompleteSet/foodCourt', query: { serviceId: 1006 } });
    }
    this.shoppingCart.forEach((val1) => {  // 取购物车信息
      val1.goods.forEach((val2) => {
        this.goodsCart.push({
          foodId: val2.foodId,
          num: val2.num,
          price: val2.price,
        });
      });
    });
    this.bookingForm.userName = this.user.userNick ? this.user.userNick : '';
    this.bookingForm.userMobile = this.user.userMobile;
    this.bookingForm.address = (this.user.countyName ? this.user.countyName : '') + (this.user.details ? this.user.details : '');
  },
  computed: {
    ...mapGetters(['parkIdList', 'token', 'shoppingCart', 'user']),
    totalNum() {
      let sum = 0;
      this.goodsCart.forEach((val) => {
        sum += val.num;
      })
      return sum;
    },
    totalPrice() {
      let sum = 0;
      this.goodsCart.forEach((val) => {
        sum += val.price * val.num;
      });
      return sum;
    },
  },
}
</script>

<style lang="scss" scoped>
.el-breadcrumb {
  margin: 20px 0;
}

.in_b {
  display: inline-block;
}
.content {
  min-height: 546px;
  background-color: #fff;
  padding: 20px 320px 30px 40px;
  margin-bottom: 20px;
  .el-form-item {
    margin-bottom: 14px;
  }
  h3 {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 14px; 
  }
  .el-date-editor {
    width: 100%;
  }
  .el-checkbox-group {
    min-height: 10px;
  }
  .el-checkbox {
    width: 33.33%;
    margin-left: 0;
    // margin-bottom: 14px;
  }
  strong {
    font-size: 20px;
    color: #333;
  }
  .price {
    color: #d0011b;
    margin: 0 4px;
  }
  .payMethod {
    line-height: 38px;
    span {
      display: inline-block;
      box-sizing: border-box;
      width: 120px;
      height: 36px;
      border: 1px solid #d0011b;
      border-radius: 4px;
      text-align: center;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      color: #333;
      i {
        color: #359c3b;
      }
    }
  }
  .button {
    margin-left: 20px;
    margin-top: 10px;
  }
}

.submit-success {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
