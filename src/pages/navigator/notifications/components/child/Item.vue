<template>
  <div class='item'>
    <p class='content' @click='newsDetail'>
      <span class='title'>{{ info.noticeTitle }}</span><span class='date'> {{info.createTime | DateFilter }} </span>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default() {
        return {};
      },
    }
  },
  methods: {
    newsDetail() {
      this.$router.push({ path: `/navigator/notifications/detail/${this.info.noticeId}` });
    },
  },
}
</script>

<style lang="scss" scoped>
  .item{
    &:last-of-type{
      margin-bottom: 0;
    }
    .content{
      cursor: pointer;
      line-height: 60px;
      padding: 0 40px;
      border-bottom: 1px solid #f5f5f5;
      .title{
        font-size: 20px;
        color: #333;
      }
      .date{
        font-size: 16px;
        color: #333;
        float: right;
      }
    }
    .content:hover{
      color: #999999;
      .date{
        color: #999999;
      }
    }
  }
</style>
