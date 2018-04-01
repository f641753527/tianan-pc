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
        <div class='header'>
          <h1 class='title'>注册新用户</h1>
          <router-link class='backToLogin' to='/auth/login'>已有账号，去登录</router-link>
        </div>
        <el-form ref="registuser" :model="user" class='regist_form' :rules="registRules" label-width="100px">
          <el-form-item prop='mobile' label="手机号">
            <el-input placeholder="请填写手机号" v-model="user.mobile"></el-input>
          </el-form-item>
          <el-form-item prop='password1' label="密码">
            <el-input placeholder="请填写密码" v-model="user.password1" type='password'></el-input>
          </el-form-item>
          <el-form-item prop='password2' label="确认密码">
            <el-input placeholder="请再次填写密码" v-model="user.password2" type='password'></el-input>
          </el-form-item>
          <el-form-item  prop="accessCode" class="access_code" label='验证码'>
            <template slot-scope="scope">
                <el-input v-model="user.accessCode"></el-input>
                <el-button @click="sendAccessCode" :disabled="!stop">{{access_msg}}</el-button>
            </template>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="isAgreeUserprotocol">
              <span class='agree'>已阅读,同意</span> 
              <el-button class='userprotocol' type='text'>《天安智慧云注册协议》</el-button></a>
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button class='regist' @click="regist" :disabled='!isAgreeUserprotocol' :class="{ 'regist_disabled' : !isAgreeUserprotocol }">注  册</el-button>
          </el-form-item>
        </el-form>
        <SubmitSuccess :title='tips.title' :duration='duration' :tipsMsg='tips.tipsMsg' class='prompt-pane' v-if='submitSuccessFlag' @close='submitSuccessFlag=false'></SubmitSuccess>
      </div>
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
        callback(new Error('手机号格式错误!'));
      } else {
        callback();
      }
    };
    const validatePass = (rule, value, callback) => {
      const valid = /^(\w){8,}$/.test(value);
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (!valid) {
        callback(new Error('密码仅接收数字、字母、下划线'));
      } else {
        if (this.user.password2 !== '') {
          this.$refs.registuser.validateField('password2');
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      const valid = /^(\w){8,}$/.test(value);
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (!valid) {
        callback(new Error('密码仅接收数字、字母、下划线'));
      } else if (value !== this.user.password1) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      user: {
        mobile: '',
        password1: '',
        password2: '',
        accessCode: '',
      },
      isAgreeUserprotocol: false,
      submitSuccessFlag: false,
      tips: {
        title: '提示',
        tipsMsg: '验证码发送成功',
      },
      registRules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' },
        ],
        password1: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, message: '密码至少8位', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' },
        ],
        password2: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, message: '密码至少8位', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' },
        ],
        accessCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
        ],
      },
      timer: 60,  // 默认倒数60秒
      stop: true,  // 默认是停止的
      Interval: null, // setInterval的对象
      duration: 1500,
    };
  },
  methods: {
    ...mapMutations(['change_token', 'change_user']),
    runTimer() {
      if (this.timer <= 0) {
        this.timer = 60;
        this.stop = true;
        clearInterval(this.Interval);
      } else {
        this.timer -= 1;
      }
    },
    startTimer() {
      // 如果是false就开始倒计时，如果是true就停止倒计时
      if (!this.stop) {
        this.Interval = setInterval(this.runTimer, 1000);
      } else {
        clearInterval(this.Interval);
      }
    },
    sendAccessCode() {
      this.$refs.registuser.validateField('mobile', (error) => {
        if (error) {
          return;
        }
        // 手机号正确的处理
        this.stop = false;
        this.startTimer();
        this.$http.post(`${this.URL_PREFIX}/app/added/user/send/sms`, {
          userMobile: this.user.mobile,
          smsType: 2,
        }).then((response) => {
          const res = response.data;
          if (res.resCode !== '10000') {
            this.tips.tipsMsg = res.resDesc;
            this.submitSuccessFlag = true;
          }
        });
      });
    },
    regist() {
      this.$refs.registuser.validate((valid) => {
        if (valid) {
          this.registHttp();
        } else {
          return false;
        }
      });
    },
    // httpRequest
    registHttp() {
      this.$http.post(`${this.URL_PREFIX}/app/user/register`, {
        userMobile: this.user.mobile,
        loginPassword: this.MD5(this.user.password1),
        smsCode: this.user.accessCode,
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.tips.tipsMsg = '注册成功，正在跳转到首页';
          this.submitSuccessFlag = true;
          setTimeout(() => {
            this.loginHttp();
          }, this.duration);
        } else {
          this.tips.tipsMsg = res.resDesc;
          this.submitSuccessFlag = true;
        }
      });
    },

    loginHttp() {
      this.$http.post(`${this.URL_PREFIX}/app/user/login`, {
        loginName: this.user.mobile,
	      loginPassword: this.MD5(this.user.password1),
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.change_token(res.resData.token);
          this.change_user(res.resData);
          this.$router.push({ path: '/navigator', });
        } else {
          this.tips.tipsMsg = res.resDesc;
          this.submitSuccessFlag = true;
          this.$router.push({ path: '/auth/registsuccess', });
        }
      });
    },
  },
  computed: {
    access_msg() {
      return this.stop ? '发送验证码' : `${this.timer}秒后可重新发送`;
    },
  },
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
      .regist_form{
        padding: 20px 0 40px 0;
        .el-form-item{
          max-width: 440px;
          margin: 20px auto;
          &.access_code{
            .el-form-item__content{
              .el-input{
                width: 100px;
              }
              .el-button{
                position: absolute;
                right: 0;
                bottom: 0;
              }
            }
          }
          .agree{
            color: #c4c4c4;
          }
          .userprotocol{
            color: #d0011b;
          }
          .regist_disabled{
            background: #999999;
          }
        }
        .regist{
          width: 100%;
          background: #d0011b;
          color: #ffffff;
          font-size: 16px;
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

