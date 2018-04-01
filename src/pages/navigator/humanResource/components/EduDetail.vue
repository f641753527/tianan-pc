<template>
  <div class='job-detail'>
    <!-- <p class='header'>
      <router-link to='/navigator' >首页</router-link> > 
      <router-link to='/navigator/humanResource' >人力资源平台</router-link> > 详情
    </p> -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/navigator/humanResource' }">人力资源平台</el-breadcrumb-item>
      <el-breadcrumb-item>详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class='detail boxShadow'>
      <div class='top'>
        <p class='header'><span class='position'>{{job.title}}</span><span class='date'>{{job.createTime | DateFilter}}</span></p>
        <p class='number'>名额： {{job.number}} 人</p>
        <p class='price'>{{job.price}}<span class='unit' v-if='job.price'>元/月</span></p>
        <el-button class='apply' size='small' @click='showMask'>报名</el-button>
      </div>
      <p class='footer'>{{job.corpName}}</p>
      <!-- 提交成功的弹出组件 -->
      <SubmitSuccess v-if='submitSuccessFlag' @close='submitSuccessFlag = false;' class='submit-success' :tipsMsg='tips.tipsMsg' :duration='tips.duration'></SubmitSuccess>
    </div>
    <div class='rich-text boxShadow'>
      <div class='position_desc'>
        <h1>职位描述</h1>
        <div v-html='job.content'></div>
      </div>
      <div class='corp_desc'>
        <h1>企业介绍</h1>
        <h3>{{job.corpName}}</h3>
        <div class='content' v-html='job.corpProfile' ref="text"></div>
      </div>
    </div>
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
    <!-- 弹窗登录 -->
    <MaskLogin v-show='showLogin' @close='showLogin = false;'></MaskLogin>
  </div>
</template>

<script>
import SubmitSuccess from '@/components/SubmitSuccess';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      jobId: '',
      job: {},
      showMaskFlag: false,
      submitSuccessFlag: false,
      apply: {
        msg: '',
      },
      tips: {
        title: '提示',
        tipsMsg: '提交成功！等待企业与您联系。',
        duration: 2000,
      },
      showLogin: false,
    };
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
          this.submitRequest();
        } else {
          return false;
        }
      });
    },
    submitRequest() {
      this.$http.post(`${this.URL_PREFIX}/app/added/hr/education/order`, {
        parkId: this.parkIdList[0],
        remark: this.apply.msg,
        educationId: this.job.id,
      }, {
        headers: { token: this.token, },
      }).then((response) => {
        this.reset();
        this.submitSuccessFlag=true;
        const res = response.data;
        if (res.resCode !== '10000') {
          this.tips.tipsMsg = res.resDesc;
        }
      });
    },
    getJobDetail() {
      this.$http.post(`${this.URL_PREFIX}/app/get/hr/education/info/detail`, {
        id: this.jobId,
      }, {
        headers: { token: this.token, }
      }).then((response) => {
        const res = response.data;
        this.job = res.resData;
      });
    },
  },
  computed: {
    ...mapGetters(['parkIdList', 'token']),
  },
  created() {
    this.jobId = this.$route.params.eduId;
    this.getJobDetail();
  },
  updated() {
    const imgs = this.$refs.text.querySelectorAll('img');
    imgs.forEach((val) => {
      val.style.maxWidth = '100%';
    });
  },
  components: { SubmitSuccess },
};
</script>

<style lang="scss" scoped>
@import '~@scss';
.job-detail {
  padding-bottom: 30px;
  .header{
    a{
      color: #333333;
    }
    a:hover{
      text-decoration: underline;
      color: #999999;
    }
    margin-bottom: 20px;
    font-size: 12px;
    line-height: 20px;
    color: #333333;
  }
  .detail{
    position: relative;
    // border: 1px solid #c4c4c4;
    cursor: pointer;
    .top{
      position: relative;
      padding: 20px 30px;
      background: #ffffff;
      .header{
        @include clear-float;
        .position{
          float: left;
          font-weight: 700;
          font-size: 20px;
          color: #333333;
        }
        .date{
          float: right;
          color: #666666;
          font-size: 14px;
        }
      }
      .number{
        font-weight: 600;
        color: #666666;
      }
      .price{
        font-weight: 600;
        color: $color-main;
        font-size: 24px;
        .unit{
          font-size: 12px;
          color: #999999;
        }
      }
      .apply{
        position: absolute;
        padding: 10px 40px;
        right: 30px;
        bottom: 30px;
        background: $color-main;
        border-color: $color-main;
        color: #ffffff;
        font-size: 16px;
      }
    }
    .footer{
      padding: 10px 30px;
      // line-height: 32px;
      background: #f9f9f9;
      font-size: 16px;
      color: #666666;
    }
    .submit-success{
      right: 0;
      bottom: 0;
    }
  }
  .rich-text{
    padding: 30px 40px;
    margin-top: 20px;
    background: #ffffff;
    h1, h3{
      font-weight: 600;
      color: #333333;
    }
    h1{
      line-height: 48px;
    }
    h3{
      line-height: 32px;
    }
    .position_desc{
      margin-bottom: 30px;
    }
    .corp_desc .content{
      padding-top: 20px;
    }
  }
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
