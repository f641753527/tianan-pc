<template>
  <el-container>
    <el-header>
      <div class='logo'>
        <router-link to="/navigator">
          <img class='avatar' src='@/static/image/logo.png'/>
        </router-link>
      </div>
    </el-header>
    <el-main>
      <div class='regist_body'>
        <div class='header'><h1 class='title'>找回密码</h1><router-link class='backToLogin' to='/auth/login'>返回登录</router-link></div>
        <Step1 @resetPass='resetPass' @error='error'></Step1>
        <SubmitSuccess :title='tips.title' :tipsMsg='tips.tipsMsg' class='prompt-pane' v-if='submitSuccessFlag' @close='submitSuccessFlag=false'></SubmitSuccess>
      </div>
    </el-main>
    <el-footer>
      <p>版权所有：深圳天安智慧园区运营有限公司</p>
      <p>ICP备案序号：粤ICP备08016570号</p>
    </el-footer>
  </el-container>
</template>

<script>
import Step1 from './child/Step1';

export default {
  data() {
    return {
      submitSuccessFlag: false,
      tips: {
        title: '提示',
        tipsMsg: '验证码发送成功',
      },
    };
  },
  methods: {
    resetPass() {
      this.$router.push('/navigator');
    },
    // 错误弹窗提示
    error(msg) {
      this.tips.tipsMsg = msg;
      this.submitSuccessFlag = true;
    },
  },
  components: { Step1 },
};
</script>

<style lang='scss' scoped>
  /* reset */
  .el-container {
    min-height: 100%;
  }
  .el-header, .el-footer {
    background-color: rgba(0, 0, 0, 0.87843137254902);
    color: #fff;
    line-height: 60px;
  }
  .el-main {
    padding: 0;
    background-color: #f6f6f6;
    color: #333;
  }
  .el-footer {
    text-align: center;
  }
  /* 页面样式 */
  .el-header{
    .logo{
      max-width: 1200px;
      margin: 0 auto;
      height: 100%;
      a{
        color: #fff;
        .avatar{
          height: 100%;
        }
      }
    }
  }
  .el-main{
    .regist_body{
      position: relative;
      max-width: 1200px;
      min-height: 500px;
      margin: 60px auto;
      background: #ffffff;
      .header{
        padding: 0 40px;
        height: 68px;
        line-height: 68px;
        border-bottom: 1px solid #c4c4c4;
        .title{
          float: left;
        }
        .backToLogin{
          float: right;
          color: #666666;
        }
        .backToLogin:hover{
          text-decoration: underline;
        }
      }
      .prompt-pane{
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
</style>

