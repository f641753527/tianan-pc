<template>
  <div class="orderDetails">
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/navigator/personal/info/orders' }">订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="content">
      <div class="odertitel">订单信息</div>
      <div class="oderservice m_t34">
        <div class=""><span class="serviceclass">{{orderInfo.ordertitle}}</span><span class="odernum m_l16">订单编号: {{orderInfo.orderId}}</span></div>
        <div class="ajie_table m_t10">
          <el-table :data="tableData" border align="center">
            <el-table-column label="下单时间" width="178px" align="center">
              <template slot-scope="scope">
                <div>
                  {{scope.row.createTime | DateFilter}}
                </div>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="" label="预计费用" width="110px" align="center">
              <template slot-scope="scope">
                {{scope.row.orderFee / 100 | PriceFilter}}
              </template>
            </el-table-column> -->
            <el-table-column label="支付金额" width="110px" align="center" >
              <template slot-scope="scope">
                {{scope.row.orderFee / 100 | PriceFilter}}
              </template>
            </el-table-column>
            <el-table-column label="核准金额" width="110px" align="center">
              <template slot-scope="scope">
                {{scope.row.approvalFee / 100 | PriceFilter}}
              </template>
            </el-table-column>
            <el-table-column label="支付方式" width="110px" align="center">
              <template slot-scope="scope">
                <p>
                  {{scope.row.payType | payType}}
                </p>
              </template>
            </el-table-column>
            <el-table-column label="支付时间" width="180px" align="center">
              <template slot-scope="scope">
                <div>
                  {{scope.row.payTime | DateFilter}}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="payLogId" label="支付单号" align="center">
            </el-table-column>
            <el-table-column label="订单状态" width="120px" align="center">
              <template slot-scope="scope">
                <p>
                  {{scope.row.orderStatus | status}}
                </p>
              </template>
            </el-table-column>
          </el-table>
          <div class="pay clearfix">
             <el-button class="fr m_l16" @click="cancalOder" size="medium" :disabled="cancalBtn" type="danger">取消订单</el-button>
              <el-button class="fr" @click="jumpPay" size="medium" :disabled="payBtn" type="danger">支 付</el-button>
            <!-- <div class="payred fr m_l16" @click="cancalOder">取消订单</div>
            <div class="payred fr" @click="pay()">支 付</div> -->
          </div>
        </div>
        <SubmitSuccess v-if='submitSuccessFlag' @close='submitSuccessFlag = false;' class='submit-success' :tipsMsg='tips.tipsMsg'></SubmitSuccess>
      </div>
      <div class="odertitel">订单详情 ({{orderInfo.ordertitle}})</div>
      <div class="orderDetailbox">
        <!-- 设备出租 -->
        <!-- <OfficeDemo :info="orderDetails" v-if="orderInfo.orderType === 12" ></OfficeDemo> -->
        <!-- 园区活动 -->
        <ParkactivityDetails :info="orderDetails" v-if="orderInfo.orderType === 13"></ParkactivityDetails>
        <!-- 专享福利 -->
        <ParkexclusiveActivities :info="orderDetails" v-else-if="orderInfo.orderType === 14"></ParkexclusiveActivities>
        <!-- 找工作 -->
        <JobDemo v-else-if="orderInfo.orderType === 4" :info="orderDetails"></JobDemo>
        <!-- 产品路演 -->
        <ProductionDemo v-else-if="orderInfo.orderType === 7" :info="orderDetails"></ProductionDemo>
        <!-- 优选服务 -->
        <RecommendedDemo v-else-if="orderInfo.orderType === 11" :info="orderDetails"></RecommendedDemo>
        <!-- 金融服务 -->
        <!-- <FinanceDemo v-else-if="orderInfo.orderType === " :info="orderDetails"></FinanceDemo> -->
        <!-- 培训 -->
        <TrainingDemo v-else-if="orderInfo.orderType === 6" :info="orderDetails"></TrainingDemo>
        <!-- 服务外包 -->
        <ServiceDemo v-else-if="orderInfo.orderType === 5" :info="orderDetails"></ServiceDemo>
        <!-- 自定义 -->
        <CustomDemo v-else-if="orderInfo.orderType === 3 || orderInfo.orderType === 10 || orderInfo.orderType === 16"
        :info="orderDetails"></CustomDemo>
        <!-- 求购合作 -->
        <CooperationDemo v-else-if="orderInfo.orderType === 8" :info="orderDetails"></CooperationDemo>
        <!-- 美食街 -->
        <FoodDemo v-else-if="orderInfo.orderType === 9" :info="orderDetails"></FoodDemo>
        <!-- 会议室 -->
        <MeetingRoomDemo v-else-if="orderInfo.orderType === 12" :info="orderDetails"></MeetingRoomDemo>
      </div>
      <div class="odertitel">个人信息</div>
      <div class="personalinfo">
        <p>联系人：<span>{{userinfo.name}}</span></p>
        <p>职位：<span>{{userinfo.position}}</span></p>
        <p>联系电话：<span>{{userinfo.phone}}</span></p>
        <p>公司名称：<span>{{userinfo.corp}}</span></p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import OfficeDemo from '@/components/orderDetails/OfficeDemo';
