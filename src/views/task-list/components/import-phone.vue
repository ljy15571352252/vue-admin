<template>
  <div>
    <el-dialog width="600px" title="上传号码" :visible.sync="dialogFormVisible" @close="beforeClose" :destroy-on-close="true" :close-on-click-modal="false">
      <div>
        <el-upload
          ref="upload"
          action=""
          :limit="1"
          accept=".xls,.xlsx"
          :file-list="fileList"
          :on-remove="handleRemove"
          :on-change="handleChange"
          :auto-upload="false"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false" :loading="loading">取 消</el-button>
        <el-button type="primary" @click="submitPopupData" :loading="loading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { shortUrlImport } from '@/api/task-list';
import axios from 'axios';
import { getToken } from '@/utils/auth';

export default {
  data() {
    return{
      loading: false,
      fileList: [],
      action: '',
      dialogFormVisible: false,
      formData: new FormData(),
      id: '',
      fileObj: [],
    }
  },
  created() {
  },
  methods: {
    openPopup(id) {
      this.id = id;
      this.dialogFormVisible = true;
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
      this.loading = true;
      this.upload();
    },
    upload() {
     const formData = new FormData()
      formData.append('file', this.fileObj[0].raw, this.fileObj[0].name);
      axios({
        url: process.env.VUE_APP_BASE_API+'/api/ShortUrl/import?id='+this.id,
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
    },
  },
}
</script>

<style scoped>

</style>
