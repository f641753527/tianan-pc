<template>
  <div>
    <li class="boxShadow">
      <img :src="info.banner" alt="">
      <div class="blurb">
        <el-tooltip :content="info.serviceName" placement="top" effect="light">
          <h3 class="textOver">{{ info.serviceName }}</h3>
        </el-tooltip>
        <p>
          <span>发布时间：{{ info.createTime| DateFilter }}</span>
          <span>结束时间：{{ info.endTime | DateFilter }}</span>
        </p>
        <p>
          <span>目标单价：{{ info.price }}</span>
          <span>类型描述：{{ info.typeDesc }}</span>
        </p>
        <p>
          <span>送货地址或服务地点：{{ info.provinceName }}{{ info.cityName }}{{ info.countyName }}{{ info.address }}</span>
        </p>
      </div>
    </li>
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
  // methods: {
  //   goPath(serviceId) {
  //     this.$router.push({ path: `cooperationDetails/${serviceId}` });
  //   },
  // },
}
</script>


<style lang="scss" scoped>
li {
  display: flex;
  background-color: #fff;
  width: 570px;
  // height: 132px;
  margin-bottom: 20px;
  padding-right: 20px;
  cursor: pointer;
  &:nth-of-type(2n) {
    margin-right: 0;
  }
  img {
    width: 100px;
    height: 100px;
    margin: 16px;
  }
  .blurb {
    margin-top: 16px;
    flex: 1;
    h3 {
      width: 420px;
      font-size: 20px;
      font-weight: 600;
      line-height: 40px;
    }
    p {
      display: flex;
      line-height: 20px;
      span {
        font-size: 12px;
        flex: 1;
      }
    }
  }
}
</style>
