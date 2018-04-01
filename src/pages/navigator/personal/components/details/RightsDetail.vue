<template>
  <div class='detail'>
    <p class='header'>
      <router-link to='/navigator/personal/info' >个人中心</router-link> > {{right.title}}
    </p>
    <div class='right'>
      <p class='banner'><img :src='right.banner'></p>
      <div class='rich_text' v-html='right.content'></div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      type: '',
      right: {},
    };
  },
  methods: {
    getRightDetail() {
      this.$http.post(`${this.URL_PREFIX}/app/get/sys/service/info/detail`, {
        serviceId: this.type,
      }, {
        headers: { token: this.token, },
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.right = res.resData;
        } else {

        }
      });
    },
  },
  computed: {
    ...mapGetters(['token']),
  },
  created() {
    this.type = parseInt(this.$route.params.type, 10);
    this.getRightDetail();
  },
};
</script>

<style lang="scss" scoped>
  .detail {
    padding: 30px 0;
    .header{
      margin-bottom: 20px;
      a{
        color: #333333;
      }
      a:hover{
        text-decoration: underline;
        color: #999999;
      }
      font-size: 12px;
      line-height: 20px;
      color: #333333;
    }
    .right{
      .banner {
        margin-bottom: 20px;
        img{
          width: 750px;
          height: 210px;
        }
      }
      .rich_text{
        padding: 30px 40px;
        text-indent: 2em;
        background: #fff;
      }
    }
  }
</style>
