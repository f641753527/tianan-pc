<template>
  <div class='detail'>
    <!-- <p class='header'>
      <router-link to='/navigator' >首页</router-link> > 
      <router-link to='/navigator/notifications' >园区通知</router-link> > 详情
    </p> -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/navigator/notifications' }">园区通知</el-breadcrumb-item>
      <el-breadcrumb-item>详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div class='article' v-loading="loading">
      <p class='title'>{{ article.noticeTitle }}</p>
      <p class='date'>{{ article.createTime | DateFilter }}</p>
      <p class='text' v-html="article.noticeContent" ref="text"></p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      article: {},
      loading: false,
    };
  },
  mounted() {
    this.getNewsInfo();
  },
  methods: {
    getNewsInfo() {  // 获取通知详情
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 5000);
      this.$http.post(`${this.URL_PREFIX}/app/get/park/notice/detail`, {
        noticeId: this.$route.params.newsId,
      }).then((response) => {
        const res = response.data;
        this.loading = false;
        if (res.resCode === '10000') {
          this.article = res.resData;
        }
      });
    },
  },
  updated() {
    const imgs = this.$refs.text.querySelectorAll('img');
    imgs.forEach((val) => {
      val.style.maxWidth = '100%';
    });
  },
};
</script>

<style lang="scss" scoped>
  .detail {
    padding-bottom: 30px;
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
    .article{
      padding: 30px;
      background: #FFFFFF;
      .title{
        text-align: center;
        font-size: 18px;
        line-height: 28px;
        font-weight: 600;
        margin-bottom: 20px;
      }
      .date{
        text-align: center;
        font-size: 12px;
        line-height: 32px;
        margin-bottom: 40px;
      }
    }
  }
</style>
