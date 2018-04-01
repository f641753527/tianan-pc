<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/navigator/financePlatform' }">金融服务平台</el-breadcrumb-item>
      <el-breadcrumb-item>详情</el-breadcrumb-item>
    </el-breadcrumb>
    <GoodsBox :imgSrc="imgSrc" :title="title"></GoodsBox>
    <div class="form">
      <h3>金融服务表单</h3>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" size="small">
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-input v-model.number = "ruleForm.age"></el-input>
        </el-form-item>
        <el-form-item label="活动形式" prop="desc">
          <el-input v-model="ruleForm.desc" type="textarea"></el-input>
        </el-form-item>
        <el-upload
          action="http://up-z2.qiniup.com/"
          list-type="picture-card"
          :data='{ token: this.qiniuConfig.token }'
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form>
      <div class="myButton button" @click="submitForm">提交</div>
    </div>
    <SubmitSuccess v-if='submitSuccessFlag' @close='submitSuccessFlag = false;' class='submit-success' :tipsMsg="tipsMsg"></SubmitSuccess>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import GoodsBox from './components/GoodsBox';
import SubmitSuccess from '@/components/SubmitSuccess';

export default {
  data() {
    const checkAge = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('年龄不能为空'));
      }
      if (!Number.isInteger(value)) {
        callback(new Error('请输入数字值'));
      } else {
        callback();
      }
    };
    return {
      submitSuccessFlag: false,
      tipsMsg: '提交成功，请等待管理员审核!',
      imgSrc: 'https://www.njffin.com/plugins/other/images/common/newLogo01.png',
      title: '南金服金融服务',
      ruleForm: {
        name: '',
        age: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        age: [
          { validator: checkAge, trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      },
      dialogImageUrl: '',
      dialogVisible: false,
      qiniuConfig: {},
    }
  },
  components: {
    GoodsBox, SubmitSuccess,
  },
  methods: {
    getUploadToken() {
      this.$http.post(`${this.URL_PREFIX}/app/get/qiniu/bucket/token`, {}, {
        headers: { token: this.token },
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          console.log(res);
          this.qiniuConfig = res.resData;
        }
      });
    },
      // 图像上传成功
    uploadSuccess(res, file) {
      this.dialogImageUrl = `${this.qiniuConfig.domain}/${res.key}`;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    submitForm() {
      this.submitSuccessFlag = true;
    },
  },
  mounted() {
    this.getUploadToken();
  },
  computed: {
    ...mapGetters(['user', 'token']),
  },
}
</script>

<style lang="scss" scoped>
.form {
  margin-top: 40px;
  border-bottom: 2px solid #b4b4b4;
  margin-bottom: 50px;
  padding: 40px 100px;
  min-height: 400px;
  h3 {
    font-weight: 600;
    font-size: 20px;
    margin-bottom: 30px;
  }
}
.el-upload {
  .el-upload-list>.el-upload-list__item {
    width: 300px;
  }
}
.button {
  margin-top: 20px;
}
.submit-success{
  right: 40%;
  bottom: 50%;
}
</style>
