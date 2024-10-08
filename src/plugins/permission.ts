import {
  NavigationGuardNext,
  RouteLocationNormalized,
  RouteRecordRaw,
} from "vue-router";

import NProgress from "@/utils/nprogress";
import { TOKEN_KEY } from "@/enums/CacheEnum";
import router from "@/router";
import { usePermissionStore, useUserStore } from "@/store";

export function setupPermission() {
  // 白名单路由
  const whiteList = ["/login", "/scanLogin"];
  console.log("前置守卫");

  // 前置守卫
  router.beforeEach(async (to: any, from: any, next: any) => {
    // 进度条开始
    NProgress.start();
    const hasToken = localStorage.getItem(TOKEN_KEY);
    if (hasToken) {
      if (to.path === "/login") {
        // 如果已登录，跳转到首页
        next({ path: "/" });
        NProgress.done();
      } else {
        const userStore = useUserStore();
        const hasRoles = userStore.user.roles && userStore.user.roles.length;
        // 判断有没有用户信息
        if (hasRoles) {
          // 如果未匹配到任何路由，跳转到404页面
          if (to.matched.length === 0) {
            next(from.name ? { name: from.name } : "/404");
          } else {
            // 如果路由参数中有 title，覆盖路由元信息中的 title
            const title =
              (to.params.title as string) || (to.query.title as string);
            if (title) {
              to.meta.title = title;
            }
            next();
          }
        } else {
          // 没有用户信息发请求获取用户信息
          const permissionStore = usePermissionStore();
          try {
            // 获取用户角色
            await userStore.getUserInfo();
            // 生成动态路由
            await permissionStore.generateRoutes();
            next({ ...to, replace: true });
          } catch (error) {
            // 移除 token 并重定向到登录页，携带当前页面路由作为跳转参数
            await userStore.resetToken();
            redirectToLogin(to, next);
            NProgress.done();
          }
        }
      }
    } else {
      // 未登录
      if (whiteList.includes(to.path)) {
        next(); // 在白名单，直接进入
      } else {
        // 不在白名单，重定向到登录页
        redirectToLogin(to, next);
        NProgress.done();
      }
    }
  });

  router.afterEach(() => {
    NProgress.done();
  });
}

/** 重定向到登录页 */
function redirectToLogin(
  to: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const params = new URLSearchParams(to.query as Record<string, string>);
  const queryString = params.toString();
  const redirect = queryString ? `${to.path}?${queryString}` : to.path;
  next(`/login?redirect=${encodeURIComponent(redirect)}`);
}

/** 判断是否有权限 */
export function hasAuth(
  value: string | string[],
  type: "button" | "role" = "button"
) {
  const { roles, perms } = useUserStore().user;

  // 超级管理员 拥有所有权限
  if (type === "button" && roles.includes("ROOT")) {
    return true;
  }

  const auths = type === "button" ? perms : roles;
  return typeof value === "string"
    ? auths.includes(value)
    : value.some((perm) => auths.includes(perm));
}
