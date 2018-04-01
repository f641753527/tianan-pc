<template>
  <div class="efooter">
    <ul class="callUs">
      <li>
        <i class="iconfont icon-dianhua"></i>
        <div class="content">
          <p>CALL US</p>
          <p>0755-89451254</p>
        </div>
      </li>
      <li>
        <i class="iconfont icon-tianandizhi"></i>
        <div class="content">
          <p>ADDRESS</p>
          <p>广东省深圳市福田区天安数码城</p>
        </div>
      </li>
      <li>
        <i class="iconfont icon-youjian"></i>
        <div class="content">
          <p>EAMLL</p>
          <p>tianan@tianan.net</p>
        </div>
      </li>
    </ul>
    <div class="footer">
      <p>版权所有：深圳天安智慧园区运营有限公司</p>
      <p>ICP备案序号：粤ICP备08016570号</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.efooter{
  padding: 0;
  .callUs {
    height: 75px;
    width: 946px;
    margin: 0 auto;
    background-color: #fff;
    display: flex;
    padding-top: 35px;
    li {
      flex: 1;
      padding-left: 20px;
      i {
        float: left;
        width: 33px;
        height: 33px;
        font-size: 33px;
        color: #333;
        margin-right: 16px;
      }
      p {
        line-height: 18px;
      }
    }
  }
  .footer{
    height: 68px;
    padding-top: 20px;
    background-color: rgba(0, 0, 0, 0.87);
    p {
      color: #fff;
      text-align: center;
    }
  }
}
</style>
