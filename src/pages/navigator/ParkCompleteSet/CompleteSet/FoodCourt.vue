<template>
  <div class="foodCourt align-center-main">
    <div class="search in_b boxShadow">
      <div class="searchClass clearfix">
        <div class="searchClassbox"  @click="onFoodList = 0; corpId = ''" :class="{ 'red': onFoodList === 0 }">商品</div>
        <div class="searchClassbox"  @click="onFoodList = 1" :class="{ 'red': onFoodList === 1 }">店铺</div>
      </div>

      <!-- 食品搜索 -->
      <div class="clearfix" v-show="onFoodList === 0">
        <input type="text" class="searchipt" v-model="searchThings">
        <div class="searchbtn" @click="getfoodList" >搜 索</div>
      </div>
      <!-- 店铺搜索 -->
      <div class="clearfix" v-show="onFoodList === 1">
        <input type="text" class="searchipt" v-model="searchShops">
        <div class="searchbtn" @click="getShopsList">搜 索</div>
      </div>

      <ul class="navlist clearfix" v-show="onFoodList === 0">
        <li>
          <span :class=" { 'red': foodType == -1 }" @click="selectSpan(-1)">全部</span>
        </li>
        <li v-for="item in navlist" :key="item.id" class="textOver">
          <span :class=" { 'red': foodType == item.id }" @click="selectSpan(item.id)">{{ item.name }}</span>
        </li>
      </ul>
    </div>
    <!-- 购物车 -->
    <div class="shoppingCar fr boxShadow">
      <p class="shoppingCarheader">购物车 
        <span class="fr" @click="clearCart">
          <i class="el-icon-delete"></i>
          清空购物车
        </span>
      </p>
      <div class="shoppingthings">
        <div v-for="(item,index) in goodsCar" :key="index" class="shopCarList">
          <div class="thingsname">
            <img :src="item.logoIcon" alt="" class="merchantslogo in_b">
            <p class="merchantsname in_b textOver">{{ item.corpName }}</p>
          </div>
          <div class="Goodslittleprice" v-for="(item2, index2) in item.goods" :key='index2'>
            <el-tooltip class="item" effect="light" :content="item2.title" placement="bottom">
              <span class="titleName textOver">{{ item2.title }}</span>
            </el-tooltip>
            <el-input-number v-model="item2.num" :min="1" :max="999999" size="mini" class="smallinput"></el-input-number>
            <span class="littleprice">{{ item2.price / 100 * item2.num }}元</span>
            <i class="el-icon-error" @click="delGoods(index, index2, item2.foodId)"></i>
          </div>
        </div>
        <div class="totalprice">
          <p>共<span class="totalnum">{{ totalNum }}</span>份，共计：<span class="bigprice">{{ totalPrice / 100 | PriceFilter }} 元</span></p>
        </div>
      </div>
      <div class="pay" @click="submit">结算</div>
    </div>

    <!-- 商品 -->
    <div v-show="onFoodList === 0" class="goodsBox" v-loading="loading">
      <div class="TheGoods boxShadow" v-for="(item,index) in goodsList" :key="index">
        <img :src="item.picUrl" alt="" class="goodsimg in_b">
        <div class="Goodsmidd in_b">
          <p class="Goodstitel">{{ item.title }}</p>
          <p class="Goodssec textOver">{{ item.attrNorm	}}</p>
          <p class="price">园区专享价：{{ item.discountPrice / 100 | PriceFilter }} 元
            <span class="yuanjia">原价：{{ item.originalPrice / 100 | PriceFilter }} 元</span>
          </p>
        </div>
        <div class="Goodsirig in_b fr">
          <div class="goodsIcon" @click="enterShop(item.corpId)">
            <img :src="item.logoIcon" alt="" class="merchantslogo in_b">
            <p class="in_b textOver">{{ item.corpName }}</p>
          </div>
          <div class="addCar fr" @click="handleChange(item)">加入购物车</div>
          <!-- <el-input-number v-model="item.num" @change="handleChange($event, item)" :min="0" :max="999999" size="mini" class="Goodsnum"></el-input-number> -->
        </div>
      </div>
      <div class="pageStyle main-pagination">
        <el-pagination :page-size="8" layout="prev, pager, next, jumper" background @current-change="handleCurrentChange" :total="foodPageTotal">
      </el-pagination>
      </div>
    </div>

   <!-- 店铺 -->
    <div v-show="onFoodList === 1" class="goodsBox" v-for="(item,index) in shopsList" :key="index" v-loading="loading">
      <div class="shops boxShadow" @click="enterShop(item.corpId)">
        <img :src="item.logoIcon" alt="">
        <div class="content ">
          <h3 class="textOver">{{ item.corpName }}</h3>
          <p>{{ item.description }}</p>
        </div>
      </div>
    </div>
     
      <!-- 弹窗登录 -->
    <MaskLogin v-show='showLogin' @close='closeLogin'></MaskLogin>
    <!-- 消息弹框 -->
    <SubmitSuccess v-if='submitSuccessFlag' @close='submitSuccessFlag = false;' class='submit-success' :tipsMsg="tipsMsg"></SubmitSuccess>
   
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import deepcopy from '@/utils/deepcopy';

