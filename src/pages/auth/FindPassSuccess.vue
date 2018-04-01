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
          <h1 class='title'>找回密码</h1>
          <router-link class='backToLogin' to='/auth/login'>已有账号，去登录</router-link>
        </div>
        <div class='body'>
          <p class='tip'>
            <img class='logo' src='./images/u223.png'/>
            <span class='title'>恭喜，密码已经重置！</span>
          </p>
          <p class='options'>
            <el-button class='self' size='mini' @click='back("/auth/login")'>返回登录</el-button>
            <el-button class='index' size='mini' @click='back("/navigator")'>首页</el-button>
          </p>
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
export default {
  data() {
    return {
    };
  },
  methods: {
    back(path) {
      this.$router.push({ path: path, });
    },
  },
  computed: {
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
      }
    }
  }
</style>

