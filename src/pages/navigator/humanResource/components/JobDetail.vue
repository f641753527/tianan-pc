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
        <p class='descripe'>
          <span class='salary'>{{job.salary | salaryFilter}}</span>
          <span class='prop'>{{job.education | educationFilter}}</span>
          <span class='line'>&nbsp;</span>
          <span class='prop'>{{job.yearOfWorking | jobFilter}}</span>
        </p>
        <p class='need'><span class='iconfont  icon-renshu'></span><span>招聘{{job.number}}人</span></p>
        <p class='need'><span class='iconfont icon-shaixuan'></span><span>{{job.jobStatus | jobStatue}}</span></p>
        <el-button class='apply' size='small' @click='showMask'>申请职位</el-button>
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
      this.$http.post(`${this.URL_PREFIX}/app/added/hr/job/order`, {
        parkId: this.parkIdList[0],
        remark: this.apply.msg,
        jobId: this.job.id,
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
      this.$http.post(`${this.URL_PREFIX}/app/get/hr/job/info/detail`, {
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
    this.jobId = this.$route.params.jobId;
    this.getJobDetail();
  },
  updated() {
    const imgs = this.$refs.text.querySelectorAll('img');
    imgs.forEach((val) => {
      val.style.maxWidth = '100%';
    });
  },
  components: { SubmitSuccess },
  filters: {
    salaryFilter(salary) {
      if (salary === 1) {
        return '面议 ';
      } else if (salary === 2) {
        return '低于2K';
      } else if (salary === 3) {
        return '2-3K';
      } else if (salary === 4) {
        return '3-4.5K';
      } else if (salary === 5) {
        return '4.5-6K';
      } else if (salary === 6) {
        return '6-8K';
      } else if (salary === 7) {
        return '8-10K';
      } else if (salary === 8) {
        return '10-15K';
      } else if (salary === 9) {
        return '15-20K';
      } else if (salary === 10) {
        return '20-30K';
      } else if (salary === 11) {
        return '30-40K';
      } else if (salary === 12) {
        return '40-50K';
      } else if (salary === 13) {
        return '50K以上';
      }
    },
    educationFilter(education) {
      if (education === 1) {
        return '初中及以下';
      } else if (education === 2) {
        return '高中/中技/中专';
      } else if (education === 3) {
        return '大专';
      } else if (education === 4) {
        return '本科';
      } else if (education === 5) {
        return '硕士';
      } else if (education === 6) {
        return '博士';
      }
    },
    jobFilter(year) {
      if (year === 1) {
        return '有无经验均可';
      } else if (year === 2) {
        return '1-3年';
      } else if (year === 3) {
        return '3-5年';
      } else if (year === 4) {
        return '5-10年';
      } else if (year === 5) {
        return '10年以上';
      }
    },
    jobStatue(status) {
      return status === 0 ? '全职' : '兼职';
    },
  },
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
      .descripe{
        font-weight: 600;
        .salary{
          margin-right: 12px;
          color: $color-main;
          font-size: 18px;
        }
        .prop{
          color: #333333;
        }
        .line{
          display: inline-block;
          border-right: 1px solid #333333;
          line-height: 16px;
          vertical-align: middle;
        }
      }
      .need span{
        display: inline-block;
        vertical-align: middle;
        color: #333333;
        line-height: 32px;
        &.iconfont{
          margin-right: 6px;
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
