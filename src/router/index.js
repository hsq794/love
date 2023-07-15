import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Manage.vue'
import store from "@/store";

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/',
    component: () => import('../views/Manage.vue'),
    redirect: "/login",
    children: [
      { path: 'home', name: '主页', component: () => import('../views/Home.vue')},
      { path: 'user', name: '用户管理', component: () => import('../views/User.vue')},
      { path: 'role', name: '角色管理', component: () => import('../views/Role.vue')},
      { path: 'menu', name: '菜单管理', component: () => import('../views/Menu')},
      { path: 'donation', name: '捐赠管理', component: () => import('../views/Donation.vue')},
      { path: 'receive', name: '获赠管理', component: () => import('../views/Receive.vue')},
      { path: 'goods', name: '物品管理', component: () => import('../views/Goods.vue')},
      { path: 'echarts', name: '数据报表', component: () => import('../views/Echarts.vue')},
      { path: 'person', name: '个人信息', component: () => import('../views/Person.vue')},
      { path: 'password', name: '修改密码', component: () => import('../views/Password')},
      { path: 'notice', name: '公告配置', component: () => import('../views/Notice.vue')},
      { path: 'files', name: '文件管理', component: () => import('../views/Files.vue')}
    ]
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },

  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  localStorage.setItem("currentPathName", to.name)  // 设置当前的路由名称
  store.commit("setPath")

  // 未找到路由的情况
  if (!to.matched.length) {
    const user = localStorage.getItem("menus")
    if (user) {
      next("/404")
    } else {
      // 跳回登录页面
      next("/login")
    }
  }
  // 其他的情况都放行
  next()

})

export default router
