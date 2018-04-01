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
          <h1 class='title'>邮箱激活验证</h1>
        </div>
        <div class='body'>
          <p class='tip'>
            <span class='title'>您正在激活邮箱验证</span>
          </p>
          <p class='options'>
            <el-button class='self' size='mini' @click='back("/navigator/personal/info/account")'>返回</el-button>
            <el-button class='index' size='mini' @click='confirmActive'>确认激活</el-button>
          </p>
          <!-- 提交成功的弹出组件 -->
          <SubmitSuccess v-if='submitSuccessFlag' @close='submitSuccessFlag = false;' class='submit-success' :tipsMsg='tips.tipsMsg' :duration='tips.duration'></SubmitSuccess>
        </div>
      </div>
    </el-main>
    <el-footer>
      <p>版权所有：深圳天安智慧园区运营有限公司</p>
      <p>ICP备案序号：粤ICP备08016570号</p>
    </el-footer>
  </el-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import deepcopy from '@/utils/deepcopy';

export default {
  data() {
    return {
      submitSuccessFlag: false,
      tips: {
        title: '提示',
        tipsMsg: '提交成功！等待企业与您联系。',
        duration: 1000,
      },
    };
  },
  methods: {
    ...mapMutations(['change_user']),
    back(path) {
      this.$router.push({ path: path, });
    },
    confirmActive() {
      let url = location.search.substr(1);
      const argusArr = url.split('&');
      const code = argusArr[0].split('=');
      this.activeHttp(decodeURIComponent(code[1]));
    },
    activeHttp(code) {
      this.$http.post(`${this.URL_PREFIX}/app/activat/user/send/email`, {
        randCode: code,
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.tips.tipsMsg = '邮箱验证成功';
          setTimeout(() => {
            this.$router.push('/navigator/personal/info/account');
          }, 1500);
          let newuser = deepcopy(this.user);
          newuser.userEmail = res.resData.email;
          this.change_user(newuser);
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
  created() {
    
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
      .body{
        position: relative;
        text-align: center;
        padding: 60px 0;
        .tip{
          .logo, .title{
            display: inline-block;
            vertical-align: middle;
          }
          .title{
            margin-left: 12px;
            font-size: 18px;
            font-weight: 600;
          }
        }
        .options{
          margin-top: 40px;
          .self{
            background: #FF4500;
            border-color: #FF4500;
            color: #ffffff;
          }
          .self:hover{
            background: #ffffff;
            border-color: #FF4500;
            color: #FF4500;
          }
          .index{
            border-color: #FF4500;
            color: #FF4500;
          }
          .index:hover{
            background: #FF4500;
            border-color: #FF4500;
            color: #ffffff;
          }
        }
        .submit-success{
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }
  }
</style>

