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
      <div class='login_body'>
        <el-form ref="user" :model="user" class='login_form' :rules="loginRules">
          <el-form-item>
            <h1>登录</h1>
          </el-form-item>
          <el-form-item prop='mobile'>
            <el-input placeholder="手机号" v-model="user.mobile"><i slot="prefix" class="iconfont icon-houtaiguanli"></i></el-input>
          </el-form-item>
          <el-form-item prop='password'>
            <el-input placeholder="密码" prefix-icon="el-icon-search" v-model="user.password" type='password'></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class='login' @click="login">登  录</el-button>
          </el-form-item>
        </el-form>
        <p class='links'>
          <router-link to='/auth/forgetPass'>忘记密码</router-link>
          <router-link to='/auth/regist'>免费注册</router-link>
        </p>
      </div>
      <SubmitSuccess :title='tips.title' :tipsMsg='tips.tipsMsg' class='prompt-pane' v-if='submitSuccessFlag' @close='submitSuccessFlag=false'></SubmitSuccess>
    </el-main>
    <el-footer>
      <p>版权所有：深圳天安智慧园区运营有限公司</p>
      <p>ICP备案序号：粤ICP备08016570号</p>
    </el-footer>
  </el-container>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  data() {
    const validateMobile = (rule, value, callback) => {
      if (!value) {
        return;
      }
      if (!/^1[3|4|5|7|8|9][0-9]\d{8}$/.test(value)) {
        callback(new Error('手机号错误!'));
      } else {
        callback();
      }
    };
    return {
      user: {
        mobile: '',
        password: '',
      },
      loginRules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, message: '密码长度至少8位', trigger: 'blur' }
        ],
      },
      submitSuccessFlag: false,
      tips: {
        title: '提示',
        tipsMsg: '验证码发送成功',
      },
    };
  },
  methods: {
    ...mapMutations(['change_token', 'change_user']),
    login() {
      this.$refs.user.validate((valid) => {
        if (valid) {
          this.loginHttp();
        } else {
          return false;
        }
      });
    },
    // httpRequest
    loginHttp() {
      this.$http.post(`${this.URL_PREFIX}/app/user/login`, {
        loginName: this.user.mobile,
	      loginPassword: this.MD5(this.user.password),
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.change_token(res.resData.token);
          this.change_user(res.resData);
          this.$router.push({ path: '/navigator', });
        } else {
          this.tips.tipsMsg = res.resDesc;
          this.submitSuccessFlag = true;
        }
      });
    },
  }
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
    min-height:840px;  
    height:840px;  
    height:auto !important;
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
    position: relative;
    background: url('./images/login_body.png') no-repeat center center;
    .login_body{
      position: absolute;
      box-sizing: border-box;
      padding: 40px;
      width: 400px;
      min-height: 400px;
      top: 50%;
      right: 280px;
      transform: translate(0, -50%);
      background: #ffffff;
      .login_form{
        .el-form-item{
          &:nth-of-type(3){
            margin-top: 40px;
          }
          &:nth-of-type(4){
            margin-top: 40px;
          }
          .iconfont{
            color: #c0c4cc;
          }
        }
        .login{
          width: 100%;
          background: #d0011b;
          color: #ffffff;
          font-size: 16px;
        }
      }
      .links{
        a{
          float: right;
          margin-left: 12px;
          color: #666666;
        }
        a:hover{
          text-decoration: underline;
        }
      }
    }
    .prompt-pane{
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  /* 小屏将logo居中 */
@media screen and (max-width: 1200px) {
  .el-main{
    .login_body{
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
@media screen and (max-width: 400px) {
  .el-main{
    .login_body{
      left: 50%;
      width: 80%;
      transform: translate(-50%, -50%);
    }
  }
}
@media screen and (max-height: 600px){
  .el-main{
    .login_body{
      top: 60px;
      margin-bottom: 100px;
    }
  }
}
@media screen and (max-height: 600px) and (min-width: 1200px) {
  .el-main{
    .login_body{
      transform: translate(0, 0);
    }
  }
}
@media screen and (max-height: 600px) and (max-width: 1200px) {
  .el-main{
    .login_body{
      transform: translate(-50%, 0);
    }
  }
}
@media screen and (max-height: 600px) and (max-width: 400px) {
  .el-main{
    .login_body{
      transform: translate(-50%, 0);
    }
  }
}
</style>