export default {
  data() {
    return{
      searchThings: '',   // 食品搜索框
      searchShops: '',    // 店铺搜索
      goodsList: [],  // 商品列表
      goodsCar: [],   // 购物车
      shopsList: [],   // 店铺列表
      goodsArr: [],   // 保存购物车存在的商品及id
      foodType: -1,   // 商品种类， -1为全部
      corpId: '',       // 店铺id
      onFoodList: 0,  // 显示食品列表
      editCar: true,  // 编辑购物车
      navlist:[],    // 食品种类
      foodPageIndex: 1,   // 页数
      foodPageTotal: 0,    // 总页数
      shopsPageIndex: 1,   // 店铺页数
      shopsPageTotal: 0,   // 店铺页数
      showLogin: false,   // 登录窗口
      submitSuccessFlag: false,  // 消息弹框
      loading: false,
    }
  },
  methods:{
    delGoods(index1, index2, foodId) {  // 删除商品
      const foodIndex = this.goodsList.findIndex((val) => {
        return val.foodId === foodId;
      })
      this.$set(this.goodsList[foodIndex], 'num', 0);
      this.goodsCar[index1].goods.splice(index2, 1);
      if (this.goodsCar[index1].goods.length === 0) {  // 商品数为0则删除店铺
        this.goodsCar.splice(index1, 1);
      }
      this.$store.commit('change_cart', this.goodsCar);
    },
    clearCart() {  // 清空购物车
      this.goodsCar = [];
      this.goodsList.forEach((val) => {
        val.num = 0;
      });
      this.$store.commit('change_cart');
    },
    closeLogin() {
      this.showLogin = false;
      this.getfoodList();
    },
    isVip() {
      // 当前园区普通用户
      if (this.user.attachParkId === this.parkIdList[0]) {
        return true;
      }
      // 园区管理员
      if (this.user.bindParkInfo && this.user.bindParkInfo.length) {
        this.user.bindParkInfo.forEach((park) => {
          if (park.parkId === this.parkIdList[0]) {
            return true;
          }
        });
      }
      // 当前园区企业管理员
      if (this.user.bindCorpInfo && this.user.bindCorpInfo.parkId === this.parkIdList[0]) {
        return true;
      }
      return false;
    },
    // handleChange(itemValue, item) {  // 点击计数器添加商品
    handleChange(item) {  // 加入购物车
      if (!this.token) {
        this.showLogin = true;
        return;
      }
      // if (itemValue === 0) {
      //   return;
      // }
      // item.num = itemValue;
      const corpIndex = this.goodsCar.findIndex((val) => {
        return val.corpId === item.corpId;
      })
      if (corpIndex === -1) {  // 企业id不存在
        this.goodsCar.push({
          corpName: item.corpName,
          logoIcon: item.logoIcon,
          corpId: item.corpId,
          goods: [item],
        });
      } else {  // 企业存在
        const foodIndex = this.goodsCar[corpIndex].goods.findIndex((val) => {
          return val.foodId === item.foodId;
        })
        if (foodIndex === -1) { // 商品不存在
          this.goodsCar[corpIndex].goods.push(item);
        } else {  // 商品存在
          this.$set(this.goodsCar[corpIndex].goods[foodIndex], 'num', item.num);
          this.$message({
            type: 'warning',
            message: '该商品已在购物车',
            showClose: true,
          });
        }
      }
      this.$store.commit('change_cart', this.goodsCar);
    },
    handleCurrentChange(val) {  // 改变商品列表页数
      this.foodPageIndex = val;
      this.getfoodList();
    },
    handleShopsChange(val) {  // 改变店铺列表页数
      this.shopsPageIndex = val;
      this.getShopsList();
    },
    enterShop(corpId) {
      this.corpId = corpId;
      this.foodType = -1;   // 更改食品种类为所有
      this.getfoodList();
      this.onFoodList = 0;
    },
    selectSpan(index){  // 修改样式
      this.foodType = index;
      this.getfoodList();
    },
    submit() {   // 提交表单
      if (this.goodsCar.length === 0) {
        this.$message({ message: '购物车为空', type: 'error', showClose: true });
      } else {
        this.$router.push({ name: 'submitFoods' });
      }
    },
    // http
    getfoodType() {  // 获取食物类别
      this.$http.post(`${this.URL_PREFIX}/app/get/food/category/tree`, {
        parkId: this.parkIdList[0],
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.navlist = res.resData;
        }
      });
    },
    getfoodList() {  // 获取食物列表
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 5000);
      const listBody = {
        parkId: this.parkIdList[0],
        currPage: this.foodPageIndex,
        pageRows: 8,
      };
      if (this.foodType !== -1) {
        listBody.categoryId = this.foodType;
      }
      if (this.searchThings !== '') {
        listBody.title = this.searchThings;
      }
      if (this.corpId !== '') {
        listBody.corpId = this.corpId;
      }
      this.$http.post(`${this.URL_PREFIX}/app/get/food/info/list`, listBody)
      .then((response) => {
        const res = response.data;
        this.loading = false;
        if (res.resCode === '10000') {
          this.goodsList = res.resData.pageList ? res.resData.pageList : [];
          this.corpId = '';
          const isUserVip = this.isVip();
          this.goodsList.forEach((val) => {
            if (isUserVip) {
              val.price = val.discountPrice;
            } else {
              val.price = val.originalPrice;
            }
            this.$set(val, 'num', 0);
            // this.goodsArr.forEach((val2) => {
            //   if (val.foodId === val2.foodId) {
            //     this.$set(val, 'num', val2.num);
            //   }
            // });
          });
          this.foodPageTotal = res.resData.pageInfo ? res.resData.pageInfo.total : 0;
        }
      });
    },
    getShopsList() {  // 获取店铺列表
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 5000);
      const listBody = {
        parkId: this.parkIdList[0],
        currPage: this.shopsPageIndex,
        pageRows: 8,
      }
      if (this.searchShops !== '') {
        listBody.corpName = this.searchShops;
      }
      this.$http.post(`${this.URL_PREFIX}/app/get/food/info/corp/list`, listBody)
      .then((response) => {
        const res = response.data;
        this.loading = false;
        if (res.resCode === '10000') {
          this.shopsList = res.resData.pageList ? res.resData.pageList : [];
          this.shopsPageTotal = res.resData.pageInfo ? res.resData.pageInfo.total : 0;
        }
      });
    },
  },
  computed: {
    ...mapGetters(['parkIdList', 'token', 'shoppingCart', 'user']),
    totalNum() {
      let sum = 0;
      this.goodsCar.forEach((val) => {
        val.goods.forEach((val2) => {
          sum += val2.num;
        })
      });
      return sum;
    },
    totalPrice() {
      let sum = 0;
      this.goodsCar.forEach((val) => {
        val.goods.forEach((val2) => {
          sum += val2.price * val2.num;
        })
      });
      return sum;
    },
  },
  mounted() {
    this.getfoodType();
    this.getfoodList();
    this.getShopsList();
    this.goodsCar = this.shoppingCart;
  },
}
</script>

