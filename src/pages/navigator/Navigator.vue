<template>
  <el-container>
    <el-header>
      <div class="align-center-main center-bar">
        <router-link to="/">
          <h1>
          天安智慧云
          <img src="../../static/image/logo.png" alt="">
        </h1>
        </router-link>
        <nav>
          <router-link to="/navigator">首页</router-link>
          <router-link to="/navigator/notifications">园区通知</router-link>
          <router-link :to="{ path: '/navigator/parkCompleteSet', query: { serviceId: 1006 } }">园区配套服务</router-link>
          <router-link :to="{ path: '/navigator/bbs', query: { serviceId: 1008 } }">天安微社区</router-link>
          <router-link :to="{ path: '/navigator/shops' }">天安商城</router-link>
        </nav>

         <!-- 园区列表 -->
         <!-- <el-dropdown class="parkDropdown">
           <p>
            <img :src="parkInfo.logoIcon" alt="" class="iconImg">
            <span>{{  parkInfo.parkName }}</span>
           </p>
          <el-dropdown-menu slot="dropdown">
             <el-dropdown-item @click.native="changeCorp(item)" v-for="(item,index) in parkList" :key="index">
               <img :src="item.logoIcon" alt="" class="iconImg">
               {{ item.parkName }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->

        <div class="login" v-if='!token'>
          <router-link to="/auth/regist">注册</router-link>
          <router-link to="/auth/login">登录</router-link>
        </div>


        <!-- 个人中心 -->
        <el-dropdown class='dropdown' v-else @command="handleCommand">
          <span class="el-dropdown-link" @click.stop='toPersonal'>
            {{ user.userNick || user.userMobile }}-个人中心<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
           <el-dropdown-menu slot="dropdown">
             <el-dropdown-item v-if='user.bindParkInfo && user.bindParkInfo.length' command="park">园区后台</el-dropdown-item>
             <el-dropdown-item v-if='user.bindCorpInfo && user.bindCorpInfo.parkId' command="corp">企业后台</el-dropdown-item>
             <el-dropdown-item command="logout">退出登录</el-dropdown-item>
           </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-main>
      <router-view></router-view>
    </el-main>
    <Footer></Footer>
      <!-- 消息弹框 -->
    <SubmitSuccess v-if='submitSuccessFlag' @close='submitSuccessFlag = false;' class='submit-success' :tipsMsg="tipsMsg"></SubmitSuccess>

  </el-container>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import apiUrl from '@/static/backstageUrl';
import Footer from '../../components/Footer';

export default {
  data() {
    return {
      submitSuccessFlag: false,
      tipsMsg: '登陆状态已失效，请重新登陆',
      parkList: [],
    }
  },
  methods: {
    ...mapMutations(['change_token', 'change_user', 'change_parkInfo', 'change_parkIdList']),
    handleCommand(command) {
      let token = encodeURIComponent(this.token);
      switch(command) {
        case 'park':
          window.open(`${apiUrl.parkUrl}/#/user?token=${token}&park_id=${this.parkIdList[0]}`);
          break;
        case 'corp':
          window.open(`${apiUrl.corpUrl}/#/usertoken?token=${token}&park_id=${this.user.bindCorpInfo.parkId}&corp_id=${this.user.bindCorpInfo.corpId}`);
          break;
        case 'logout':
          this.change_token();
          this.change_user();
          this.$router.push({ path: '/auth/login' });
          break;
      }
    },
    toPersonal() {
      this.$router.push({ path: '/navigator/personal/info', });
    },
    getUserInfo() {  // 获取用户详情
      this.$http.post(`${this.URL_PREFIX}/app/get/user/info/detail`, {
      }, {
        headers: { token: this.token, },
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.change_user(res.resData);
        }
      });
    },
    changeCorp(item) {
      this.change_parkInfo(item);
      this.change_parkIdList(item.parkId);
      this.$router.go(0);
    },
    getParks(index) {
      this.$http.post(`${this.URL_PREFIX}/app/get/park/info/list`, {
      }, {
        headers: { token: this.token, },
      }).then((response) => {
        const res = response.data;
        // console.log(res);
        if (res.resCode === '10000') {
          this.parkList = res.resData.pageList ? res.resData.pageList : [];
        }
      });
    },
  },
  components: {
    Footer
  },
  computed: {
    ...mapGetters(['token', 'user', 'parkIdList', 'parkInfo']),
  },
  mounted() {
    this.getUserInfo();
    // this.getParks();
    this.$root.eventHub.$on('clearToken', (errMsg) => {
      this.$store.commit('change_token', '');
      if (errMsg !== 'qiniu') {
        this.submitSuccessFlag = true;
      }
    });
  }
}
</script>



<style scoped lang="scss">
  .el-header {
    background-color: rgba(0, 0, 0, 0.87843137254902);
    color: #fff;
    line-height: 60px;
    padding: 0;
  }
  .el-header {
    a {
      color: #fff;
      text-align: center;
      &:hover{
        background-color: #fff;
        color: rgba(0, 0, 0, 0.87843137254902);
      }
    }
    nav{
      a {
        width: 120px;
        float: left;
      }
    }
    .login {
      a{
        float: right;
        width: 50px;
      }
    }
  }

  .el-main {
    background-color: #f6f6f6;
    color: #333;
    padding: 0;
  }

  .el-container {
    min-width: 1200px;
    min-height: 100%;
  }

.el-carousel-item {
  height: 500px;
}
  h1 {
    float: left;
    width: 210px;
    height: 60px;
    font-size: 0;
  }
  img {
    height: 100%;
    width: 100%;
  }

  .center-bar{
    position: relative;
    .dropdown{
      position: absolute;
      right: 0;
      cursor: pointer;
      color: #FFFFFF;
      .el-dropdown-link{
        float: left;
        height: 100%;
      }
    }
  }

.parkDropdown {
  margin-left: 20px;
  padding: 0 20px;
  cursor: pointer;
  p {
    color: #fff;
    font-size: 12px;
  }
}
.el-dropdown-menu__item {
  height: 36px;
  display: flex;
  align-items: center;
}
.iconImg {
  width: 16px;
  height: 16px;
  margin-right: 4px;
  vertical-align: middle;
}

.submit-success {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
