<template>
  <div>
    <el-dialog width="1100px" title="点击记录" :visible.sync="dialogFormVisible" :destroy-on-close="true" :close-on-click-modal="false">
      <div>
<!--        <div>-->
<!--          <el-button size="mini" type="text">下载点击号码</el-button>-->
<!--        </div>-->
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

export default {
  data() {
    return{
      loading:false,
      dialogFormVisible: false,
      tableData: [],
      form: {
        pageIndex: 1,
        pageSize: 10,
      }
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
    openPopup(id) {
      this.dialogFormVisible = true;
      this.getList(id)
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
