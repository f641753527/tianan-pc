<template>
  <div class='service'>
    <!-- <p class='header'><router-link to='/navigator' >首页</router-link> > 人力资源平台</p> -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>人力资源平台</el-breadcrumb-item>
    </el-breadcrumb>
    <ul class='types'>
      <li v-for='(item, index) in HrTypes' @click='switchService(index)' :key='index' :class='{ "active" : activeIndex === index }' class="boxShadow">
        <img :src='item.picUrl'/>
        <span>{{item.serviceName}}</span>
      </li>
    </ul>
    <JobList v-if='activeIndex === 0'></JobList>
    <ServiceList v-if='activeIndex === 1'></ServiceList>
    <EduList v-if='activeIndex === 2'></EduList>
  </div>
</template>

<script>
import JobList from './child/JobList';
import ServiceList from './child/ServiceList';
import EduList from './child/EduList';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      HrTypes: [],
      activeIndex: 0,
      parentId: 1005,
    };
  },
  methods: {
    switchService(index) {
      this.activeIndex = index;
    },
    getList() {
      this.$http.post(`${this.URL_PREFIX}/app/get/park/service/list`, {
        parkId: this.parkIdList[0],
        parentId: this.parentId,
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.HrTypes = res.resData ? res.resData.pageList : [];
        }
      });
    },
  },
  computed: {
    ...mapGetters(['parkIdList']),
  },
  components: {
    JobList, ServiceList, EduList,
  },
  created() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
@import '~@scss';
.service{
  padding-bottom: 30px;
  .types{
    @include clear-float;
    li{
      float: left;
      width: 285px;
      height: 88px;
      line-height: 88px;
      margin-right: 20px;
      background: #fff;
      cursor: pointer;
      border: 1px solid #f6f6f6;
      &.active{
        border-color: $color-main;
      }
      img, span{
        display: inline-block;
        vertical-align: middle;
      }
      img{
        margin-left: 30px;
        width: 44px;
        height: 44px;
      }
      span{
        margin-left: 20px;
        max-width: 160px;
        @include line-ellipsis;
        font-size: 24px;
        font-weight: 600;
        color: #333333;
      }
    }
  }
}
</style>

