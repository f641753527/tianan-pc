<template>
  <div class='detail boxShadow' @click.stop='showDetail(job.id)'>
    <div class='top'>
      <p class='header'><span class='position'>{{job.title}}</span><span class='date'>{{job.createTime | DateFilter}}</span></p>
      <p class='descripe'>
        <span class='salary'>{{job.salary | salaryFilter}}</span>
        <span class='prop'>{{job.education | educationFilter}}</span>
        <span class='line'>&nbsp;</span>
        <span class='prop'>{{job.yearOfWorking | jobFilter}}</span>
      </p>
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
        return {
          id: 'job001', 
          type: 0, 
          key: 1, 
          position: '运营采购经理', 
          salary: '12000' , 
          date: '2017-10-24', 
          descripe: '本科及以上 | 8年以上 | 全职| 招聘5人', 
          company: '深圳市天宇微盟电子仪器有限公司', 
        };
      },
    },
  },
  methods: {
    showDetail(id) {
      this.$router.push({ path: `/navigator/humanResource/jobDetail/${id}` });
    },
  },
  filters: {
    salaryFilter(salary) {
      if (salary === 1) {
        return '面议 ';
      } else if (salary === 2) {
        return '低于2K';
      } else if (salary === 3) {
        return '2-3K';
      } else if (salary === 4) {
        return '3-4.5K';
      } else if (salary === 5) {
        return '4.5-6K';
      } else if (salary === 6) {
        return '6-8K';
      } else if (salary === 7) {
        return '8-10K';
      } else if (salary === 8) {
        return '10-15K';
      } else if (salary === 9) {
        return '15-20K';
      } else if (salary === 10) {
        return '20-30K';
      } else if (salary === 11) {
        return '30-40K';
      } else if (salary === 12) {
        return '40-50K';
      } else if (salary === 13) {
        return '50K以上';
      }
    },
    educationFilter(education) {
      if (education === 1) {
        return '初中及以下';
      } else if (education === 2) {
        return '高中/中技/中专';
      } else if (education === 3) {
        return '大专';
      } else if (education === 4) {
        return '本科';
      } else if (education === 5) {
        return '硕士';
      } else if (education === 6) {
        return '博士';
      }
    },
    jobFilter(year) {
      if (year === 1) {
        return '有无经验均可';
      } else if (year === 2) {
        return '1-3年';
      } else if (year === 3) {
        return '3-5年';
      } else if (year === 4) {
        return '5-10年';
      } else if (year === 5) {
        return '10年以上';
      }
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
      font-weight: 600;
      .salary{
        margin-right: 12px;
        color: $color-main;
        font-size: 18px;
      }
      .prop{
        color: #333333;
      }
      .line{
        display: inline-block;
        border-right: 1px solid #333333;
        line-height: 16px;
        vertical-align: middle;
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

