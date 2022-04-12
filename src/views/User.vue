<template>
  <div>
    <div style="margin: 10px 0">
      用户名:&nbsp;&nbsp;<el-input style="width: 200px" placeholder="请输入用户名" suffix-icon="el-icon-search" v-model="username"></el-input>
      爱心值:&nbsp;&nbsp;<el-input style="width: 200px" placeholder="请输入爱心值" suffix-icon="el-icon-message" class="ml-5" v-model="loveValue"></el-input>
      地址:&nbsp;&nbsp;<el-input style="width: 200px" placeholder="请输入地址" suffix-icon="el-icon-position" class="ml-5" v-model="address"></el-input>
      &nbsp;&nbsp;<el-button class="ml-5" type="primary" @click="search">搜索</el-button>
      &nbsp;<el-button type="warning" @click="reset">重置</el-button>
    </div>

    <div style="margin: 10px 0">
      <el-button type="primary" @click="handleAdd">新增 <i class="el-icon-circle-plus-outline"></i></el-button>
      &nbsp;
      <el-popconfirm
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
      &nbsp;
      <el-upload :action="'http://' + serverIp + ':9091/user/import'" :show-file-list="false" accept="xlsx" :on-success="handleExcelImportSuccess" style="display: inline-block">
        <el-button type="primary" class="ml-5">导入 <i class="el-icon-bottom"></i></el-button>
      </el-upload>
      &nbsp;
      <el-button type="primary" @click="exp" class="ml-5">导出 <i class="el-icon-top"></i></el-button>
    </div>

    <el-table :data="tableData" border stripe :header-cell-class-name="'headerBg'"  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="uid" label="ID" width="80"></el-table-column>
      <el-table-column prop="uname" label="用户名" width="140"></el-table-column>
      <el-table-column prop="usex" label="性别" width="120"></el-table-column>
      <el-table-column prop="ulove" label="爱心值"></el-table-column>
      <el-table-column prop="uphoto" label="电话"></el-table-column>
      <el-table-column prop="uaddress" label="地址"></el-table-column>
      <el-table-column label="操作"  width="200" align="center">
        <template slot-scope="scope">
          <el-button type="success" @click="handleEdit(scope.row)">编辑 <i class="el-icon-edit"></i></el-button>
          <el-popconfirm
              class="ml-5"
              placement="left-end"
              confirm-button-text='确定'
              cancel-button-text='我再想想'
              icon="el-icon-info"
              icon-color="red"
              title="您确定删除吗？"
              @confirm="del(scope.row.uid)"
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

    <el-dialog title="用户信息" :visible.sync="dialogFormVisible" width="30%" >
      <el-form label-width="80px"  size="small">
        <el-form-item label="用户名">
          <el-input v-model="form.uname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户性别">
<!--          <el-input v-model="form.usex" autocomplete="off"></el-input>-->
          <el-select v-model="form.usex" placeholder="请选择" style="width: 100%">
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="角色">
<!--          <el-input v-model="form.role"  :disabled="true" placeholder="0" autocomplete="off"></el-input>-->
          <el-select clearable v-model="form.role" placeholder="请选择角色" style="width: 100%">
            <el-option v-for="item in roles" :key="item.name" :label="item.name" :value="item.flag"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="爱心值">
          <el-input v-model="form.ulove"  :disabled="true" placeholder="0" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="uphoto" label="电话">
          <el-input v-model="form.uphoto"  maxlength="11" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.uaddress" autocomplete="off"></el-input>
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
import {serverIp} from "../../public/config";

export default {
  name: "User",
  data() {
    return {
      tableData: [],
      serverIp: serverIp,
      total: 0,
      pageNum: 1,
      pageSize: 5,
      username: "",
      email: "",
      address: "",
      loveValue:"",
      form: {},
      dialogFormVisible: false,
      multipleSelection: [],
      options: [{
        value: '男',
        label: '男'
      }, {
        value: '女',
        label: '女'
      }],
      roles:[],
     /* rules: {
        uphoto: [
          {required: true, message: '请输入电话号码', trigger: 'blur'},
          {min: 11, max: 11, message: '电话号码11位', trigger: 'blur'}
        ]
      }*/
    }
  },
  created() {
    this.load()
  },
  //decodeURL
  methods: {
    load() {

      this.request.get("/user/userListPage", {
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          username: this.username,
          loveValue: this.loveValue,
          address: this.address,
        }
      }).then(res => {
        //console.log(res)

        this.tableData = res.data.records
       // console.log(this.tableData)
        this.total = res.data.total

      });
      this.request.get("/role/findAll").then(res=>{
        this.roles=res.data;
      })
    },
    search(){
      this.request.get("/user/userListPage", {
        params: {
          pageNum: 1,
          pageSize: this.pageSize,
          username: this.username,
          loveValue: this.loveValue,
          address: this.address,
        }
      }).then(res => {
        //console.log(res)

        this.tableData = res.data.records
        // console.log(this.tableData)
        this.total = res.data.total

      })
    },
    save() {
      this.request.post("/user/addOrUpdate", this.form).then(res => {
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
      this.request.delete("/user/del/" + id).then(res => {
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
    delBatch() {
      let ids = this.multipleSelection.map(v => v.uid)  // [{}, {}, {}] => [1,2,3]
      this.request.post("/user/del/batch", ids).then(res => {
        if (res.code==200) {
          this.$message.success("批量删除成功")
          this.load()
        } else {
          this.$message.error("批量删除失败")
        }
      })
    },
    reset() {
      this.username = ""
      this.loveValue = ""
      this.address = ""
      this.load()
    },
    handleSizeChange(pageSize) {

      this.pageSize = pageSize
      this.load()
    },
    handleCurrentChange(pageNum) {

      this.pageNum = pageNum
      this.load()
    },
    exp() {
      window.open(`http://${serverIp}:9091/user/export`)
      // this.request.get("/user/export").then(res=>{
      //   this.$message.success("导出成功")
      // })
    },
    handleExcelImportSuccess() {
      this.$message.success("导入成功")
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