<style lang="scss" scoped>
.search{
  width: 800px;
  // height: 182px;
  box-sizing: border-box;
  background-color: #fff;
  padding: 20px;
  .searchClassbox{
    float: left;
    width: 60px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    cursor: pointer;
  }
  .searchipt{
    width: 608px;
    height: 26px;
    padding: 5px 10px;
    border: 1px solid #d9262c;
    outline: none;
    font-size: 16px;
    float: left;
  }
  .searchbtn{
    width: 128px;
    height: 38px;
    background-color: #d9262c;
    color: #fff;
    float: left;
    font-size: 16px;
    text-align: center;
    line-height: 40px;
    cursor: pointer;
  }
  .navlist{
    width: 688px;
    margin-top: 10px;
    li{
      width: 114px;
      float: left;
      box-sizing: border-box;
      span {
        display: inline-block;
        border-radius: 4px;
        padding: 7px 10px;
        height: 30px;
        line-height: 16px;
        box-sizing: border-box;
        cursor: pointer;
      }
    }
  }
}
.shoppingCar{
  width: 378px;
  margin-left: 20px;
  background-color: #fff;
  vertical-align: top;
  .shoppingCarheader{
    padding: 0 20px;
    height: 60px;
    font-size: 16px;
    font-weight: bold;
    line-height: 60px;
    background-color: #fafafa;
    span {
      font-weight: normal;
      cursor: pointer;
    }
  }
  .shoppingthings{
    min-height: 300px;
    background-color: #fff;
    padding: 20px;
    .shopCarList {
      margin-bottom: 20px;
    }
    .totalprice{
      text-align: right;
      right:0px;
      bottom: 0px;
      .totalnum{
        color: #d9262c;
      }
      .bigprice{
        color: #d9262c;
        font-size: 18px;
      }
    }
  }
  .Goodslittleprice{
    height: 40px;
    // line-height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #ebebeb;
    .el-icon-error {
      // float: right;
      cursor: pointer;
      font-size: 16px;
      color: #ccc;
      &:hover {
        color: #d9262c;
      }
    }
    .titleName {
      display: inline-block;
      width: 150px;
      margin-right: 4px;
    }
    .littleprice{
      color: #d9262c;
    }
    .smallinput{
      width: 100px;
      margin: 0 6px;
      // margin-left: 50px;
    }
  }
  .pay{
    background-color: #d9262c;
    height: 40px;
    font-size: 16px;
    line-height: 40px;
    text-align: center;
    color: #fff;
    border-radius: 0 0 4px 4px;
    cursor: pointer;
  }
}
.goodsBox {
  width: 800px;
}
.TheGoods{
  min-height: 140px;
  background-color: #fff;
  margin-top: 20px;
  box-sizing: border-box;
  padding: 20px;
  .goodsimg{
    width: 134px;
    height: 100px;
    vertical-align: middle;
  }
  .Goodstitel{
    width: 450px;
    font-size: 20px;
    font-weight: bold;
    line-height: 24px;
    margin-bottom: 4px;
  }
  .Goodsmidd{
    line-height: 100px;
    width: 450px;
    vertical-align: middle;
    margin-left: 15px;
    .Goodssec{
      width: 450px;
      font-size: 12px;
      color: #666;
    }
    .price{
      font-size: 16px;
      color: #de2c32;
      margin-top: 10px;
      .yuanjia{
        font-size: 12px;
        color: #999;
        margin-left: 20px;
      }
    }
  }
  .Goodsirig{
    display: flex;
    height: 100px;
    flex-direction: column;
    justify-content: space-between;
    .Goodsnum{
      margin-top: 24px;
    }
    .addCar {
      width: 120px;
      height: 32px;
      background-color: #d9262c;
      text-align: center;
      line-height: 32px;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
    }
    .goodsIcon {
      display: flex;
      justify-content: space-around;
      align-items: center;
      cursor: pointer;
      p {
        font-size: 14px;
        width: 70px;
      }
    }
  }
}

