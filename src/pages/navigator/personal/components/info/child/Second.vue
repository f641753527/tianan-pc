<template>
  <div class='second'>
    <el-form ref="modify_card" :model="userInfo" class='edit_form' :rules="modifyRules" label-width="100px" size='small'>
      <el-form-item prop='name' label='姓名'>
        <el-input v-model="userInfo.name" :disabled="!isEdit"></el-input>
      </el-form-item>
      <el-form-item prop='position' label='职位'>
        <el-input v-model="userInfo.position" :disabled="!isEdit"></el-input>
      </el-form-item>
      <el-form-item prop='phone' label='手机'>
        <el-input v-model="userInfo.phone" :disabled="!isEdit"></el-input>
      </el-form-item>
      <el-form-item prop='corpName' label='企业名称'>
        <el-input v-model="userInfo.corpName" :disabled="!isEdit"></el-input>
      </el-form-item>
      <el-form-item prop='address' label='企业地址'>
        <el-input v-model="userInfo.address" :disabled="!isEdit"></el-input>
      </el-form-item>
      <el-form-item prop='tel' label='电话'>
        <el-input v-model="userInfo.tel" :disabled="!isEdit"></el-input>
      </el-form-item>
      <el-form-item prop='email' label='邮箱'>
        <el-input v-model="userInfo.email" :disabled="!isEdit"></el-input>
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
import deepcopy from '@/utils/deepcopy';

export default {
  data() {
    const validateMobile = (rule, value, callback) => {
      if (!value) {
        return;
      }
      if (!/^1[3|4|5|7|8|9][0-9]\d{8}$/.test(value)) {
        callback(new Error('手机号格式错误!'));
      } else {
        callback();
      }
    };
    const validateEmail = (rule, value, callback) => {
      if (value && !/^[A-Za-z1-9]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]{2,}[-.])+[A-Za-z\d]{2,5}([-.][A-Za-z\d]{2,})*$/.test(value)) {
        callback(new Error('邮箱格式错误!'));
      } else {
        callback();
      }
    };
    return {
      userInfo: {
        name: '',
        position: '',
        phone: '',
        corpName: '',
        address: '',
        tel: '',
        email: '',
      },
      tempUser: {},
      modifyRules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validateMobile, trigger: 'blur' },
        ],
        corpName: [
          { required: true, message: '请输入企业名称', trigger: 'blur' },
        ],
        address: [
          { required: true, message: '请输入企业地址', trigger: 'blur' },
        ],
        email: [
          { validator: validateEmail, trigger: 'blur' },
        ],
      },
      isEdit: false,
      submitSuccessFlag: false,
      tips: {
        title: '提示',
        tipsMsg: '提交成功！等待企业与您联系。',
        duration: 2000,
      },
    };
  },
  methods: {
    ...mapMutations(['change_user']),
    editOrCancel() {
      this.isEdit = !this.isEdit;
      if (this.isEdit) {
        this.tempUser = deepcopy(this.userInfo);
      } else {
        this.userInfo = this.tempUser;
      }
    },
    // 提交
    save() {
      this.$refs.modify_card.validate((valid) => {
        if (valid) {
          this.modifyHttp();
        } else {
          return false;
        }
      });
    },
    // 修改请求
    modifyHttp() {
      this.$http.post(`${this.URL_PREFIX}/app/modify/user/card/info`, {
        ...this.userInfo,
      }, {
        headers: { token: this.token }
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.isEdit = false;
          this.updateLocalData();
        } else {
          this.submitSuccessFlag=true;
          this.tips.tipsMsg = res.resDesc;
        }
      });
    },
    updateLocalData() {
      const user = deepcopy(this.user);
      user.userCardInfo = deepcopy(this.userInfo);
      this.change_user(user);
    }
  },
  computed: {
    ...mapGetters(['user', 'token']),
    isEditText() {
      return this.isEdit ? '取消' : '编辑';
    },
  },
  created() {
    this.userInfo = deepcopy(this.user.userCardInfo);
  },
};
</script>

<style lang="scss" scoped>
@import '~@scss';
.second{
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
  }
  .submit-success{
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>

