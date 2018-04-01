<template>
  <div>
    <el-form :model="form" ref="form" size="small" label-width="200px">
      <el-form-item v-for="(item, index) in form.itemList" :key="index"  
        :label="item.title + '：'" 
        :prop="'itemList.' + index + '.defaultValue'"
        :rules="{
          required: item.ismust, message: '内容不能为空', trigger: 'blur, change'
        }"
      >
        <!-- 1单行文本 -->
        <el-input v-model="item.defaultValue"  v-if="item.type === 1" @blur="validateForm(item.defaultValue)"></el-input>
        <!-- <span v-show="item.validate && item.type === 1">请根据规则填写</span> -->
        <!-- 2多行文本 -->
        <el-input v-model="item.defaultValue"  type="textarea" v-if="item.type === 2" row="4"></el-input>
        <!-- 3数字 -->
        <el-input-number v-model="item.defaultValue" controls-position="right" :min="0" v-if="item.type === 3"></el-input-number>
        <!-- 4日期 -->
        <el-date-picker v-model="item.defaultValue" placeholder="选择日期" type="date" value-format="yyyy-MM-dd" v-if="item.type === 4"></el-date-picker>
        <!-- 5单选 -->
        <el-select v-model="item.defaultValue" placeholder="请选择" v-if="item.type === 5">
          <el-option v-for="(item2, index2) in item.options" :key="index2" :value="item2"></el-option>
        </el-select>
        <!-- 6多选 -->
        <el-checkbox-group v-model="item.defaultValue" v-if="item.type === 6">
          <el-checkbox :label="item2" v-for="(item2,index2) in item.options" :key="index2">{{ item2 }}</el-checkbox>
        </el-checkbox-group>
        <!-- 7图片 -->
        <div v-if="item.type === 7">
          <el-upload
            class="avatar-uploader" name='file' :multiple='true'
            action="http://up-z2.qiniup.com/" :data='{ token: qiniuConfig.token }'
            :on-success='uploadSuccess' :limit=Number(item.defaultValue)
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-upload="beforeUpload"
            list-type="picture-card"
            accept="image/gif, image/jpeg, image/png"
            >
            <i class="el-icon-plus"></i>
            <div slot="tip">图片上传限数：{{ item.defaultValue }}</div>
          <!-- <img :src="dialogImageUrl" class="avatar"> -->
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </div>
        <!-- 8说明文字 -->
        <p v-if="item.type === 8">{{ item.defaultValue }}</p>
      </el-form-item>
      <el-form-item align="center" label-width="0">
        <!-- <el-button type="primary" @click="submitForm('form')" size="">提 交</el-button> -->
        <div class="myButton button" @click="submitForm('form')">提 交</div>
      </el-form-item>
    </el-form>
  
    <!-- 弹窗登录 -->
    <MaskLogin v-show='showLogin' @close='closeSubmit'></MaskLogin>
    <!-- 消息弹框 -->
    <SubmitSuccess v-if='submitSuccessFlag' @close='submitSuccessFlag = false' class='submit-success' :tipsMsg="tipsMsg"></SubmitSuccess>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import deepcopy from '@/utils/deepcopy';

export default {
  data() {
    return {
      submitSuccessFlag: false,
      showLogin: false,
      tipsMsg: '',
      form: {},
      dialogImageUrl: '',
      dialogVisible: false,
      qiniuConfig: {},
      picArr: [],
    }
  },
  methods: {
    validateForm(item) {  // 验证正则
      // if (item.regularExpres) {
      //   // console.log(/'1\d{3}'/.test(item.defaultValue));
      //   const str = '1\d{3}';
      //   str.replace('1//d{3}', '//');
      //   const reg = new RegExp(str);
      //   console.log(reg.test(1234));
      //   // if (!/^1\d{3}$/.test(item.defaultValue)) {
      //   //   this.$message('false');
      //   // }
      // }
      // console.log(/'1\d{3}'/.test(1234));
      // console.log(/1\d{10}/.test(val));

      var reg = '1\d{3}'.replace(/'\'/g, '\\\\');
      var reg2 = new RegExp(reg);
      console.log(reg2);
      console.log(reg2.test('1234'));
      
      // const reg3 = reg.replace(/\/g, '\\');
      // console.log(reg3);
      // const reg2 = eval(reg);
      // console.log(reg2.test(1234));   // false
      // console.log(/1\d{3}/.test(1234));   // true
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.token) {
            this.showLogin = true;
            return false;
          }
          const images = [];
          let flag = false;
          this.picArr.forEach((val) => {
            images.push(`${this.qiniuConfig.domain}/${val.response.key}`);
          });
          const Form = deepcopy(this.form);
          const content = [];
          Form.itemList.forEach((val) => {
            if (val.type === 6) {  // 处理多选
              val.defaultValue = val.defaultValue ? val.defaultValue.toString() : '';
            } else if (val.type === 7) {  // 处理图片
              if (images.length === 0 && val.ismust) {
                flag = true;
                this.submitSuccessFlag = true;
                this.tipsMsg = '请上传图片';
                return;
              }
              val.defaultValue = images.toString();
            } else if (val.type === 3) {  // 处理数字
              val.defaultValue = val.defaultValue + '';
            }

              content.push({
                itemId: val.itemId,
                title: val.title,
                type: val.type,
                value: val.defaultValue,
              });

          });


          if (!flag) {  // 无错误则提交
            this.$emit('finishForm', content);
          }
        } else {
          this.submitSuccessFlag = true;
          this.tipsMsg = '请完整填写信息';
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.form.resetFields();
    },
    beforeUpload(file) {
      console.log(file);
      if (!this.token) {
        this.showLogin = true;
        return false;
      }
    },
    closeSubmit() {
      this.showLogin = false;
      if (this.token) {
        this.getUploadToken();
      }
    },
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
      // 图像上传成功
    uploadSuccess(res, file, fileList) {
      this.dialogImageUrl = `${this.qiniuConfig.domain}/${res.key}`;
      this.picArr = fileList;
    },
    handleRemove(file, fileList) {
      this.picArr = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
  },
  props: {
    formObj: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  // watch: {
  //   formObj() {
  //     this.form = deepcopy(this.formObj);
  //   }
  // },
  mounted() {
    this.form = deepcopy(this.formObj);
    this.getUploadToken();
  },
  computed: {
    ...mapGetters(['token']),
  },
}
</script>

<style lang="scss" scoped>
.el-form {
  border-radius: 6px;
  min-width: 1000px;
  // min-height: 400px;
}
.el-form-item {
  margin-bottom: 10px;
  padding-bottom: 10px;
  .el-input, .el-select, .el-textarea  {
    width: 100%;
  }
  .el-input-number,
  .el-date-editor
  {
    width: 200px;
  }
  .avatar-uploader {
    border-bottom: 1px dashed #ccc;
  }
  .button {
    margin-top: 20px;
  }
}

.submit-success {
  left: 50%;
  bottom: 50%;
  transform: translate(-50%, 50%);
}
</style>