.shops {
  display: flex;
  padding: 20px;
  height: 100px;
  background-color: #fff;
  margin-top: 20px;
  cursor: pointer;
  img {
    width: 134px;
    height: 100%;
    border-radius: 4px 0 0 4px;
    margin-right: 14px;
  }
  .content {
    flex: 1;
    padding-right: 20px;
    h3 {
      width: 600px;
      font-weight: 600;
      font-size: 20px;
      color: #333;
    }
    p {
      width: 600px;
      height: 63px;
      overflow: hidden;
      margin-top: 20px;
      font-size: 12px;
      color: #666;
    }
  }
}

.merchantslogo{
  width: 36px;
  height: 36px;
  vertical-align: middle;
  border-radius: 50%;
  border: 1px solid #ccc;
}

.thingsname{
  height: 40px;
  padding-bottom: 10px;
  border-bottom: 1px solid  #ebebeb;
  display: flex;
  align-items: center;
  .merchantsname{
    font-size: 14px;
    width: 290px;
    margin-left: 10px;
  }
}
.in_b{
  display: inline-block;
}
.red{
  background-color: #d9262c;
  color:#fff;
}
.fl{
  float: left;
}
.fr{
  float: right;
}
.pageStyle{
  text-align: center;
  margin-top: 76px;
}
</style>
