import { useUserStore } from "@/stores";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/home"
    },
    {
      path: "/home",
      name: "home",
      component: () => import("@/views/home/index.vue"),
      meta: {
        title: "首页",
        isNavbar: true
      }
    },
    {
      path: "/signin",
      name: "signin",
      component: () => import("@/views/signin/index.vue"),
      meta: {
        title: "登录",
        isNavbar: false
      }
    },
    {
      path: "/:pathMatch(.*)",
      component: () => import("@/views/404/index.vue")
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("@/views/signup/index.vue"),
      meta: {
        title: "注册",
        isNavbar: false
      }
    },
    {
      path: "/moment",
      name: "moment",
      component: () => import("@/views/moment/index.vue"),
      meta: {
        title: "动态",
        isNavbar: true
      }
    },
    {
      path: "/detail/:id",
      name: "detail",
      component: () => import("@/views/detail/index.vue"),
      meta: {
        title: "详情",
        isNavbar: true
      }
    },
    {
      path: "/user/:username",
      name: "user",
      component: () => import("@/views/user/index.vue"),
      meta: {
        title: "用户主页",
        isNavbar: true
      }
    }
    // {
    //   path: "/user/edit",
    //   name: "edituser",
    //   component: () => import("@/views/"),
    //   meta: {
    //     title: "个人资料编辑",
    //     isNavbar: true
    //   }
    // }
  ]
});

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();

  // 1.设置标题
  document.title = to.meta.title ? (to.meta.title as string) : "";

  // 2.判断是访问登陆页，有 Token 就在当前页面，没有 Token 重置路由到登陆页
  if (to.path.toLocaleLowerCase() === "/signin" || to.path.toLocaleLowerCase() === "/signup") {
    if (userStore.token) return next(from.fullPath);
    return next();
  }

  // 3.判断是否有 Token，没有重定向到 登录 页面
  if (!userStore.token) return next({ path: "/signin", replace: true });

  // 4.正常访问页面
  next();
});

export default router;
