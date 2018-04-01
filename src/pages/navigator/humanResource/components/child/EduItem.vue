<template>
  <div class='detail boxShadow' @click.stop='showDetail(job.id)'>
    <div class='top'>
      <p class='header'><span class='position'>{{job.title}}</span><span class='date'>{{job.createTime | DateFilter}}</span></p>
      <div class='descripe'>
        <div class='left'>名额： {{job.number}} 人</div>
        <div class='right'>
          <span class='price'>{{job.price}}</span>
          <span class='unit' v-show='job.price'>元/月</span>
        </div>
      </div>
    </div>
    <p class='footer'>{{job.corpName}}</p>
  </div> 
</template>

<script>
export default {
  props: {
    job: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    showDetail(id) {
      this.$router.push({ path: `/navigator/humanResource/eduDetail/${id}` });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@scss';
.detail{
  margin-top: 20px;
  // border: 1px solid #c4c4c4;
  cursor: pointer;
  .top{
    padding: 30px;
    background: #ffffff;
    .header{
      @include clear-float;
      .position{
        float: left;
        font-weight: 700;
        font-size: 20px;
        color: #333333;
      }
      .date{
        float: right;
        color: #666666;
        font-size: 14px;
      }
    }
    .descripe{
      position: relative;
      font-weight: 600;
      .left, .right{
        position: absolute;
        vertical-align: bottom;
      }
      .left{ 
        left: 0;
        color: #666666;
      }
      .right{ 
        right: 0;
        color: $color-main;
        font-size: 24px;
        .unit{
          font-size: 12px;
          color: #999999;
        }
      }
    }
  }
  .footer{
    padding: 10px 30px;
    // line-height: 32px;
    background: #f9f9f9;
    font-size: 16px;
    color: #666666;
  }
}
</style>

