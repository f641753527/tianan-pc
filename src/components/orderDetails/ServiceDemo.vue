<template>
  <div class='detail boxShadow'>
      <div class='top'>
        <p class='header'><span class='position'>{{info.title}}</span><span class='date'>{{info.createTime | DateFilter}}</span></p>
        <p class='descripe'>
          <span class='prop'>{{info.price}}</span>
          <span class='prop unit' v-show='info.price'>元/月</span>
        </p>
      </div>
      <p class='footer'>{{info.corpName}}</p>
    </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default() {
        return{}
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@scss';
  .detail{
    position: relative;
    // border: 1px solid #c4c4c4;
    cursor: pointer;
    .top{
      position: relative;
      padding: 20px 30px;
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
        font-weight: 600;
        .prop{
          color: $color-main;
          font-size: 24px;
          &.unit{
            font-size: 12px;
            color: #999999;
          }
        }
      }
      .apply{
        position: absolute;
        padding: 10px 40px;
        right: 30px;
        bottom: 30px;
        background: $color-main;
        border-color: $color-main;
        color: #ffffff;
        font-size: 16px;
      }
    }
    .footer{
      padding: 10px 30px;
      // line-height: 32px;
      background: #f9f9f9;
      font-size: 16px;
      color: #666666;
    }
    .submit-success{
      right: 0;
      bottom: 0;
    }
  }
</style>

