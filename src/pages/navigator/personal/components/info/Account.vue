<template>
  <div class='account'>
    <el-tabs v-model="activeName" @tab-click='tabChange'>
      <el-tab-pane label="个人资料" name="1"><First></First></el-tab-pane>
      <el-tab-pane label="名片资料" name="2"><Second></Second></el-tab-pane>
      <el-tab-pane label="账户安全" name="3"><Third></Third></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import First from './child/First';
import Second from './child/Second';
import Third from './child/Third';

export default {
  data() {
    return {
      activeName: '1',
    };
  },
  methods: {
    ...mapMutations(['change_userTab']),
    tabChange() {
      this.change_userTab(this.activeName);
    },
  },
  computed: {
    ...mapGetters(['userTab']),
  },
  components: {
    First, Second, Third,
  },
  created() {
    this.activeName = this.userTab;
  },
};
</script>

<style lang="scss" scoped>
.account{
  background: #fff;
}
</style>

