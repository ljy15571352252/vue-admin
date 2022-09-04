<template>
  <div class="task-list">
    <div class="task-list-header">
      <el-card>
        <el-form :inline="true" :model="form"  size="mini">
          <el-form-item label="导入名称：" >
            <el-input v-model="form.importName"  placeholder="导入名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="时间：" >
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="date"
              type="datetimerange"
              :picker-options="pickerOptions"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">查 询</el-button>
            <el-button type="primary" @click="addTask">添 加</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <div class="task-list-table">
      <el-card>
        <el-table
          v-loading="loading"
          :data="tableData"
          style="width: 100%">
          <el-table-column prop="name" label="任务名称" width="250"/>
          <el-table-column prop="quantity" label="手机号数量" width="200"/>
          <el-table-column prop="effectiveQuantity" label="有效数量" width="200"/>
          <el-table-column prop="fileURL" label="文件路径">
            <template slot-scope="scope">
              <a :href="scope.row.domain" target="_blank">{{scope.row.fileURL}}</a>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="操作" width="300px">
            <template slot-scope="scope">
              <div>
                <el-button size="mini" type="text" @click="exportUrl(scope.row)">下载明细</el-button>
                <el-button size="mini" type="text" @click="handeleDetailelog(scope.row)">详情记录</el-button>
                <el-button size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
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
      </el-card>
    </div>
    <!--新增任务-->
    <AddTask ref="addTask" v-if="isShow" @callBack="callBack"/>

    <!--点击短链-->
    <detailelog ref="detailelog"/>
  </div>
</template>

<script>
import axios from 'axios';
import AddTask from './components/add-task';
import Detailelog from './components/detailelog'
import { phoneQuery, phoneDeletet } from '@/api/collision-management';
import { getToken } from '@/utils/auth';

export default {
  components:{
    AddTask,
    Detailelog,
  },
  data() {
    return {
      loading: false,
      isShow: false,
      date: [],
      form: {
        importName: '',
        pageIndex: 1,
        pageSize: 10,
        startDateTime: '',
        endDateTime: '',
      },
      tableData: [],
      totalCount: 0,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.loading = true;
      if (this.date && this.date.length > 0) {
        [this.form.startDateTime, this.form.endDateTime] = this.date;
      } else {
        this.form.startDateTime = '';
        this.form.endDateTime = '';
      }
      phoneQuery(this.form).then((res) =>{
        if (res.code == 200) {
          this.tableData = res.data.items;
          this.totalCount = res.data.totalCount;
        }
      })
        .finally(() =>{
          this.loading = false;
        })
    },
    search() {
      this.form.pageIndex = 1;
      this.getList()
    },

    addTask() {
      this.isShow = true;
      this.$nextTick(() =>{
        this.$refs.addTask.openPopup(false);
      })
    },
    // 点击记录
    handeleDetailelog(row) {
      this.$refs.detailelog.openPopup(row.id);
    },
    // 删除
    handleDelete(row) {
      this.$confirm('此操作将永久删除该信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        phoneDeletet(row.id)
          .then((res) =>{
            if (res.code === "200") {
              this.getList();
              this.$message({
                type: 'success',
                message: '删除成功'
              });
            }
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });

    },
    // 下载明细
    exportUrl(row) {
      axios({
        method: "post",
        url: process.env.VUE_APP_BASE_API+`/api/Phone/Export?id=`+row.id,
        responseType: 'blob', // 或者responseType: 'blob'
        xsrfHeaderName: 'Authorization',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + getToken(),
        }
      }).then(res => {
        const blob = new Blob([res.data], {
          type: 'text/plain'//下载excel 也可下载zip压缩包 application/zip'
        })
        /*
          如需设置文件名称，可以通过a标签属性来设置
          */
        let url = window.URL.createObjectURL(blob)//url给a标签使用
        let link = document.createElement('a')
        link.style.display = 'none'
        link.href = url
        link.setAttribute('download', '手机号')//设置文件名称
        document.body.appendChild(link)
        link.click()
      }).catch(err => {
        this.$Message.error({
          type: "error",
          message: "下载失败!"
        });
      })
    },
    callBack(bol) {
      if(bol) {
        this.getList();
      };
      this.isShow = false;
    },

    handleSizeChange(pageSize) {
      this.form.pageSize = pageSize;
      this.getList();
    },

    handleCurrentChange(pageIndex) {
      this.form.pageIndex = pageIndex;
      this.getList();
    }
  }
}
</script>

<style scoped>
.pagination{
  margin-top: 20px;
  text-align: center;
}
</style>

