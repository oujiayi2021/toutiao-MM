import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [{
    path: "/login",
    name: 'login',
    component: () => import("@/views/login")
  },
  {
    path: "/",
    component: () => import("@/views/layout"),
    children: [{
      path: "",
      name: 'home',
      component: () => import("@/views/home/index.vue")
    }, {
      path: "/qa",
      name: 'qa',
      component: () => import("@/views/qa/index.vue")
    }, {
      path: "/vedio",
      name: 'vedio',
      component: () => import("@/views/vedio/index.vue")
    }, {
      path: "/my",
      name: 'my',
      component: () => import("@/views/my/index.vue")
    }, ]
  },
  {
    path: "/search",
    name: 'search',
    component: () => import("@/views/search/index.vue")
  },
  {
    path: "/user-chat",
    name: 'user-chat',
    component: () => import("@/views/my/chat.vue")
  },
  {
    path: "/article/:articleId",
    name: 'article',
    component: () => import("@/views/article/index.vue"),
    props: true //开启props传参，把路由参数映射到组件的props数据中
  },
  {
    path: "/collection",
    name: 'collection',
    component: () => import("@/views/collection/collection.vue")
  },
  {
    path: "/user/profile",
    name: 'user-profile',
    component: () => import("@/views/user-profile/index.vue")
  },
  {
    path: "/history",
    name: 'history',
    component: () => import("@/views/my/history.vue")
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  let isLogin = window.localStorage.getItem('TOUTIAO_USER');
  // console.log(isLogin);
  // next()
  if (isLogin == 'null' && to.path != '/login') {
    next('/login')
    setTimeout('console.clear()', 200)
  } else {
    next()
  }
})

export default router