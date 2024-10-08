import { RouteRecordRaw } from "vue-router";
import { constantRoutes } from "@/router";
import { store } from "@/store";
import MenuAPI, { RouteVO } from "@/api/menu";
import router from "@/router";

const modules = import.meta.glob("../../views/**/**.vue");
const Layout = () => import("@/layout/index.vue");

export const usePermissionStore = defineStore("permission", () => {
  /** 所有路由，包括静态和动态路由 */
  const routes = ref<RouteRecordRaw[]>([]);
  /** 混合模式左侧菜单 */
  const mixLeftMenus = ref<RouteRecordRaw[]>([]);

  /**
   * 生成动态路由
   */
  function generateRoutes() {
    const result: any = MenuAPI.getRoutes();
    // 转换路由数据为组件
    const dynamicRoutes = transformRoutes(result.data);
    // 把异步路由加到router里面(注册路由)
    dynamicRoutes.forEach((route: RouteRecordRaw) => router.addRoute(route));
    routes.value = constantRoutes.concat(dynamicRoutes);
    // return new Promise<RouteRecordRaw[]>((resolve, reject) => {
    // 通过接口获取该用户的动态路由
    // MenuAPI.getRoutes()
    //   .then((data) => {
    //     // dynamicRoutes只包含返回的路由（不包含静态路由）
    //     const dynamicRoutes = transformRoutes(data);
    //     // routes.value是当前用户的全部路由（静态路由 + 返回的异步路由）
    //     routes.value = constantRoutes.concat(dynamicRoutes);
    //     resolve(dynamicRoutes);
    //   })
    //   .catch((error) => {
    //     reject(error);
    //   });
    // });
  }

  /**
   * 混合模式菜单下根据顶部菜单路径设置左侧菜单
   *
   * @param topMenuPath - 顶部菜单路径
   */
  const setMixLeftMenus = (topMenuPath: string) => {
    const matchedItem = routes.value.find((item) => item.path === topMenuPath);
    if (matchedItem && matchedItem.children) {
      mixLeftMenus.value = matchedItem.children;
    }
  };

  return {
    routes,
    generateRoutes,
    mixLeftMenus,
    setMixLeftMenus,
  };
});

/**
 * 转换路由数据为组件
 */
const transformRoutes = (routes: RouteVO[]) => {
  const asyncRoutes: RouteRecordRaw[] = [];
  routes.forEach((route) => {
    const tmpRoute = { ...route } as RouteRecordRaw;
    // 顶级目录，替换为 Layout 组件
    if (tmpRoute.component?.toString() == "Layout") {
      tmpRoute.component = Layout;
    } else {
      // 其他菜单，根据组件路径动态加载组件
      const component = modules[`../../views/${tmpRoute.component}.vue`];
      if (component) {
        tmpRoute.component = component;
      } else {
        tmpRoute.component = modules[`../../views/error-page/404.vue`];
      }
    }

    if (tmpRoute.children) {
      tmpRoute.children = transformRoutes(route.children);
    }

    asyncRoutes.push(tmpRoute);
  });

  return asyncRoutes;
};

/**
 * 在组件外使用 Pinia store 实例
 * @see https://pinia.vuejs.org/core-concepts/outside-component-usage.html
 */
export function usePermissionStoreHook() {
  return usePermissionStore(store);
}
