<template>
  <div>
    <div style="margin: 10px 0">
      获赠用户:&nbsp;&nbsp;<el-input style="width: 200px" placeholder="请输入用户名" suffix-icon="el-icon-search" v-model="uname"></el-input>
<!--      物品ID:&nbsp;&nbsp;<el-input style="width: 200px" placeholder="请输入物品ID" suffix-icon="el-icon-search" class="ml-5" v-model="gid"></el-input>-->
      物品名称: <el-select v-model="gid" clearable placeholder="请输入物品名称">
      <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
      </el-option>
    </el-select>
      获赠数量:&nbsp;&nbsp;<el-input style="width: 200px" placeholder="请输入捐赠数量" suffix-icon="el-icon-search" class="ml-5" v-model="runmber"></el-input>
      &nbsp;&nbsp;<el-button class="ml-5" type="primary" @click="search">搜索</el-button>
      &nbsp;<el-button type="warning" @click="reset">重置</el-button>
    </div>

    <div style="margin: 10px 0">
      <el-button type="primary" @click="handleAdd">新增 <i class="el-icon-circle-plus-outline"></i></el-button>
      &nbsp;
      <!--   <el-popconfirm
           class="ml-5"
           confirm-button-text='确定'
           cancel-button-text='我再想想'
           icon="el-icon-info"
           icon-color="red"
           title="您确定批量删除这些数据吗？"
           @confirm="delBatch"
       >
         <el-button type="danger" slot="reference">批量删除 <i class="el-icon-remove-outline"></i></el-button>
       </el-popconfirm>
       &lt;!&ndash;      <el-button type="primary" class="ml-5">导入 <i class="el-icon-bottom"></i></el-button>
             <el-button type="primary">导出 <i class="el-icon-top"></i></el-button>&ndash;&gt;-->
    </div>

    <el-table :data="tableData" border stripe :header-cell-class-name="'headerBg'"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="rid" label="ID" width="80"></el-table-column>
      <el-table-column prop="uname" label="获赠用户"></el-table-column>
      <el-table-column prop="gname" label="物品名称"></el-table-column>
      <el-table-column prop="runmber" label="获赠数量" width="140"></el-table-column>
      <el-table-column prop="rtime" label="获赠时间" width="180"></el-table-column>
      <!--      <el-table-column prop="uaddress" label="地址"></el-table-column>-->
      <el-table-column label="操作"  width="300" align="center">
        <template slot-scope="scope">
          <!--          <el-button type="primary" @click="handleAdd">新增 <i class="el-icon-circle-plus-outline"></i></el-button>-->
          <el-button type="success" @click="handleEdit(scope.row)">编辑 <i class="el-icon-edit"></i></el-button>
          &nbsp;
          <el-popconfirm
              class="ml-5"
              placement="left-end"
              confirm-button-text='确定'
              cancel-button-text='我再想想'
              icon="el-icon-info"
              icon-color="red"
              title="您确定删除吗？"
              @confirm="del(scope.row.rid)"
          >
            <el-button type="danger" slot="reference">删除 <i class="el-icon-remove-outline"></i></el-button>
          </el-popconfirm>
          <!--          <el-button type="danger" @click="open(scope.row.uid)" >按钮</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <div style="padding: 10px 0">
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[2, 5, 10, 20]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>

    <el-dialog title="获赠信息" :visible.sync="dialogFormVisible" width="30%" >
      <el-form label-width="80px" size="small">
        <el-form-item label="获赠数量">
          <el-input v-model="form.runmber" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="获赠时间">
          <!--          <el-input v-model="form.dtime" autocomplete="off"></el-input>-->
          <el-date-picker
              v-model="form.rtime"
              style="width: 340px;grid-auto-columns: auto"
              autocomplete="off"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="获赠用户">
          <el-input v-model="form.uname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="物品名称">
          <el-select v-model="form.gid"  autocomplete="off" placeholder="请输入物品名称">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
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
export default {
  name: "Donation",
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 5,
      uname: "",
      gid: "",
      runmber: "",
      rtime:"",
      form: {},
      dialogFormVisible: false,
      multipleSelection: [],
      options:[]
    }
  },
  created() {
    this.load();
    this.searchGoodName()
  },
  //decodeURL
  methods: {
    load() {
      this.request.get("/receive/receiveListPage", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          uid: this.uname,
          gid: this.gid,
          rnumber: this.runmber,
        }
      }).then(res => {
        //console.log(res)

        this.tableData = res.data.records
        // console.log(this.tableData)
        this.total = res.data.total

      })
    },
    searchGoodName(){
      this.request.get("/goods/findByName").then(res=>{
        this.options=res.data;
      })
    },
    search(){
      this.request.get("/receive/receiveListPage", {
        params: {
          pageNum: 1,
          pageSize: this.pageSize,
          uid: this.uname,
          gid: this.gid,
          rnumber: this.runmber,
        }
      }).then(res => {
        //console.log(res)

        this.tableData = res.data.records
        // console.log(this.tableData)
        this.total = res.data.total

      })
    },
    save() {
      this.request.post("/receive/addOrUpdate", this.form).then(res => {
        if (res.code==200) {
          this.$message.success("保存成功")
          this.dialogFormVisible = false
          this.load()
          this.search()
        } else {
          this.$message.error("保存失败")
        }
      })
    },
    handleAdd() {
      this.dialogFormVisible = true
      this.form = {}
    },
    handleEdit(row) {
      this.form = row
      this.dialogFormVisible = true
    },
    del(id) {
      this.request.delete("/receive/del/" + id).then(res => {
        if (res.code==200) {
          this.$message.success("删除成功")
          this.search()
        } else {
          this.$message.error("删除失败")
        }
      })
    },
    handleSelectionChange(val) {
      console.log(val)
      this.multipleSelection = val
    },
    /* delBatch() {
       let ids = this.multipleSelection.map(v => v.uid)  // [{}, {}, {}] => [1,2,3]
       this.request.post("/user/del/batch", ids).then(res => {
         if (res) {
           this.$message.success("批量删除成功")
           this.load()
         } else {
           this.$message.error("批量删除失败")
         }
       })
     },*/
    /*open(id){
      console.log("id:"+id);
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',

      }).then(() => {
        console.log(id);
        this.$confirm({
          method:this.del(id)
        })
        this.$message({
          method:this.del(res.id),
          type: 'success',
          //message: '删除成功!',

        });
      }).catch(() => {
        this.$message({
          type: 'info',
         // message: '已取消删除'
        });
      });
    },*/
    reset() {
      this.uname = ""
      this.gid = ""
      this.runmber = ""
      this.load()
    },
    handleSizeChange(pageSize) {
      console.log(pageSize)
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {
      console.log(pageNum)
      this.pageNum = pageNum
      this.load()
    }
  }
}
</script>


<style>
.headerBg {
  background: #eee!important;
}
</style>