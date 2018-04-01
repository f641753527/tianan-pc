<template>
  <div class='detail'>
    <!-- <p class='header'>
      <router-link to='/navigator' >首页</router-link> > 
      <router-link to='/navigator/production' >产品路演平台</router-link> > 详情
    </p> -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/navigator/production' }">产品路演平台</el-breadcrumb-item>
      <el-breadcrumb-item>详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class='production boxShadow'>
      <div class='avatar'><img :src='production.productBanner'/></div>
      <div class='introduce'>
        <h1 class='title'>{{production.productName}}</h1>
        <p class='attrs'>
          <span class='attr' v-for='(attr, index) in production.productAttr' :key='index'>{{attr.attr}} : {{attr.value}} </span>
        </p>
        <p class='contact'>
          <el-button size='mini' @click='showMask'>联系商家</el-button>
        </p>
        <SubmitSuccess v-if='submitSuccessFlag' @close='submitSuccessFlag = false;' class='submit-success' :tipsMsg='tips.tipsMsg' :duration='tips.duration'></SubmitSuccess>
      </div>
    </div>
    <div class='text boxShadow' ref="text" v-html='production.productContent'></div>
    <div class='mask' v-show='showMaskFlag'>
      <div class='container'>
        <el-form ref="call" :model="call" class='call_form'>
          <el-form-item label='附言' prop='msg' :rules='[{ required: true, message: "请填写附言"},]'>
            <el-input type="textarea" :rows="3" v-model="call.msg"></el-input>
          </el-form-item>
          <el-form-item class='btngroup'>
            <el-button size='mini' class='cancel' @click='cancel'>取消</el-button>
            <el-button size='mini' class='confirm' @click='submit'>提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 弹窗登录 -->
    <MaskLogin v-show='showLogin' @close='showLogin = false;'></MaskLogin>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SubmitSuccess from '@/components/SubmitSuccess';

export default {
  data() {
    return {
      productionId: '',
      production: {},
      showMaskFlag: false,
      submitSuccessFlag: false,
      call: {
        msg: '',
      },
      tips: {
        title: '提示',
        tipsMsg: '提交成功！等待企业与您联系。',
        duration: 2000,
      },
      // 展示弹窗登录
      showLogin: false,
    };
  },
  methods: {
    showMask() {
      if (this.token) {
        this.showMaskFlag = true;
      } else {
        this.showLogin = true;
      }
    },
    reset() {
      this.showMaskFlag = false;
      this.$refs.call.resetFields();
    },
    cancel() {
      this.reset();
    },
    submit() {
      this.$refs.call.validate((valid) => {
        if (valid) {
          this.submitRequest();
        } else {
          return false;
        }
      });
    },
    // http
    getDetail() {
      this.$http.post(`${this.URL_PREFIX}/app/get/products/roadshow/detail`, {
        productId: this.productionId,
      }, {
        headers: { token: this.token, }
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.production = res.resData;
        }
      });
    },
    submitRequest() {
      this.$http.post(`${this.URL_PREFIX}/app/added/products/roadshow/order`, {
        parkId: this.parkIdList[0],
        remark: this.call.msg,
        productId: this.productionId,
      }, {
        headers: { token: this.token, }
      }).then((response) => {
        const res = response.data;
        this.reset();
        this.submitSuccessFlag=true;
        if (res.resCode !== '10000') {
          this.tips.tipsMsg = res.resDesc;
        }
      });
    },
  },
  components: {
    SubmitSuccess,
  },
  computed: {
    ...mapGetters(['parkIdList', 'token']),
  },
  created() {
    this.productionId = this.$route.params.productionId;
    this.getDetail();
  },
  updated () {
    const imgs = this.$refs.text.querySelectorAll('img');
    imgs.forEach((val) => {
      val.style.maxWidth = '100%';
    });
  }
};
</script>

<style lang="scss" scoped>
@import "~@scss";
.detail {
  padding-bottom: 30px;
  .header{
    margin-bottom: 20px;
    a{
      color: #333333;
    }
    a:hover{
      text-decoration: underline;
      color: #999999;
    }
    font-size: 12px;
    line-height: 20px;
    color: #333333;
  }
  .production{
    @include clear-float;
    height: 300px;
    margin-bottom: 20px;
    background: #ffffff;
    .avatar, .introduce{
      float: left;
      height: 100%;
    }
    .avatar{
      width: 536px;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .introduce{
      position: relative;
      width: 664px;
      box-sizing: border-box;
      padding: 26px;
      .title{
        font-size: 18px;
        line-height: 28px;
        font-weight: 600;
        margin-bottom: 12px;
      }
      .attrs{
        color: #333333;
        line-height: 32px;
        .attr{
          display: inline-block;
          margin-right: 6px;
          padding-right: 6px;
          height: 14px;
          line-height: 14px;
          border-right: 1px solid #333333;
          &:last-of-type{
            margin-right: 0;
            border: none;
          }
        }
      }
      .contact{
        margin-top: 20px;
        .el-button{
          background: #d0011b;
          color: #ffffff;
          border: none;
        }
        .el-button:hover{
          background: #ffffff;
          color: #d0011b;
          border: 1px solid #d0011b;
        }
      }
      .submit-success{
        right: 10px;
        bottom: 10px;
      }
    }
  }
  .text{
    padding: 30px 40px;
    background: #FFFFFF;
  }
  .mask{
    @include mask;
    .container{
      width: 80%;
      max-width: 400px;
      .call_form{
        .btngroup{
          text-align: center;
        }
        .cancel, .confirm{
          padding: 8px 40px;
        }
        .cancel{
          color: #d0011b;
          border-color: #d0011b;
        }
        .cancel:hover{
          background: #d0011b;
          color: #FFFFFF;
          border-color: #d0011b;
        }
        .confirm{
          background: #d0011b;
          color: #FFFFFF;
          border-color: #d0011b;
        }
        .confirm:hover{
          background: #ffffff;
          color: #d0011b;
          border-color: #d0011b;
        }
      }
    }
  }
}
</style>
