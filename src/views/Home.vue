<template>
  <div style="color: #666;font-size: 16px;">

    <b>欢迎您! <span style="color:#2e3fd9;font-size: 18px">{{user.uname}}</span> 来到爱心捐赠管理系统!</b>


  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

