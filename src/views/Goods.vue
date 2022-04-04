<template>
  <div>
    <div style="margin: 10px 0">
<!--      物品名称:&nbsp;&nbsp;<el-input style="width: 200px" placeholder="请输入物品名称" suffix-icon="el-icon-search" v-model="gname"></el-input>-->
      物品名称 <el-select v-model="gname" clearable placeholder="请输入物品名称">
        <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      物品爱心值:&nbsp;&nbsp;<el-input style="width: 200px" placeholder="请输入物品爱心值" suffix-icon="el-icon-search" class="ml-5" v-model="glove"></el-input>
      物品数量:&nbsp;&nbsp;<el-input style="width: 200px" placeholder="请输入物品数量" suffix-icon="el-icon-search" class="ml-5" v-model="gnumber"></el-input>
      &nbsp;&nbsp;<el-button class="ml-5" type="primary" @click="search">搜索</el-button>
      &nbsp;<el-button type="warning" @click="reset">重置</el-button>
    </div>

        <div style="margin: 10px 0">
          <el-button type="primary" @click="handleAdd">新增 <i class="el-icon-circle-plus-outline"></i></el-button>
          &nbsp;
        </div>

    <el-table :data="tableData" border stripe :header-cell-class-name="'headerBg'"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="gid" label="ID" width="80"></el-table-column>
      <el-table-column prop="gname" label="物品名称" width="140"></el-table-column>
      <el-table-column prop="glove" label="物品爱心值"></el-table-column>
      <el-table-column prop="gnumber" label="物品数量"></el-table-column>
      <el-table-column label="操作"  width="300" align="center">
        <template slot-scope="scope">
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
              @confirm="del(scope.row.gid)"
          >
            <el-button type="danger" slot="reference">删除 <i class="el-icon-remove-outline"></i></el-button>
          </el-popconfirm>
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

    <el-dialog title="用户信息" :visible.sync="dialogFormVisible" width="30%" >
      <el-form label-width="100px" size="small">
        <el-form-item label="物品名称">
          <el-input v-model="form.gname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="物品爱心值">
          <el-input v-model="form.glove" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="物品数量">
<!--          <el-input v-model="form.gnumber" autocomplete="off"></el-input>-->
          <el-input-number v-model="form.gnumber"  placeholder="0" :min="0" ></el-input-number>
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
  name: "Goods",
  data() {
    return {
      tableData: [],
      total: 0,
      pageNum: 1,
      pageSize: 5,
      gname: "",
      glove: "",
      gnumber:"",
      loveValue:"",
      form: {},
      dialogFormVisible: false,
      multipleSelection: [],
      options: [],
    }
  },
  created() {
    this.load();
    this.searchName()
  },
  //decodeURL
  methods: {
    load() {
      this.request.get("/goods/goodsListPage", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          gname: this.gname,
          glove: this.glove,
          gnumber: this.gnumber,
        }
      }).then(res => {
        this.tableData = res.data.records
        this.total = res.data.total

      })
    },
    searchName(){
      this.request.get("/goods/findByName").then(res=>{
        this.options=res.data;
      })
    },
    search(){
      this.request.get("/goods/goodsListPage", {
        params: {
          pageNum: 1,
          pageSize: this.pageSize,
          gname: this.gname,
          glove: this.glove,
          gnumber: this.gnumber,
        }
      }).then(res => {

        this.tableData = res.data.records
        this.total = res.data.total

      })
    },
    save() {
      this.request.post("/goods/addOrUpdate", this.form).then(res => {
        if (res.code==200) {
          this.$message.success("保存成功")
          this.dialogFormVisible = false
          this.load()
          this.search()
        } else {
          this.$message.error(res.msg)
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
      this.request.delete("/goods/del/" + id).then(res => {
        if (res.code==200) {
          this.$message.success("删除成功")
          this.search()
        } else {
          this.$message.error("删除失败")
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    reset() {
      this.gname = ""
      this.glove = ""
      this.gnumber = ""
      this.load()
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {
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