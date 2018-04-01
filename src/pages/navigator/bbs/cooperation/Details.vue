<template>
  <div v-loading="loading">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/navigator/bbs/cooperation' }">信息交互平台</el-breadcrumb-item>
      <el-breadcrumb-item>详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="header boxShadow">
      <img :src="CooperationInfo.banner" alt="">
      <div class="blurb">
        <h3>{{ CooperationInfo.serviceName }}</h3>
        <p>
          <span>发布时间：{{ CooperationInfo.createTime| DateFilter }}</span>
          <span>结束时间：{{ CooperationInfo.endTime | DateFilter }}</span>
        </p>
        <p>
          <span>目标单价：{{ CooperationInfo.price }}</span>
          <span>类型描述：{{ CooperationInfo.typeDesc }}</span>
        </p>
        <p>
          <span>送货地址或服务地点：{{ CooperationInfo.provinceName }}{{ CooperationInfo.cityName }}{{ CooperationInfo.countyName }}{{ CooperationInfo.address }}</span>
        </p>
        <el-button type="primary" size="medium" @click="showMask">联系商家</el-button>
      </div>
    </div>


    <!-- 富文本 -->
    <div class="content boxShadow" v-html="CooperationInfo.content" ref="text"></div>

     <!-- 弹窗登录 -->
    <MaskLogin v-show='showLogin' @close='showLogin = false;'></MaskLogin>

    <!-- 消息弹框 -->
    <SubmitSuccess v-if='submitSuccessFlag' @close='submitSuccessFlag = false;' class='submit-success' :tipsMsg="tipsMsg"></SubmitSuccess>

    <!--  遮罩 -->
    <div class='mask' v-show='showMaskFlag'>
      <div class='container'>
        <el-form ref="apply" :model="apply" class='apply_form'>
          <el-form-item prop='msg' label='附言' :rules='[{ required: true, message: "请填写附言"},]'>
            <el-input type="textarea" :rows="3" v-model="apply.msg"></el-input>
          </el-form-item>
          <el-form-item class='btngroup'>
            <el-button size='mini' class='cancel' @click='cancel'>取消</el-button>
            <el-button size='mini' class='confirm' @click='submit'>提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import List from '../components/List';

export default {
  data() {
    return {
      CooperationInfo: {},
      apply: {
        msg: '',
      },
      tipsMsg: '提交成功！等待企业与您联系。',
      loading: false,
      showLogin: false,
      showMaskFlag: false,
      submitSuccessFlag: false,
    }
  },
  components: {
    List,
  },
  methods: {
    // 弹出遮罩层
    showMask() {
      if (this.token) {
        this.showMaskFlag = true;
      } else {
        this.showLogin = true;
      }
    },
    reset() {
      this.showMaskFlag = false;
      this.$refs.apply.resetFields();
    },
    cancel() {
      this.reset();
    },
    submit() {
      this.$refs.apply.validate((valid) => {
        if (valid) {
          this.submitContact();
        } else {
          return false;
        }
      });
    },
    getInfo() {  // 获取求购服务列表
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 5000);
      this.$http.post(`${this.URL_PREFIX}/app/get/ask/service/detail`, {
        serviceId: this.$route.params.goodsId,
      }).then((response) => {
        const res = response.data;
        this.loading = false;
        if (res.resCode === '10000') {
          this.CooperationInfo = res.resData;
        }
      });
    },
    submitContact() {  // 提交订单
      this.$http.post(`${this.URL_PREFIX}/app/added/ask/service/order`, {
        parkId: this.parkIdList[0],
        remark: this.apply.msg,
        serviceId: this.$route.params.goodsId,
      }, {
        headers: { token: this.token, },
      }).then((response) => {
        this.reset();
        this.submitSuccessFlag = true;
        const res = response.data;
        if (res.resCode !== '10000') {
          this.tipsMsg = res.resDesc;
        }
      });
    },
  },
  computed: {
    ...mapGetters(['parkIdList', 'token']),
  },
  mounted() {
    this.getInfo();
  },
  updated() {
    const images = this.$refs.text.querySelectorAll('img');
    images.forEach((val) => {
      val.style.maxWidth = '100%';
    });
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss';

.header {
  display: flex;
  background-color: #fff;
  min-height: 276px;
  margin-bottom: 20px;
  padding-right: 20px;
  cursor: pointer;
  img {
    width: 276px;
    height: 276px;
  }
  .blurb {
    padding: 24px;
    flex: 1;
    h3 {
      width: 100%;
      font-size: 30px;
      font-weight: 600;
      line-height: 40px;
      margin-bottom: 28px;
    }
    p {
      display: flex;
      line-height: 20px;
      justify-content: flex-start;
      margin-bottom: 14px;
      span {
        font-size: 16px;
        color: #333;
        min-width: 250px;
        margin-right: 20px;
      }
      &:last-of-type {
        margin-bottom: 30px;
      }
    }
  }
}
.content {
  padding: 40px;
  background-color: #fff;
  margin-bottom: 20px;
}
// 消息弹框
.submit-success{
  right: 50%;
  bottom: 50%;
  transform: translate(50%, 50%);
}
// 遮罩
.mask{
  @include mask;
  .container{
    width: 80%;
    max-width: 400px;
    .apply_form{
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
      .confirm{
        background: #d0011b;
        color: #FFFFFF;
        border-color: #d0011b;
      }
    }
  }
}

</style>

