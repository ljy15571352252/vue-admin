<template>
  <div>
    <el-dialog width="1100px" title="详情记录" :visible.sync="dialogFormVisible" :destroy-on-close="true" :close-on-click-modal="false">
      <div>
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%"
        >
          <el-table-column prop="phone" label="手机号" width="200"/>
          <el-table-column prop="encryptionPhone" label="加密号"/>
          <el-table-column prop="receiveState" label="是否能收到短信" width="200"/>
          <el-table-column prop="receiveMessage" label="信息"/>
        </el-table>
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="form.pageIndex"
            :page-sizes="[10,20, 50,100,200, 300, 400]"
            :page-size="form.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount">
          </el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { phonePhoneItemQuery } from '@/api/collision-management';

export default {
  data() {
    return{
      loading:false,
      dialogFormVisible: false,
      tableData: [],
      form: {
        phoneFileId: '',
        pageIndex: 1,
        pageSize: 10,
      },
      totalCount: 0,
    }
  },

  methods: {
    openPopup(id) {
      this.dialogFormVisible = true;
      this.form.phoneFileId = id
      this.getList();
    },
    getList() {
      this.loading = true,
        phonePhoneItemQuery(this.form).then((res) => {
        if (res.code == 200) {
          this.tableData = res.data.items;
          this.totalCount = res.data.totalCount
        }
      })
        .finally(() =>{
          this.loading = false;
        })
    },
    handleSizeChange(pageSize) {
      this.form.pageIndex = 1;
      this.form.pageSize = pageSize;
     this.getList();
    },
    handleCurrentChange(pageIndex) {
      this.form.pageIndex = pageIndex;
      this.getList();
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