import ParkactivityDetails from '@/components/orderDetails/ParkactivityDetails';
import ParkexclusiveActivities from '@/components/orderDetails/ParkexclusiveActivities';
import JobDemo from '@/components/orderDetails/JobDemo';
import ProductionDemo from '@/components/orderDetails/ProductionDemo';
import RecommendedDemo from '@/components/orderDetails/RecommendedDemo';
// import FinanceDemo from '@/components/orderDetails/FinanceDemo';
import CustomDemo from '@/components/orderDetails/CustomDemo';
import ServiceDemo from '@/components/orderDetails/ServiceDemo';
import TrainingDemo from '@/components/orderDetails/TrainingDemo';
import CooperationDemo from '@/components/orderDetails/CooperationDemo';
import FoodDemo from '@/components/orderDetails/FoodDemo';
import MeetingRoomDemo from '@/components/orderDetails/MeetingRoomDemo';

export default {
  data() {
    return{
      url: '', // 动态url
      submitSuccessFlag: false, // 弹窗
      tips: {   // 弹窗信息
        tipsMsg: '取消订单成功！',
      },
      cancalBtn: true, // 取消按钮的禁用
      payBtn: true, // 支付按钮的禁用
      // 订单信息列表
      tableData:[],
      // 订单信息
      detailsInfo: {createTime: '', payType: '', orderFee: '', approvalFee: '', payTime: '', payLogId: '', orderStatus: ''}, 
      // 用户信息
      userinfo: { 
        name: '',
        position: '',
        phone: '',
        corp: '',
      },
      // 订单详情
      orderDetails: {},
      // 详情信息
      orderInfo: { 
        orderId: '',
        orderType: 0,
        ordertitle: '',
      },
    }
  },
  methods: {
    // 接口
    getdetails() {
      this.$http.post(`${this.URL_PREFIX}${this.url}`, {
        orderId: this.$route.query.orderId,
      },{
        headers: { token: this.token },
      }).then((res) => {
        if(res.data.resCode === '10000') {
          this.tableData = [];
          this.orderInfo.ordertitle =  res.data.resData.title; // 服务名称
          this.detailsInfo.createTime = res.data.resData.createTime; // 创建时间
          this.detailsInfo.payType = res.data.resData.payType; // 支付类型
          this.detailsInfo.orderFee = res.data.resData.orderFee; // 支付金额
          this.detailsInfo.approvalFee = res.data.resData.approvalFee; // 核准金额
          this.detailsInfo.payTime = res.data.resData.payTime; // 支付时间
          this.detailsInfo.payLogId = res.data.resData.payLogId; // 支付流水ID
          this.detailsInfo.orderStatus = res.data.resData.orderStatus; // 订单状态
          if(res.data.resData.orderType === 9 || res.data.resData.orderType === 12) {
            this.orderDetails = res.data.resData; // 订单信息
          } else{
            this.orderDetails = res.data.resData.orderServiceInfo ? res.data.resData.orderServiceInfo : {}; // 订单服务信息
          }
          this.tableData.push(this.detailsInfo); // 把该对象添加到表格数组进行渲染
          if(res.data.resData.orderStatus === 5) {
            this.payBtn = false;
          }else{
            this.payBtn = true;
          }
          if(res.data.resData.orderStatus === 0 || res.data.resData.orderStatus ===3 || res.data.resData.orderStatus === 4|| 
            res.data.resData.orderStatus === 6 || res.data.resData.orderStatus === 7 || res.data.resData.orderStatus === 8) { // 把取消按钮禁用
            this.cancalBtn = true;
          }
        }
      });
    },
    getinfo() {
      this.orderInfo.orderType = Number(this.$route.query.orderType);
      this.orderInfo.orderId = this.$route.query.orderId;
      this.userinfo.name = this.user.userCardInfo.name;
      this.userinfo.position = this.user.userCardInfo.position;
      this.userinfo.phone = this.user.userCardInfo.phone;
      this.userinfo.corp = this.user.userCardInfo.corpName;
    },
    makeurl() {
      switch (Number(this.orderInfo.orderType)) {
        case 3:
        case 10:
        case 16:
          this.cancalBtn = false;
          this.url = '/app/get/park/service/form/order/detail'; // 自定义服务
          break;
        case 4:
          this.url = '/app/get/hr/job/order/detail'; // 找工作
          break;
        case 5:
          this.url = '/app/get/hr/service/order/detail'; // 服务外包
          break;
        case 6:
          this.url = '/app/get/hr/education/order/detail'; // 培训
          break;
        case 7:
          this.url = '/app/get/products/roadshow/order/detail'; // 产品路演
          break;
        case 8:
          this.url = '/app/get/ask/service/order/detail'; // 求购
          break;
        case 9:
          this.cancalBtn = false;
          this.url = '/app/get/food/order/detail'; // 美食街
          break;
        case 11:
          this.url = '/app/get/fine/service/order/detail'; // 优选服务
          break;
        case 12:
          this.cancalBtn = false;
          this.url = '/app/get/meeting/room/order/detail'; // 会议室 
          break;
        case 13:
          this.cancalBtn = false;
          this.url = '/app/get/activity/order/detail'; // 活动
          break;
        case 14:
          this.url = '/app/get/welfare/order/detail'; // 福利
          break;
        // case 15:
        //   this.url = ''; // 微社区
        //   break;
        // case 17:
        //   this.url = '/app/get/shop/order/detail'; // 商城
        //   break;
        default:
          break;
      }
    },
    // 支付
    jumpPay(id) { 
      this.$router.push({ path: `/navigator/pay/paymentPage/${this.orderInfo.orderId}` })
    },
    // 取消订单
    cancalOder() {
      if(this.orderInfo.orderType === 13) {
        // 活动
        this.$http.post(`${this.URL_PREFIX}/app/cancel/activity/order`, {
        orderId: this.$route.query.orderId,
      },{
        headers: { token: this.token },
      }).then((res) => {
        if(res.data.resCode === '10000') {
          this.submitSuccessFlag = true;
          this.cancalBtn = true;
          this.getdetails();
        }else{
          this.tips.tipsMsg = res.data.resDesc;
          this.submitSuccessFlag = true;
        }
       });
      }else if(this.orderInfo.orderType === 3 || this.orderInfo.orderType === 10 || this.orderInfo.orderType === 16) {
        // 自定义
        this.$http.post(`${this.URL_PREFIX}/app/delete/park/service/form/order`, {
          orderId: this.$route.query.orderId,
        },{
          headers: { token: this.token },
        }).then((res) => {
          if(res.data.resCode === '10000') {
            this.submitSuccessFlag = true;
            this.cancalBtn = true;
            this.getdetails();            
          }else{
            this.tips.tipsMsg = res.data.resDesc;
            this.submitSuccessFlag = true;
          }
        });
      }else if( this.orderInfo.orderType === 9 ) {
        // 美食街
        this.$http.post(`${this.URL_PREFIX}/app/delete/meeting/room/order`, {
          orderId: this.$route.query.orderId,
        },{
          headers: { token: this.token },
        }).then((res) => {
          if(res.data.resCode === '10000') {
            this.submitSuccessFlag = true;
            this.cancalBtn = true;
            this.getdetails();            
          }else{
            this.tips.tipsMsg = res.data.resDesc;
            this.submitSuccessFlag = true;
          }
        });
      }else if(this.orderInfo.orderType === 12 ) {
        // 会议室
        this.$http.post(`${this.URL_PREFIX}/app/delete/meeting/room/order`, {
          orderId: this.$route.query.orderId,
        },{
          headers: { token: this.token },
        }).then((res) => {
          if(res.data.resCode === '10000') {
            this.submitSuccessFlag = true;
            this.cancalBtn = true;
            this.getdetails();
          }else{
            this.tips.tipsMsg = res.data.resDesc;
            this.submitSuccessFlag = true;
          }
        });
      }
      
    },
  },
  components: {
    OfficeDemo, ParkactivityDetails, ParkexclusiveActivities, JobDemo, ProductionDemo, RecommendedDemo, ServiceDemo, CustomDemo, 
    TrainingDemo, CooperationDemo, FoodDemo, MeetingRoomDemo,
  },
  computed: {
    ...mapGetters(['token', 'user']),
  },
  created() {
    this.getinfo();
    this.makeurl();
    this.getdetails();
  },
  filters: {
    status(sta) {
      // 0删除/1待审批/2审批中/3审批不通过/4用户取消/5待支付/6完成/7订单关闭/8已退款
      if(sta === 0) {
        return '删除';
      }else if (sta === 1) {
        return '待审批';
      }else if (sta === 2) {
        return '审批中';
      }else if (sta === 3) {
        return '审批不通过';
      }else if (sta === 4) {
        return '用户取消';
      }else if (sta === 5) {
        return '待支付';
      }else if (sta === 6) {
        return '完成';
      }else if (sta === 7) {
        return '订单关闭';
      }else if (sta === 8) {
        return '已退款';
      }
    },
    payType(ty) {
      if(ty === 1) {
        return '微信支付';
      }
    }
  },
  
}
</script>

<style lang="scss" scoped>
.orderDetails{
  padding: 20px 0;
  .content{
    margin-top: 20px;
    background-color: #fff;
    padding: 40px;
    .odertitel{
      margin-top: 20px;
      height: 40px;
      line-height: 40px;
      font-size: 20px;
      font-weight: bold;
      border-bottom: 2px solid #f6f6f6;
    }
    .orderDetailbox{
      margin-top: 30px;
    }
  }
}
.m_t34{
  margin-top: 34px;
}
.m_l16{
  margin-left: 16px;
}
.m_t10{
  margin-top: 10px;
}
.serviceclass{
  font-size: 16px;
  font-weight: bold;
}
.pay{
  text-align: right;
  margin-top: 26px;
}
.payred{
  width: 100px;
  height: 32px;
  color: #fff;
  background-color: #d9262c;
  text-align: center;
  line-height: 32px;
  border-radius: 10px;
  cursor: pointer;
}
.fr{
  float: right;
}
.personalinfo{
  margin-top: 22px; 
  p{
    font-size: 16px;
  }
}
.submit-success{
  width: 196px;
  height: 110px;
  right: 40%;
  bottom: 40%;
  text-align: center;
}
</style>
