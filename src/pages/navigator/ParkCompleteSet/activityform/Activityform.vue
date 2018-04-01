<template>
  <div class="activityform align-center-main">
    <div class="header">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/navigator/parkCompleteSet' }">园区配套平台</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: `/navigator/activityDetails/${this.activityId}` }">园区活动详情</el-breadcrumb-item>
        <el-breadcrumb-item>填写信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="box2 boxShadow">
          <img :src="textList.banner" alt="" class="in_b b_img" >
          <div class="content">
            <h3 class="m_t40 titel textOver"> {{textList.title}}</h3>
            <p class="m_t20 "> <i class="iconfont  icon-shijian"></i> {{textList.beginTime | DateFilter}} 至 {{textList.endTime | DateFilter}}</p>
            <p class="m_t20  address"> <i class="iconfont  icon-dizhi"></i> {{textList.cityName}}{{textList.countyName}}{{textList.address}}</p>
            <p class="m_t20"> <i class="iconfont  icon-renshu"></i> {{textList.showNum}} 人</p>
            <SubmitSuccess v-if='submitSuccessFlag' @close='submitSuccessFlag = false;' class='submit-success' :tipsMsg='tips.tipsMsg'></SubmitSuccess>
          </div>
        </div>
    <forms formtitle="园区活动表单" payorno="1" :formItemList="formItemList"></forms>
  </div>
</template>

<script>
import Forms from '@/components/Forms';
import { mapGetters } from 'vuex';

export default {
  data() {
    return{
      activityId: '', // 活动详情id
      textList: {},
      formItemList: [],
      submitSuccessFlag: false,
      tips: {
        tipsMsg: '报名成功！等待企业与您联系。',
      },
    }
  },
  methods: {
    activityDetail() {
      this.$http.post(`${this.URL_PREFIX}/app/get/activity/info/detail`,{
        activityId: this.activityId,
        parkId: this.parkIdList[0],
      }).then((res) => {
        console.log(res);
        if (res.data.resCode === '10000') {
          this.textList = res.data.resData;
          if(res.data.resData.formItemList) {
            this.formItemList = res.data.resData.formItemList;
          }
        }
      });
    },
    
  },
  components: {
    Forms,
  },
  mounted() {
    this.activityId = Number(this.$route.params.activityformId);
    this.activityDetail();
  },
  computed: {
    ...mapGetters(['parkIdList', 'token']),
  },
}
</script>
<style lang="scss" scoped>
.box2{
  height: 300px;
  display: flex;
  margin-bottom: 20px;
  background-color: #fff;
  .address{
    // width: 360px;
    text-align: left;
  }
}
.b_img{
  width: 535px;
  height: 100%;
  border-radius: 4px 0 0 4px;
}
.content{
  flex: 1;
  box-sizing: border-box;
  padding: 0 0 0 40px;
  p{
    vertical-align: middle;
    height: 26px;
    line-height: 26px;
  }
  .submit-success{
    right: 40%;
    bottom: 40%;
  }
}
.iconfont{
  color: #999;
}
.m_l40{
  margin-left: 40px;
}
.m_l20{
  margin-left: 20px;
}
.m_t40{
  margin-top: 40px;
}
.m_t20{
  margin-top: 20px;
}
.m_t10{
  margin-top: 10px;
}
.in_b{
  display: inline-block;
}
.titel{
  font-size: 30px;
  width: 615px;
}
</style>