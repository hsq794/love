<template>
  <el-menu :default-openeds="['1', '3']" style="min-height: 100%; overflow-x: hidden"
           background-color="rgb(48, 65, 86)"
           text-color="#fff"
           active-text-color="#ffd04b"
           :collapse-transition="false"
           :collapse="isCollapse"
           router
  >
    <div style="height: 60px; line-height: 60px; text-align: center">
      <img src="../assets/love.png" alt="" style="width: 30px; position: relative; top: 5px; right: 5px">
      <b style="color: white" v-show="logoTextShow">爱心捐赠管理系统</b>
    </div>
<!--  动态菜单栏  -->
    <div v-for="item in menus" :key="item.id">
      <div v-if="item.path">
        <el-menu-item :index="item.path">
          <i :class="item.icon"></i>
          <span slot="title">{{ item.name }}</span>
        </el-menu-item>
      </div>
      <div v-else>
        <el-submenu :index="item.id + ''">
          <template slot="title">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.name }}</span>
          </template>
          <div  v-for="subItem in item.children" :key="subItem.id">
            <el-menu-item :index="subItem.path">
              <i :class="subItem.icon"></i>
              <span slot="title">{{ subItem.name }}</span>
            </el-menu-item>
          </div>
        </el-submenu>
      </div>
    </div>
<!--    <el-menu-item index="/home">-->
<!--      <template slot="title">-->
<!--        <i class="el-icon-house"></i>-->
<!--        <span slot="title">主页</span>-->
<!--      </template>-->
<!--    </el-menu-item>-->
<!--    <el-submenu index="2">-->
<!--      <template slot="title">-->
<!--        <i class="el-icon-menu"></i>-->
<!--        <span slot="title">系统管理</span>-->
<!--      </template>-->
<!--      <el-menu-item index="/user">-->
<!--        <i class="el-icon-user"></i>-->
<!--        <span slot="title">用户管理</span>-->
<!--      </el-menu-item>-->
<!--      <el-menu-item index="/role">-->
<!--        <i class="el-icon-s-custom"></i>-->
<!--        <span slot="title">角色管理</span>-->
<!--      </el-menu-item>-->
<!--      <el-menu-item index="/menu">-->
<!--        <i class="el-icon-menu"></i>-->
<!--        <span slot="title">菜单管理</span>-->
<!--      </el-menu-item>-->
<!--      <el-menu-item index="/donation">-->
<!--        <i class="el-icon-data-board"></i>-->
<!--        <span slot="title">捐赠管理</span>-->
<!--      </el-menu-item>-->
<!--      <el-menu-item index="/receive">-->
<!--        <i class="el-icon-data-line"></i>-->
<!--        <span slot="title">获赠管理</span>-->
<!--      </el-menu-item>-->
<!--      <el-menu-item index="/goods">-->
<!--        <i class="el-icon-s-goods"></i>-->
<!--        <span slot="title">物品管理</span>-->
<!--      </el-menu-item>-->
<!--&lt;!&ndash;      <el-menu-item index="/echarts">&ndash;&gt;-->
<!--&lt;!&ndash;        <i class="el-icon-s-data"></i>&ndash;&gt;-->
<!--&lt;!&ndash;        <span slot="title">数据报表</span>&ndash;&gt;-->
<!--&lt;!&ndash;      </el-menu-item>&ndash;&gt;-->
<!--    </el-submenu>-->
  </el-menu>
</template>

<script>
export default {
  name: "Aside",
  props: {
    isCollapse: Boolean,
    logoTextShow: Boolean
  },
  data(){
    return {
      menus: localStorage.getItem("menus") ? JSON.parse(localStorage.getItem("menus")) : [],
      opens: localStorage.getItem("menus") ? JSON.parse(localStorage.getItem("menus")).map(v => v.id + '') : []
    }
  }
}
</script>

<style scoped>

</style>