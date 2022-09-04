<template>
  <div>
    <el-dialog width="600px" title="活动任务" :visible.sync="dialogFormVisible" @close="beforeClose" :destroy-on-close="true" :close-on-click-modal="false">
      <el-form  :model="form"  size="mini"  :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="文件">
          <div>
            <el-upload
              ref="upload"
              action=""
              :limit="1"
              accept=".xls,.xlsx,.txt"
              :file-list="fileList"
              :on-remove="handleRemove"
              :on-change="handleChange"
              :auto-upload="false"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios'
import { getToken } from '@/utils/auth';

export default {
  data() {
    return{
      loading: false,
      dialogFormVisible: false,
      form: {
        name: '',
      },
      fileList: [],
      action: '',
      isEdit: '',
      dialogFormVisible: false,
      formData: new FormData(),
      id: '',
      fileObj: [],
      rules: {
        name: [
          { required: true, message: '请输入任务名称', trigger: 'blur' },
        ],
      }
    }
  },
  methods: {
    openPopup(bol, data) {
      this.isEdit = bol;
      if(bol) {
        this.form.name = data.importName;
      }
      this.dialogFormVisible = true;
    },

    save() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          this.submitPopupData();
        }
      });
    },

    // 提交
    submitPopupData() {
      const fileName = this.formData.get('fileName')
      if (fileName) {
        shortUrlImport(this.formData)
      } else {
        this.$message.warning("请先上传附件");
      }
    },
    handleRemove(){
      this.fileObj = [];
      this.fileList = [];
    },
    handleChange(file) {
      this.fileObj = [file]
    },
    submitPopupData() {
      if (this.fileObj.length === 0) {
        this.$message.warning('请上传文件')
        return
      };
      this.upload();
    },
    upload() {
      const formData = new FormData()
      formData.append('file', this.fileObj[0].raw, this.fileObj[0].name);
      axios({
        url: process.env.VUE_APP_BASE_API+'/api/Phone/add?name='+this.form.name,
        method: 'post',
        headers:{
          'Authorization': 'Bearer '+ getToken(),
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        data:formData
      })
        .then((res) =>{
          if (res.data.code == 200) {
            this.fileObj = [];
            this.fileList = [];
            this.$emit('callBack', true);
          }else{
            this.$message.warning(res.data.message)
          }
        })
        .finally(() => {
          this.loading = false
        })

    },
    beforeClose() {
      this.$emit('callBack', false);
    }
  },
}
</script>

<style scoped>

</style>
