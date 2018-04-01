<template>
  <div class='info'>
    <div class='top-rights'>
      <h1 class='title'>园区用户专享特权</h1>
      <ul class='rights'>
        <li @click.stop='getRightDetail(1)'>
          <p class='icon'><i class='iconfont icon-VIPquanyi'></i></p>
          <p class='right-name'>VIP权益</p>
        </li>
        <li @click.stop='getRightDetail(2)'>
          <p class='icon'><i class='iconfont icon-zhuanshufuli'></i></p>
          <p class='right-name'>专享福利</p>
        </li>
        <li @click.stop='getRightDetail(3)'>
          <p class='icon'><i class='iconfont icon-huoqurenmai'></i></p>
          <p class='right-name'>获取人脉</p>
        </li>
      </ul>
    </div>
    <div class='bottom-info'>
      <div class='header'>
        <h3 class='title'>我的名片</h3>
        <span class='edit' @click='editCard'>编辑</span>
      </div>
      <div class='info_body'>
        <p class='main_info'>
          <span class='info_name'>{{card.name}}&nbsp;</span>
          <span class='info_position'>{{card.position}} &nbsp;</span>
        </p>
        <p class='mobile'>{{card.phone}} &nbsp;</p>
        <p class='company'>{{card.corpName}} &nbsp;</p>
        <p class='tel'>TEL: {{card.tel}}</p>
        <p class='email'>Email: {{card.email || ''}}</p>
        <p class='address'>ADDR: {{card.address}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';

export default {
  data() {
    return {
      card: {},
    };
  },
  methods: {
    ...mapMutations(['change_userTab']),
    getRightDetail(type) {
      this.$router.push({ path: `/navigator/personal/rightsDetail/${type}` });
    },
    editCard() {
      this.change_userTab('2');
      this.$router.push({ path: '/navigator/personal/info/account', });
    },
    getUserInfo() {
      this.$http.post(`${this.URL_PREFIX}/app/get/user/info/detail`, {}, { headers: { token: this.token } }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.card = res.resData.userCardInfo;
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
.info{
  .top-rights{
    padding: 20px;
    background: #ffffff;
    .title{
      margin-bottom: 16px;
      font-size: 16px;
      color: #333333;
      font-weight: 600;
    }
    .rights{
      @include clear-float;
      li{
        float: left;
        width: 280px;
        height: 202px;
        border: 1px solid #c8c8c8;
        margin-right: 27px;
        cursor: pointer;
        &:last-of-type{
          margin-right: 0;
        }
        .icon{
          margin-top: 20px;
          text-align: center;
          .iconfont{
            font-size: 52px;
            color: #ff6666;
          }
        }
        &:nth-of-type(2) .iconfont{
          color: #00ccff;
        }
        .right-name{
          margin-top: 10px;
          text-align: center;
          font-weight: 600;
          font-size: 14px;
          color: #333333;
        }
      }
    }
  }
  .bottom-info{
    position: relative;
    padding: 20px;
    margin-top: 20px;
    background: #ffffff;
    height: 300px;
    .header{
      @include clear-float;
      color: #333333;
      .title{
        float: left;
        font-size: 16px;
        font-weight: 600;
      }
      .edit{
        float: right;
        cursor: pointer;
        font-size: 12px;
        color: #555555;
      }
    }
    .info_body{
      position: absolute;
      padding: 30px 0;
      box-sizing: border-box;
      left: 237px;
      top: 54px;
      width: 406px;
      height: 234px;
      box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.1);
      .main_info{
        padding-left: 40px;
        line-height: 40px;
        .info_name{
          margin-right: 12px;
          font-size: 16px;
          color: #333333;
          font-weight: 600;
        }
        .info_position{
          color: #8c8c8c;
          font-size: 12px;
        }
      }
      .mobile{
        padding-left: 40px;
        margin-bottom: 16px;
        color: #8c8c8c;
        font-size: 14px;
      }
      .company{
        padding-left: 40px;
        margin-bottom: 12px;
        background: #f44336;
        line-height: 36px;
        color: #fff;
      }
      .tel, .email, .address{
        padding-left: 40px;
        color: #bcbcbc;
        line-height: 18px;
      }
    }
  }
}
</style>

