<template>
  <div class='third'>
    <div class='phone'>已绑定手机号：{{user.userMobile}}</div>
    <div class='email'>
      <p class='first'>邮箱：
        <span v-if='user.newuser'>{{user.newuser}}</span>
        <span v-else>未绑定</span>
        <el-button size='small' v-if='!user.newuser' @click='bindEmail'>绑定</el-button>
      </p>
      <p class='second'>绑定邮箱可用于接收系统发送的通知邮件或其它安全验证</p>
    </div>
    <div class='corps'>
      <p>已绑定的平台/园区/企业：</p>
      <!-- 企业 -->
      <p class='bind_corp' v-show='user.bindCorpInfo.corpNameAcronym'>
         <span>{{user.bindCorpInfo.corpNameAcronym}}</span>
         <el-button size='small' @click='unBindCrop(user.bindCorpInfo.corpId)'>解绑</el-button>
      </p>

      <!-- 园区 -->
      <div class="park" v-show='user.bindParkInfo.length'>
        <p class='bind_park' v-for="(park, index) in user.bindParkInfo" :key='index'>
          <span>{{park.parkNameAcronym}}</span>
          <el-button size='small' @click='unBindPark(park.parkId, index)'>解绑</el-button>
        </p>
      </div>

      <!-- 平台 -->
      <p class='bind_paltform' v-show='user.platformManagerFlag === 1'>
         <el-button size='small' @click='unBindPlatform'>解绑平台</el-button>
      </p>

    </div>
    <div class='password'>
      <p>修改密码</p>
      <el-form ref="registuser" :model="pass" class='regist_form' :rules="registRules" label-width="100px" size='small'>
        <el-form-item prop='password' label="当前密码">
          <el-input placeholder="请填写密码" v-model="pass.password" type='password'></el-input>
        </el-form-item>
        <el-form-item prop='password1' label="新密码">
          <el-input placeholder="请填写密码" v-model="pass.password1" type='password'></el-input>
        </el-form-item>
        <el-form-item prop='password2' label="确认密码">
          <el-input placeholder="请再次填写密码" v-model="pass.password2" type='password'></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class='modify' @click="modify">确认修改</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 提交成功的弹出组件 -->
    <SubmitSuccess v-if='submitSuccessFlag' @close='submitSuccessFlag = false;' class='submit-success' :tipsMsg='tips.tipsMsg' :duration='tips.duration'></SubmitSuccess>
    <!-- 绑定邮箱 -->
    <div class='mask' v-show='showMaskFlag'>
      <div class='container'>
        <el-form ref="call" :rules="emailRules" :model="call" class='call_form' label-width='80px' size='small'>
          <el-form-item>
            <h1>绑定邮箱</h1>
          </el-form-item>
          <el-form-item label='邮箱' prop='email'>
            <el-input v-model="call.email"></el-input>
          </el-form-item>
          <el-form-item class='btngroup'>
            <el-button size='mini' class='cancel' @click='cancelbindEmail'>取消</el-button>
            <el-button size='mini' class='confirm' @click='submitBindEmail'>提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import deepcopy from '@/utils/deepcopy';

