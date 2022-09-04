<template>
  <div>
    <el-dialog width="600px" title="活动任务" :visible.sync="dialogFormVisible" @close="beforeClose" :destroy-on-close="true" :close-on-click-modal="false">
      <el-form  :model="form"  size="mini"  :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="活动名称" prop="importName">
          <el-input v-model="form.importName"></el-input>
        </el-form-item>
        <el-form-item label="转换长链接" prop="url">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item label="短域名" prop="domain">
          <el-input v-model="form.domain"></el-input>
        </el-form-item>
        <el-form-item label="短信内容">
          <el-input type="textarea" v-model="form.messageContent"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { shortUrlAdd, shortUrlModifyShortUrl } from '@/api/task-list';

export default {
  data() {
    return{
      dialogFormVisible: false,
      form: {
        importName: '',
        domain: '',
        url: '',
        messageContent: '',
      },
      isEdit: '',
      rules: {
        importName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
        ],
        domain: [
          { required: true, message: '请输入短域名', trigger: 'blur' },
        ],
        url: [
          { required: true, message: '请输入转换长链接', trigger: 'blur' },
        ],
      }
    }
  },
  methods: {
    openPopup(bol, data) {
      this.isEdit = bol;
      if(bol) {
        this.form.importName = data.importName;
        this.form.domain = data.domain;
        this.form.url = data.url;
        this.form.messageContent = data.messageContent;
      }
      this.dialogFormVisible = true;
    },
    save() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let res = await shortUrlAdd(this.form)
          if (res.code == 200) {
            this.$emit('callBack', true);
            this.$message({
              type: 'success',
              message: '新增成功'
            })
          }

        }
      });
    },
    beforeClose() {
      this.$emit('callBack', false);
    }
  },
}
</script>

<style scoped>

</style>
