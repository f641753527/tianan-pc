<template>
  <div class='item boxShadow' @click='produtionDetail'>
    <div class='avatar'><img :src='info.productBanner'/></div>
    <div class='introduce'>
      <h1 class='title'>{{info.productName}}</h1>
      <p class='attrs'>
        <span class='attr' v-for='(attr, index) in info.productAttr' :key='index'>{{attr.attr}} : {{attr.value}} </span>
      </p>
    </div>
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
    }
  },
  methods: {
    produtionDetail() {
      this.$router.push({ path: `/navigator/production/detail/${this.info.productId}` });
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss";

.item{
  @include clear-float;
  height: 300px;
  margin-bottom: 20px;
  background: #ffffff;
  cursor: pointer;
  .avatar, .introduce{
    float: left;
    height: 100%;
  }
  .avatar{
    width: 40%;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .introduce{
    width: 60%;
    box-sizing: border-box;
    padding: 26px;
    .title{
      font-size: 18px;
      line-height: 28px;
      font-weight: 600;
      margin-bottom: 12px;
    }
    .attrs{
      color: #333333;
      line-height: 32px;
      .attr{
        display: inline-block;
        margin-right: 6px;
        padding-right: 6px;
        height: 14px;
        line-height: 14px;
        border-right: 1px solid #333333;
        &:last-of-type{
          margin-right: 0;
          border: none;
        }
      }
    }
  }
}
</style>
