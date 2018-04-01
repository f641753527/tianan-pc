<template>
  <div>
    <li class="boxShadow">
      <img :src="info.orderServiceInfo.roomPic" alt="">
      <div class="content">
        <h3>{{ info.orderServiceInfo.roomName }}</h3>
        <h4>价格：{{ info.orderServiceInfo.minFee / 100 | PriceFilter }} 元起</h4>
        <p>容量：{{ info.orderServiceInfo.capacityNum }} 人</p>
        <p>其他设备：{{ info.orderServiceInfo.roomTag == '' ? '暂无详情' : info.orderServiceInfo.roomTag }}</p>
      </div>
    </li>
    <div class="timeBox">
      <div class="boxTitle">预定时间</div>
      <p class="itemTime" v-for="(item, index) in info.orderServiceInfo.roomOrderLis" :key="index">{{item.beginTime | DateFilter('yyyy-MM-dd hh:mm')}} - {{item.endTime | DateFilter('yyyy-MM-dd hh:mm')}}
        <span class="red fr">{{item.roomFee / 100 | PriceFilter}}元 </span>
      </p>
    </div>
    <div class="remark">
      <div class="boxTitle">附言</div>
      <div class="itemText">
        <el-input type="textarea" :rows="4"  v-model="info.remark" readonly ></el-input>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default() {
        return{};
      },
    },
  },
}
</script>

<style lang="scss" scoped>
  li {
    width: 100%;
    height: 300px;
    background-color: #fff;
    margin-bottom: 20px;
    border-radius: 4px;
    display: flex;
    img {
      width: 535px;
      height: 100%;
      border-radius: 4px 0 0 4px;
    }
    .content{
      flex: 1;
      padding-left: 30px;    
      h3 {
        margin-top: 32px;
        margin-bottom: 20px;
        font-size: 30px;
        line-height: 30px;
      }
      h4 {
        font-size: 16px;
        color: #de2c32;
        margin-bottom: 25px;
      }
      p {
        color: #666;
        font-size: 14px;
      }
    }
    
  }
  .timeBox{
    font-size: 18px;
    margin-bottom: 10px;
    .boxTitle{
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 10px;
    }
    .itemTime{
      font-size: 16px;
    }
  }
  .remark{
    font-size: 18px;
    .boxTitle{
      font-size: 18px;
      font-weight: 600;
      margin-bottom: 10px;
    }
    .itemText{
      font-size: 16px;
    }
  }
  .red{
    color:#de2c32;
  }
  .fr{
    float: right;
  }
</style>
