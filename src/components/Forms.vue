<template>
  <div class="Forms">
    <div class="form">
      <h3>{{formtitle}}</h3>
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
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
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
    }
  },
  components: {
    SubmitSuccess,
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 提交表单接口
    formInterface() {
      // this.$http.post(`${this.URL_PREFIX}${this.url}`,{

      // }).then((res) => {
      //   console.log(res);
      // });
    },
    submitForm() {
      this.submitSuccessFlag = true;
    },
  },
  props: {
    formtitle: '',
    payorno: '',
    formItemList: {
      type: Array,
      default: [],
    }
  },
  created() {
    console.log(this.formItemList);
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
