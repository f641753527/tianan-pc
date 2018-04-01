<template>
  <div class='mask'>
    <div class='login_body'>
      <p class='close_bar'><span class='icon el-icon-close' @click='close'></span></p>
      <p class='switch'>
        <span :class="{'active': isLogin}" @click='isLogin=true;'>登录</span>
        <span>&nbsp;</span>
        <span :class="{'active': !isLogin}" @click='isLogin=false;'>注册</span>
      </p>
      <el-form v-show='isLogin' ref="user" :model="loginuser" class='login_form' :rules="loginRules">
        <el-form-item prop='mobile'>
          <el-input placeholder="手机号" v-model="loginuser.mobile"><i slot="prefix" class="iconfont icon-houtaiguanli"></i></el-input>
        </el-form-item>
        <el-form-item prop='password'>
          <el-input placeholder="密码" prefix-icon="el-icon-search" v-model="loginuser.password" type='password'></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class='login' @click="login">登  录</el-button>
        </el-form-item>
      </el-form>
      <!-- 注册 -->
      <el-form v-show='!isLogin' ref="registuser" :model="resistuser" size='small' class='regist_form' :rules="registRules">
        <el-form-item prop='mobile'>
          <el-input placeholder="请填写手机号" v-model="resistuser.mobile"></el-input>
        </el-form-item>
          <el-form-item prop='password1'>
          <el-input placeholder="请填写密码" v-model="resistuser.password1" type='password'></el-input>
        </el-form-item>  
        <el-form-item prop='password2'>
          <el-input placeholder="请再次填写密码" v-model="resistuser.password2" type='password'></el-input>
        </el-form-item> 
        <el-form-item  prop="accessCode" class="access_code">
          <template slot-scope="scope">
              <el-input v-model="resistuser.accessCode" placeholder="验证码"></el-input>
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
    </div>
   <SubmitSuccess :title='tips.title' :tipsMsg='tips.tipsMsg' class='prompt-pane' v-if='submitSuccessFlag' @close='submitSuccessFlag=false'></SubmitSuccess> 
  </div>  
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

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
    const validatePass1 = (rule, value, callback) => {
      const valid = /^(\w){8,}$/.test(value);
      if (value === '') {
        callback(new Error('请输入密码'));
      } else if (!valid) {
        callback(new Error('密码仅接收数字、字母、下划线'));
      } else {
        if (this.resistuser.password2 !== '') {
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
      } else if (value !== this.resistuser.password1) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {

      submitSuccessFlag: false,
      tips: {
        title: '提示',
        tipsMsg: '验证码发送成功',
      },

      isLogin: true,
      // 登录
      loginuser: {
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
      // 注册
      resistuser: {
        mobile: '',
        password1: '',
        password2: '',
        accessCode: '',
      },
      isAgreeUserprotocol: false,
      registRules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' },
        ],
        password1: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, message: '密码至少8位', trigger: 'blur' },
          { validator: validatePass1, trigger: 'blur' },
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
    };
  },
  methods: {
    ...mapMutations(['change_user', 'change_token']),
    // 登录

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
        loginName: this.loginuser.mobile,
	      loginPassword: this.MD5(this.loginuser.password),
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.change_token(res.resData.token);
          // this.change_user(res.resData);
          this.getUserInfo(res.resData.token);
          this.$emit('close');
        } else {
          this.tips.tipsMsg = res.resDesc;
          this.submitSuccessFlag = true;
        }
        this.$refs.user.resetFields();
      });
    },

    getUserInfo(token2) {  // 获取用户详情
      this.$http.post(`${this.URL_PREFIX}/app/get/user/info/detail`, {
        }, {
          headers: { token: token2 },
        }).then((response) => {
          const res = response.data;
          if (res.resCode === '10000') {
            this.change_user(res.resData);
          }
        });
      },

    // 注册

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
          userMobile: this.resistuser.mobile,
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
        userMobile: this.resistuser.mobile,
        loginPassword: this.MD5(this.resistuser.password1),
        smsCode: this.resistuser.accessCode,
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.tips.tipsMsg = '注册成功，请返回登录';
        } else {
          this.tips.tipsMsg = res.resDesc;
        }
        this.submitSuccessFlag = true;
        this.$refs.registuser.resetFields();
        this.isAgreeUserprotocol = false;
      });
    },

    // 关闭
    close() {
      this.$emit('close');
    },
  },
  computed: {
    access_msg() {
      return this.stop ? '发送验证码' : `${this.timer}秒后可重新发送`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@scss';
.mask{
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 200;
  background: rgba(7, 17, 27, 0.7);
  .login_body{
    position: absolute;
    min-width: 400px;
    min-height: 320px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: #ffffff;
    .close_bar{
      height: 48px;
      line-height: 48px;
      background: $color-main;
      text-align: right;
      .icon{
        margin-right: 12px;
        color: #fff;
        font-size: 20px;
        cursor: pointer;
      }
    }
    .switch{
      padding: 30px 30px 0 30px;
      height: 14px;
      line-height: 14px;
      span{
        display: inline-block;
        vertical-align: middle;
        color: #999999;
        cursor: pointer;
        &.active{
          color: $color-main;
        }
        &:nth-of-type(2) {
          border-right: 1px solid #999999;
        }
      }
    }
    .el-form{
      padding: 30px;
    }
    .login_form{
      .login{
        width: 100%;
        background: #d0011b;
        color: #ffffff;
        font-size: 16px;
      }
      .iconfont{
        color: #c0c4cc;
      }
    }
    .regist_form{
      min-height: 320px;
      .access_code{
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
      .regist{
        width: 100%;
        background: #d0011b;
        color: #ffffff;
        font-size: 16px;
      }
      .regist_disabled{
        background: #999999;
      }
    }
  }
  .prompt-pane{
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
