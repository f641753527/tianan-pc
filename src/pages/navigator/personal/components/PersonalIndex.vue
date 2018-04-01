<template>
  <div class='personal'>
    <div class='left-info'>
      <div class='top-avatar'>
        <p class="avatar-wrap"><img class='avatar' :src='user.userIcon'/></p>
        <p class='username'>{{user.userMobile}}</p>
      </div>
      <div class='bottom-links'>
        <router-link to='/navigator/personal/info'>个人中心</router-link>
        <router-link to='/navigator/personal/info/orders'>订单管理</router-link>
        <router-link to='/navigator/personal/info/account'>账户管理</router-link>
      </div>
    </div>
    <div class='right-view'>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return {
      user: {},
    };
  },
  methods: {
    ...mapMutations(['change_user']),
    getUserInfo() {
      this.$http.post(`${this.URL_PREFIX}/app/get/user/info/detail`, {}, {
        headers: {
          token: this.token,
        },
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.user = res.resData;
          this.change_user(res.resData);
        }
      });
    },
  },
  computed: {
    ...mapGetters(['token']),
  },
  created() {
    this.getUserInfo();
  },
};
</script>

<style lang="scss" scoped>
@import '~@scss';
.personal{
  @include clear-float;
  padding: 50px 0;
  .left-info{
    padding: 20px;
    float: left;
    width: 240px;
    box-sizing: border-box;
    background: #FFF;
    .top-avatar{
      box-sizing: border-box;
      border-bottom: 1px solid #e4e4e4;
      .avatar-wrap{
        text-align: center;
        .avatar{
          margin: 0 auto;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: none;
          vertical-align: top;
        }
      }
      .username{
        margin: 20px 0;
        font-size: 16px;
        color: #333333;
        font-weight: 600;
        text-align: center;
      }
    }
    .bottom-links{
      padding: 20px 0;
      a{
        display: block;
        text-align: center;
        font-size: 16px;
        font-weight: 600;
        color: #333333;
        line-height: 48px;
        &.router-link-exact-active{
          background: #f4f4f4;
          color: #d9262c;
        }
      }
    }
  }
  .right-view{
    position: relative;
    float: right;
    width: 940px;
    // height: 600px;
    .prompt-pane{
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
}
</style>

