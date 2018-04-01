<template>
  <div class='first'>
    <el-form ref="user" :model="userInfo" class='edit_form' :rules="loginRules" label-width="100px" size='small'>
      <el-form-item label='当前图像' prop='userIcon' class='user_icon'>
        <el-upload
          class="avatar-uploader" name='file' :multiple='false' accept='image/gif, image/jpeg, image/png'
          action="http://up-z2.qiniup.com/" :data='{ token: this.qiniuConfig.token }'
          :show-file-list="false" :on-success='uploadSuccess'
          :disabled="!isEdit">
          <img v-if="userInfo.userIcon" :src="userInfo.userIcon" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item prop='userNick' label='用户昵称' >
        <el-input v-model="userInfo.userNick" :disabled="!isEdit"></el-input>
      </el-form-item>
      <el-form-item prop='userSex' label='性别'>
        <el-radio-group v-model="userInfo.userSex" :disabled="!isEdit">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="2">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop='userHobby' label='爱好'>
        <el-input v-model="userInfo.userHobby" :disabled="!isEdit"></el-input>
      </el-form-item>
      <el-form-item prop='addr' label='收货地址'>
        <el-row><CitySelect :provinceId='userInfo.provinceId' :cityId='userInfo.cityId' :countyId='userInfo.countyId'
          :size='size' :disabled="!isEdit" ref='cityselect'></CitySelect></el-row>
      </el-form-item>
      <el-form-item prop='details'>
        <el-input type="textarea" :disabled="!isEdit" :rows="2" placeholder="详细地址" v-model="userInfo.details"></el-input>
      </el-form-item>
      <el-form-item class='btn_group'>
        <el-button class='editBtn' @click="editOrCancel" size='small'>{{isEditText}}</el-button>
        <el-button class='saveBtn' @click="save" :disabled="!isEdit" size='small'>保存</el-button>
      </el-form-item>
    </el-form>
    <!-- 提交成功的弹出组件 -->
    <SubmitSuccess v-if='submitSuccessFlag' @close='submitSuccessFlag = false;' class='submit-success' :tipsMsg='tips.tipsMsg' :duration='tips.duration'></SubmitSuccess>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import CitySelect from '@/components/CitySelect.vue'
import deepcopy from '@/utils/deepcopy';

export default {
  data() {
    return {
      userInfo: {
        userIcon: '',
        userNick: '',
        userSex: 1,
        userHobby: '',
        provinceId: '',
        cityId: '',
        countyId: '',
        details: '',
      },
      tempUser: {},
      loginRules: {
        userNick: [
          { required: true, message: '请输入昵称', trigger: 'blur' },
        ],
      },
      
      citiesInfo: {},
      // 是否为编辑状态
      isEdit: false,
      size: 'small',
      submitSuccessFlag: false,
      tips: {
        title: '提示',
        tipsMsg: '提交成功！等待企业与您联系。',
        duration: 2000,
      },

      qiniuConfig: {},
    };
  },
  methods: {
    ...mapMutations(['change_user']),

    getUploadToken() {
      this.$http.post(`${this.URL_PREFIX}/app/get/qiniu/bucket/token`, {}, {
        headers: { token: this.token },
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.qiniuConfig = res.resData;
        }
      });
    },

    initUserInfo() {
      this.userInfo.userIcon = this.user.userIcon;
      this.userInfo.userNick = this.user.userNick;
      this.userInfo.userSex = this.user.userSex;
      this.userInfo.userHobby = this.user.userHobby;
      this.userInfo.provinceId = this.user.provinceId;
      this.userInfo.cityId = this.user.cityId;
      this.userInfo.countyId = this.user.countyId;
      this.userInfo.details = this.user.details;
    },


    // 图像上传成功
    uploadSuccess(res, file) {
      this.userInfo.userIcon = `${this.qiniuConfig.domain}/${res.key}`;
    },

    editOrCancel() {
      this.isEdit = !this.isEdit;
      if (this.isEdit) {
        this.tempUser = deepcopy(this.userInfo);
      } else {
        this.userInfo = this.tempUser;
        this.$refs.cityselect.cancel(this.tempUser.provinceId, this.tempUser.cityId, this.tempUser.countyId);
      }
    },
    // 保存信息
    save() {
      this.$refs.user.validate((valid) => {
        if (valid) {
          this.saveHttp();
        } else {
          return false;
        }
      });
    },

    // 保存求情
    saveHttp() {
      const info = this.$refs.cityselect.getSelectedInfo();
      this.userInfo.provinceId = info.provinceId;
      this.userInfo.cityId = info.cityId;
      this.userInfo.countyId = info.countyId;
      this.$http.post(`${this.URL_PREFIX}/app/modify/user/info`, {
        ...this.userInfo,
      }, {
        headers: { token: this.token },
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.isEdit = false;
          this.updateLocalUser();
        } else {
          this.submitSuccessFlag=true;
          this.tips.tipsMsg = res.resDesc;
        }
      });
    },

    // 更新本地数据
    updateLocalUser() {
      const user = deepcopy(this.user);
      user.userIcon = this.userInfo.userIcon;
      user.userNick = this.userInfo.userNick;
      user.userSex = this.userInfo.userSex;
      user.userHobby = this.userInfo.userHobby;
      user.provinceId = this.userInfo.provinceId;
      user.cityId = this.userInfo.cityId;
      user.countyId = this.userInfo.countyId;
      user.details = this.userInfo.details;
      this.change_user(user);
    },
  },
  computed: {
    ...mapGetters(['user', 'token']),
    isEditText() {
      return this.isEdit ? '取消' : '编辑';
    },
  },
  components: {
    CitySelect
  },
  created() {
    this.initUserInfo();
    this.getUploadToken();
  },
};
</script>

<style lang="scss" scoped>
@import '~@scss';
.first{
  padding: 30px;
  .edit_form{
    .btn_group{
      text-align: center;
      .editBtn, .saveBtn{
        padding: 6px 34px;
        font-size: 16px;
      }
      .editBtn{
        border-color: $color-main;
        color: $color-main;
      }
      .saveBtn{
        background: $color-main;
        color: #FFF;
        &:disabled{
          background: #999999;
        }
      }
    }
    .user_icon{
      .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        border-radius: 50%;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
      }
      .avatar-uploader-icon {
        font-size: 30px;
        color: #8c939d;
        width: 100px;
        height: 100px;
        line-height: 100px;
        text-align: center;
      }
      .avatar {
        width: 100px;
        height: 100px;
        outline-width: 0px;  
        vertical-align: top;
        display: inline-block;
        border-radius: 50%;
      }
    }
  }
  .submit-success{
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>