export default {
  data() {
    const validatePass = (rule, value, callback) => {
      const valid = /^(\w){8,}$/.test(value);
      if (value && !valid) {
        callback(new Error('密码仅接收数字、字母、下划线'));
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
        if (this.pass.password2 !== '') {
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
      } else if (value !== this.pass.password1) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    const validateEmail = (rule, value, callback) => {
      if (value && !/^[A-Za-z1-9]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]{2,}[-.])+[A-Za-z\d]{2,5}([-.][A-Za-z\d]{2,})*$/.test(value)) {
        callback(new Error('邮箱格式错误!'));
      } else {
        callback();
      }
    };
    return {
      pass: {
        password: '',
        password1: '',
        password2: '',
      },
      registRules: {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, message: '密码至少8位', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' },
        ],
        password1: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, message: '密码至少8位', trigger: 'blur' },
          { validator1: validatePass, trigger: 'blur' },
        ],
        password2: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, message: '密码至少8位', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' },
        ],
      },
      emailRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' },
        ],
      },
      submitSuccessFlag: false,
      tips: {
        title: '提示',
        tipsMsg: '提交成功！等待企业与您联系。',
        duration: 2000,
      },
      showMaskFlag: false,
      call: {
        email: '',
      },
    };
  },
  methods: {
    ...mapMutations(['change_user']),
    modify() {
      this.$refs.registuser.validate((valid) => {
        if (valid) {
          this.modifyHttp();
        } else {
          return false;
        }
      });
    },
    modifyHttp() {
      this.$http.post(`${this.URL_PREFIX}/app/modify/user/info/password`, {
        oldPassword: this.MD5(this.pass.password),
        newPassword: this.MD5(this.pass.password1),
      }, {
        headers: { token: this.token },
      }).then((response) => {
        const res = response.data;
        this.submitSuccessFlag=true;
        if (res.resCode === '10000') {
          this.tips.tipsMsg = '密码修改成功';
        } else {
          this.tips.tipsMsg = res.resDesc;
        }
        this.$refs.registuser.resetFields();
      });
    },
    bindEmail() {
      this.showMaskFlag = true;
    },
    cancelbindEmail() {
      this.resetEmail();
    },
    submitBindEmail() {
      this.$refs.call.validate((valid) => {
        if (valid) {
          this.conformBindEmail();
        } else {
          return false;
        }
      });
    },
    conformBindEmail() {
      this.$http.post(`${this.URL_PREFIX}/app/added/user/send/email`, {
        ...this.call,
      }, {
        headers: { token: this.token },
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.tips.tipsMsg = '验证链接已发送至邮箱，请登录邮箱完成验证！';
        } else {
          this.tips.tipsMsg = res.resDesc;
        }
        this.submitSuccessFlag=true;
      });
      this.resetEmail();
    },
    resetEmail() {
      this.showMaskFlag = false;
      this.$refs.call.resetFields();
    },
    // 解绑企业
    unBindCrop(id) {
      this.$http.post(`${this.URL_PREFIX}/app/unbind/user/info/manage`, {
        type: 3,
        corpId: id,
      }, {
        headers: { token: this.token },
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.tips.tipsMsg = '解绑成功';
          this.user.bindCorpInfo = {};
          const user = deepcopy(this.user);
          user.bindCorpInfo = {};
          this.change_user(user);
        } else {
          this.tips.tipsMsg = res.resDesc;
        }
        this.submitSuccessFlag=true;
      });
    },
    // 解绑园区
    unBindPark(id, index) {
      this.$http.post(`${this.URL_PREFIX}/app/unbind/user/info/manage`, {
        type: 2,
        parkId: id,
      }, {
        headers: { token: this.token },
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.tips.tipsMsg = '解绑成功';
          this.user.bindParkInfo.splice(index, 1);
          this.change_user(this.user);
        } else {
          this.tips.tipsMsg = res.resDesc;
        }
        this.submitSuccessFlag=true;
      });
    },
    // 解绑平台
    unBindPlatform() {
      this.$http.post(`${this.URL_PREFIX}/app/unbind/user/info/manage`, {
        type: 1,
      }, {
        headers: { token: this.token },
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.tips.tipsMsg = '解绑成功';
          this.user.platformManagerFlag = 2;
          this.change_user(this.user);
        } else {
          this.tips.tipsMsg = res.resDesc;
        }
        this.submitSuccessFlag=true;
      });
    },
  },
  computed: {
    ...mapGetters(['user', 'token']),
  },
};
</script>

<style lang="scss" scoped>
@import '~@scss';
.third{
  padding: 30px;
  .phone{
    color: #333333;
    line-height: 48px;
    border-bottom: 1px solid #f2f2f2;
  }
  .email{
    padding: 30px 0;
    border-bottom: 1px solid #f2f2f2;
    color: #333333;
    .first{
      position: relative;
      font-weight: 500;
      line-height: 32px;
      .el-button{
        position: absolute;
        right: 0;
        top: 5px;
        padding: 4px 8px;
        font-size: 12px;
        background: #d0011b;
        color: #ffffff;
      }
    }
    .second{
      font-size: 12px;
      color: #666666;
    }
  }
  .corps{
    padding: 30px 0;
    border-bottom: 1px solid #f2f2f2;
    .bind_corp{
      position: relative;
      font-weight: 500;
      line-height: 32px;
      .el-button{
        position: absolute;
        right: 0;
        top: 5px;
        padding: 4px 8px;
        font-size: 12px;
        background: #d0011b;
        color: #ffffff;
      }
    }
    .bind_park{
      position: relative;
      font-weight: 500;
      line-height: 32px;
      .el-button{
        position: absolute;
        right: 0;
        top: 5px;
        padding: 4px 8px;
        font-size: 12px;
        background: #d0011b;
        color: #ffffff;
      }
    }
    .bind_paltform{
      position: relative;
      line-height: 32px;
      height: 32px;
      .el-button{
        position: absolute;
        right: 0;
        top: 5px;
        padding: 4px 8px;
        font-size: 12px;
        background: #d0011b;
        color: #ffffff;
      }
    }
  }
  .password{
    padding-top: 30px;
    p{
      line-height: 48px;
      color: #333333;
    }
    .modify{
      background: #d0011b;
      color: #ffffff;
    }
  }
  .submit-success{
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
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
</style>

