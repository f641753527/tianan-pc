<template>
  <el-form ref="registuser" :model="user" class='regist_form' :rules="registRules" label-width="100px">
    <el-form-item prop='mobile' label="手机号">
      <el-input placeholder="请填写手机号" v-model="user.mobile"></el-input>
    </el-form-item>
    <el-form-item  prop="accessCode" class="access_code" label='验证码'>
      <template slot-scope="scope">
          <el-input v-model="user.accessCode"></el-input>
          <el-button @click="sendAccessCode" :disabled="!stop">{{access_msg}}</el-button>
      </template>
    </el-form-item>
    <el-form-item prop='password1' label="新密码">
      <el-input placeholder="请填写密码" v-model="user.password1" type='password'></el-input>
    </el-form-item>
    <el-form-item prop='password2' label="确认密码">
      <el-input placeholder="请再次填写密码" v-model="user.password2" type='password'></el-input>
    </el-form-item>
    <el-form-item>
      <el-button class='next_step' @click="next">确  定</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
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
        accessCode: '',
        password1: '',
        password2: '',
      },
      registRules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' },
        ],
        accessCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
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
      },
      timer: 60,  // 默认倒数60秒
      stop: true,  // 默认是停止的
      Interval: null, // setInterval的对象
    };
  },
  methods: {
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
          smsType: 3,
        }).then((response) => {
          const res = response.data;
          if (res.resCode !== '10000') {
            this.$emit('error', res.resDesc);
          }
        });
      });
    },
    next() {
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
      this.$http.post(`${this.URL_PREFIX}/app/modify/back/user/info/password`, {
        userMobile: this.user.mobile,
        loginPassword: this.MD5(this.user.password1),
        smsCode: this.user.accessCode,
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.$router.push({ path: '/auth/findPassSuccess', });
        } else {
          this.$emit('error', res.resDesc);
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
  .regist_form{
    padding: 20px 0 40px 0;
    .el-form-item{
      max-width: 440px;
      margin: 30px auto;
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
    }
    .next_step{
      width: 100%;
      background: #d0011b;
      color: #ffffff;
      font-size: 16px;
    }
  }
</style>

