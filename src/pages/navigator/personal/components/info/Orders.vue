<template>
  <div class="Orders">
    <div class="select">
      <el-select v-model.number="value" placeholder="请选择" @change="getlist">
        <el-option v-for="item in serviceIdList" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </div>
    <div class="ajie_table">
      <el-table :data="tableData3" border>
        <el-table-column label="订单编号" width="177px">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="details(scope.row.orderType, scope.row.orderId)">{{scope.row.orderId}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="ordertime" label="下单时间" width="125px">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="details(scope.row.orderType, scope.row.orderId)">{{scope.row.createTime}}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="服务名称" >
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="details(scope.row.orderType, scope.row.orderId)" class="textOver title">{{scope.row.title }}</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="processingTime" label="处理时间" width="119px">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="details(scope.row.orderType)">{{scope.row.processingTime}}</el-button>
          </template>
        </el-table-column> -->
        <el-table-column label="状态" width="90px">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="details(scope.row.orderType, scope.row.orderId)">{{scope.row.orderStatus | orderStatus}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="核准金额(元)" width="89px">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="details(scope.row.orderType, scope.row.orderId)">{{scope.row.approvalFee}}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="fy main-pagination">
      <el-pagination background layout="prev, pager, next" :total="msgtotal"  @current-change="handleCurrentChange" :page-size="9"></el-pagination>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  data(){
    return{
      value: '', // 8大服务的id
      msgtotal: 0,
      pageIndex: 1,
      oderId: '', // 订单编号（转成字符串，处理失真问题）
      serviceIdList: [
        { label: '全部', value: '' },
        { label: '物业服务平台', value: 1001 },{ label: '商业服务平台', value: 1002 },
        { label: '政务服务平台', value: 1003 },{ label: '金融服务平台', value: 1004 },
        { label: '人力资源平台', value: 1005 },{ label: '园区配套平台', value: 1006 },
        { label: '产品路演平台', value: 1007 },{ label: '信息交互平台', value: 1008 },
      ],
      tableData3:[],
    }
  },
  methods:{
    details(Ty, id) {
      this.$router.push({ path: `/navigator/personal/orderDetail`, query: { orderType: Ty, orderId: id } });
    },
    getlist() {
      const askBoby = {
        currPage: this.pageIndex,
        pageRows: 9,
      };
      if (this.value !== '') {
        askBoby.serviceId = this.value;
      }
      this.$http.post(`${this.URL_PREFIX}/app/get/user/order/info/list`, askBoby,{
        headers: { token: this.token },
      }).then((res) =>{
        if(res.data.resCode === '10000') {
          this.tableData3 = res.data.resData.pageList;
          if(res.data.resData.pageInfo.total) {
            this.msgtotal = res.data.resData.pageInfo.total;
          }
        }
      });
    },
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.getlist();
    },
  },
  mounted() {
    this.getlist();
  },
  filters: {
    orderType(num) {
      switch (num) {
        case 3:
          return '自定义服务';
        case 4:
          return '找工作';
        case 5:
          return '服务外包';
        case 6:
          return '培训';
        case 7:
          return '产品路演';
        case 8:
          return '求购';
        case 9:
          return '美食街';
        case 10:
          return '入驻';
        case 11:
          return '优选服务';
        case 12:
          return '会议室';
        case 13:
          return '活动';
        case 14:
          return '福利';
        case 15:
          return '微社区';
        case 16:
          return '设施出租';
        case 17:
          return '商城';
        default:
          break;
      }
    },
    orderStatus(num) {
      switch (num) {
        case 0:
          return '删除';
        case 1:
          return '待审批';
        case 2:
          return '审批中';
        case 3:
          return '审批不通过';
        case 4:
          return '用户取消';
        case 5:
          return '待支付';
        case 6:
          return '完成';
        case 7:
          return '订单关闭';
        case 8:
          return '已退款';
        default:
          break;
      }
    },
  },
  computed: {
    ...mapGetters(['parkIdList', 'token']),
  },
}
</script>
<style lang="scss" scoped>
.Orders{
  .select{
    width: 940px;
    background-color: #fff;
    box-sizing: border-box;
    padding: 20px;
  }
  .ajie_table{
    padding: 20px;
    font-size: 12px;
    background-color: #fff;
    .el-table{
      font-size: 12px;
      .el-button{
        color: #333;
        &.title {
          width: 400px;
        }
        &:hover{
          text-decoration: underline;
        }
      }
    }
  }
}
.fy{
  text-align: center;
  margin-top: 76px;
}
</style>
