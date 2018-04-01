<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/navigator/businessPlatform' }">商务服务平台</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: `/navigator/businessPlatform/meetingRoomDetail/${$route.params.serviceId}/${$route.query.id}`, query: { serviceId : 1002 } }">会议室详情</el-breadcrumb-item>
      <el-breadcrumb-item>确认支付</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :model="bookingForm" :rules="bookingFormRules" ref="bookingForm" class="content boxShadow" size="small">
      <h3>预定日期：</h3>
      <el-form-item prop="bookingDate">
        <el-date-picker size="small"
          v-model="bookingForm.bookingDate"
          type="date"
          value-format="yyyy-MM-dd"
          @blur="getList()"
          placeholder="请选择预订日期">
        </el-date-picker>
      </el-form-item>
      <h3>预定时段：</h3>
      <el-form-item prop="checkList">
        <el-checkbox-group v-model="bookingForm.checkList">
          <el-checkbox :label="item.schedulingId" v-for="(item, index) in checkListArr" :key="index" :disabled="item.disabled">{{ item.time }} <span class="price">{{ item.price / 100 | PriceFilter }} 元</span> {{ item.status }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <h3>个人信息/地址：</h3>
      <el-form-item prop="userName">
        <el-input v-model="bookingForm.userName" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item prop="userMobile">
        <el-input placeholder="请输入手机号" v-model="bookingForm.userMobile"></el-input>
      </el-form-item>
      <!-- <el-form-item prop="address">
        <el-input placeholder="请输入地址" v-model="bookingForm.address"></el-input>
      </el-form-item> -->
      <el-form-item prop="remark">
        <el-input type="textarea" :rows="2" placeholder="请输入备注" v-model="bookingForm.remark"></el-input>
      </el-form-item>
      <div class="payMethod">
        <h3 class="in_b">支付方式：</h3>
        <span>
          <i class="iconfont icon-weixinzhifu"></i>
          微信支付</span>
      </div>
      <div>
        <h3 class="in_b">支付金额：</h3>
        <strong>{{ roomFee / 100 | PriceFilter }} 元</strong>
      </div>
      <div class="myButton button" @click="submit('bookingForm')">立即支付</div>
    </el-form>

     <!-- 弹窗登录 -->
    <MaskLogin v-show='showLogin' @close='showLogin = false;'></MaskLogin>
    <!-- 消息弹框 -->
    <SubmitSuccess v-if='submitSuccessFlag' @close='submitSuccessFlag = false;' class='submit-success' :tipsMsg="tipsMsg"></SubmitSuccess>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { jsTimestampFilter } from '@/utils/filters.js'

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
      checkListArr: [],
      showLogin: false,
      submitSuccessFlag: false,
      tipsMsg: '',
      bookingForm: {
        bookingDate: new Date(),
        checkList: [],
        userName: '',
        userMobile: '',
        // address: '',
        remark: '',
      },
      bookingFormRules: {
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur, change' },
        ],
        userMobile: [
          { required: true, message: '请输入手机号', trigger: 'blur, change' },
          { validator: validateMobile, trigger: 'blur, change' },
        ],
        // address: [
        //   { required: true, message: '请输入地址', trigger: 'blur, change' },
        // ],
        bookingDate: [
          { required: true, message: '请选择预订日期', trigger: 'change' },
        ],
        checkList: [
          { type: 'array', required: true, message: '请至少选择一个预订时段', trigger: 'change' },
        ],
      }
    }
  },
  methods: {
    getList() {  // 获取排班列表
      this.$http.post(`${this.URL_PREFIX}/app/get/meeting/room/scheduling/list`, {
        parkId: this.parkIdList[0],
        roomId: this.$route.query.id,
        date: this.bookingForm.bookingDate,
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          const BookingTimeList = [];
          if (JSON.stringify(res.resData) == '{}'){ 
            res.resData = [];
          }
          res.resData.forEach((val) => {
            // 时间戳转换yyyy-MM-dd hh:mm格式
            let beginTime = jsTimestampFilter(val.beginTime, 'yyyy-MM-dd hh:mm');
            let endTime = jsTimestampFilter(val.endTime, 'yyyy-MM-dd hh:mm');
             // 切割后面的时间段
            beginTime = beginTime.split(' ')[1];
            endTime = endTime.split(' ')[1];
            BookingTimeList.push({
              time: `${beginTime}-${endTime}`,
              price: val.roomFee,
              schedulingId: val.schedulingId,
              disabled: val.orderId === undefined ? false : true,
              status: val.orderId === undefined ? '' : '被预定',
            })
          });
          this.checkListArr = BookingTimeList;
        }
      });
    },
    changeBookingDate() {  // 更改时间重新获取排班时间
      this.getList();
    },
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
      let orderList = [];
      switch (this.bookingForm.checkList.length) {
        case 1:
          const obj = this.checkListArr.find((val) => {
            return val.schedulingId === this.bookingForm.checkList[0];
          })
          orderList.push({
            roomFee: obj.price,
            roomId: this.$route.query.id,
            schedulingId: obj.schedulingId,
          })
        break;
        default:
          this.checkListArr.forEach((val) => {
            this.bookingForm.checkList.forEach((val2) => {
              if (val.schedulingId === val2) {
                orderList.push({
                  roomFee: val.price,
                  roomId: this.$route.query.id,
                  schedulingId: val2,
                });
              }
            });
          });
        break;
      }
      this.$http.post(`${this.URL_PREFIX}/app/added/meeting/room/order`, {
        parkId: this.parkIdList[0],
        userName: this.bookingForm.userName,
        userMobile: this.bookingForm.userMobile,
        serviceId: this.$route.params.serviceId,
        // address: this.bookingForm.address,
        remark: this.bookingForm.remark,
        roomFee: this.roomFee,
        orderList: orderList,
      },{
        headers: { token: this.token, },
      }).then((response) => {
        const res = response.data;
        this.submitSuccessFlag = true;
        if (res.resCode === '10000') {
          this.tipsMsg = '预约成功！';
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
    this.bookingForm.bookingDate = jsTimestampFilter(this.bookingForm.bookingDate.getTime());  // 日期转换yyyy-MM-dd格式
    // this.bookingForm.bookingDate = '2018-03-17';
    this.getList();
    this.bookingForm.userName = this.user.userNick ? this.user.userNick : '';
    this.bookingForm.userMobile = this.user.userMobile;
  },
  computed: {
    ...mapGetters(['parkIdList', 'token', 'user']),
    roomFee() {
      let sum = 0;
      switch (this.bookingForm.checkList.length) {
        case 0:
          return sum;
        case 1:
          const obj = this.checkListArr.find((val) => {
            return val.schedulingId === this.bookingForm.checkList[0];
          })
          return obj.price;
        default:
          this.checkListArr.forEach((val) => {
            this.bookingForm.checkList.forEach((val2) => {
              if (val.schedulingId === val2) {
                sum += val.price;
              }
            })
          });
        return sum;
      }
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
