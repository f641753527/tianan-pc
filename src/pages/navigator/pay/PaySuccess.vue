<template>
  <div class="style">
    <h3>
      <i class="iconfont icon-wanchengtishi"></i>
      恭喜，支付成功！</h3>
    <div class="button">
      <el-button type="primary" plain @click="jump('/')">返回首页</el-button>
      <el-button type="primary" @click="jump('/navigator/personal/info/orders')">查看订单</el-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
h3 {
  text-align: center;
  padding-top: 200px;
  font-size: 30px;
  font-weight: 600;
  i {
    color: #359c3b;
    font-size: 38px;
    margin-right: 6px;
  }
}
.button {
  width: 300px;
  margin: 50px auto;
  .el-button {
    margin-left: 30px;
  }  
}
</style>

<script>
export default {
  methods: {
    jump(routerPath) {
      this.$router.push({ path: routerPath });
    },
  }
}
</script>

