<template>
  <div>
    <el-dialog width="1100px" title="点击记录" :visible.sync="dialogFormVisible" :destroy-on-close="true" :close-on-click-modal="false">
      <div>
        <div>
          <el-button size="mini" type="primary" @click="exportList" :loading="exportLoading">导 出</el-button>
        </div>
        <el-table
          v-loading="loading"
          :data="pageList"
          style="width: 100%"
        >
          <el-table-column prop="phone" label="对应手机号"/>
          <el-table-column prop="fristHitDateTime" label="访问时间"/>
          <el-table-column prop="ip" label="访问IP"/>
          <el-table-column prop="isp" label="运营商"/>
          <el-table-column prop="ipAddress" label="访客地区"/>
          <el-table-column prop="device" label="设备信息"/>
        </el-table>
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="form.pageIndex"
            :page-sizes="[10,20, 50,100,200, 300, 400]"
            :page-size="form.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="tableData.length">
          </el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { shortUrlshorturls } from '@/api/task-list';
import { getToken } from '@/utils/auth'
import axios from 'axios'

export default {
  data() {
    return{
      loading:false,
      dialogFormVisible: false,
      tableData: [],
      tastId: '',
      form: {
        pageIndex: 1,
        pageSize: 10,
      },
      tableName: '',
      exportLoading: false,
    }
  },
  computed: {
    // 前端分页
    pageList () {
      let start = (this.form.pageIndex - 1) * this.form.pageSize
      let end = this.form.pageIndex * this.form.pageSize
      return this.tableData.slice(start, end)
    },
  },

  methods: {
    // 列表导出
    exportList() {
      this.exportLoading = true;
      axios({
        method: "post",
        url:  process.env.VUE_APP_BASE_API + `/api/ShortUrl/ExportShortUrlInfo?id=`+this.tastId,
        responseType: 'blob', // 或者responseType: 'blob'
        xsrfHeaderName: 'Authorization',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getToken(),
        }
      }).then(res => {
        const blob = new Blob([res.data], {
          type: 'application/vnd.ms-excel'//下载excel 也可下载zip压缩包 application/zip'
        })
        /*
        如需设置文件名称，可以通过a标签属性来设置
        */
        let url = window.URL.createObjectURL(blob)//url给a标签使用
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', this.tableName+'-列表')//设置文件名称
        document.body.appendChild(link)
        link.click()
      }).catch(err => {
        this.$Message.error({
          type: "error",
          message: "导出失败!"
        });
      })
        .finally(() =>{
          this.exportLoading = false;
        })

    },
    openPopup(row) {
      this.tastId = row.id;
      this.tableName = row.importName;
      this.dialogFormVisible = true;
      this.getList(row.id)
    },
    getList(id) {
      this.loading = true,
      shortUrlshorturls(id).then((res) => {
        if (res.code == 200) {
          this.tableData = res.data
        }
      })
        .finally(() =>{
          this.loading = false;
        })
    },
    handleSizeChange(pageSize) {
      this.form.pageIndex = 1;
      this.form.pageSize = pageSize;
    },
    handleCurrentChange(pageIndex) {
      this.form.pageIndex = pageIndex;
    }
  },
}
</script>

<style scoped>
.pagination{
  text-align: center;
  margin-top: 20px;
}
</style>
