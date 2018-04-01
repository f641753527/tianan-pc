<template>
  <div class="foodDemo clearfix">
    <div class="foodBox" v-for="(item, index) in info.orderServiceList" :key="index">
      <img :src="item.picUrl" alt="" class="img_b">
      <div class="text">
        <p class="goodsName">{{item.title}}</p>
        <p class="goodsSpecifications">{{item.attrNorm}}</p>
        <p class=""><span class="goodsPrice">{{item.price / 100}} 元</span><span class="gooodsNum">× {{item.num}}</span></p>
      </div>
      <div class="foot">
        <p class="address">配送地址：{{item.address}}</p>
      </div>
      <!-- <div class="remark">
        <div class="boxTitle">附言</div>
        <div class="itemText">
          <el-input type="textarea" :rows="4"  v-model="info.remark" readonly ></el-input>
        </div>
      </div> -->
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
.foodBox{
  float: left;
  // height: 100px;
  margin-right: 20px;
  &:nth-of-type(2n){
    margin-right: 0;
  }
  .img_b{
    width: 100px;
    height: 100px;
    display: inline-block;
    vertical-align: middle;
  }
  .text{
    width: 330px;
    display: inline-block;
    vertical-align: middle;
    margin-left: 10px;
    .goodsName{
      font-size: 15px;
      font-weight: bold;
    }
    .goodsPrice{
      color: red;
      font-size: 18px;
    }
    .gooodsNum{
      margin-left: 40px;
      float: right;
      font-size: 18px;
    }
  }
  .foot{
    margin-top: 20px;
    // margin-left: 20px;
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
