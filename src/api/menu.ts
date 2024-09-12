import request from "@/utils/request";

class MenuAPI {
  /**
   * 获取当前用户的路由列表
   * <p/>
   * 无需传入角色，后端解析token获取角色自行判断是否拥有路由的权限
   *
   * @returns 路由列表
   */
  static getRoutes() {
    // return request<any, RouteVO[]>({
    //   url: "/api/v1/menus/routes",
    //   method: "get",
    // });
    return {
      code: "00000",
      data: [
        {
          path: "/doc",
          component: "Layout",
          redirect: "https://juejin.cn/post/7228990409909108793",
          name: "/doc",
          meta: {
            title: "平台文档",
            icon: "document",
            hidden: false,
            alwaysShow: false,
            params: null,
          },
          children: [
            {
              path: "internal-doc",
              component: "demo/internal-doc",
              name: "InternalDoc",
              meta: {
                title: "平台文档(内嵌)",
                icon: "document",
                hidden: false,
                alwaysShow: false,
                params: null,
              },
            },
            {
              path: "https://juejin.cn/post/7228990409909108793",
              name: "Https://juejin.cn/post/7228990409909108793",
              meta: {
                title: "平台文档(外链)",
                icon: "el-icon-Link",
                hidden: false,
                alwaysShow: false,
                params: null,
              },
            },
          ],
        },
        {
          path: "/multi-level",
          component: "Layout",
          name: "/multiLevel",
          meta: {
            title: "多级菜单",
            icon: "cascader",
            hidden: false,
            alwaysShow: true,
            params: null,
          },
          children: [
            {
              path: "multi-level1",
              component: "demo/multi-level/level1",
              name: "MultiLevel1",
              meta: {
                title: "菜单一级",
                icon: "",
                hidden: false,
                alwaysShow: true,
                params: null,
              },
              children: [
                {
                  path: "multi-level2",
                  component: "demo/multi-level/children/level2",
                  name: "MultiLevel2",
                  meta: {
                    title: "菜单二级",
                    icon: "",
                    hidden: false,
                    alwaysShow: false,
                    params: null,
                  },
                  children: [
                    {
                      path: "multi-level3-1",
                      component: "demo/multi-level/children/children/level3-1",
                      name: "MultiLevel31",
                      meta: {
                        title: "菜单三级-1",
                        icon: "",
                        hidden: false,
                        keepAlive: true,
                        alwaysShow: false,
                        params: null,
                      },
                    },
                    {
                      path: "multi-level3-2",
                      component: "demo/multi-level/children/children/level3-2",
                      name: "MultiLevel32",
                      meta: {
                        title: "菜单三级-2",
                        icon: "",
                        hidden: false,
                        keepAlive: true,
                        alwaysShow: false,
                        params: null,
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      msg: "一切ok",
    };
  }
}

export default MenuAPI;

/** RouteVO，路由对象 */
export interface RouteVO {
  /** 子路由列表 */
  children: RouteVO[];
  /** 组件路径 */
  component?: string;
  /** 路由属性 */
  meta?: Meta;
  /** 路由名称 */
  name?: string;
  /** 路由路径 */
  path?: string;
  /** 跳转链接 */
  redirect?: string;
}

/** Meta，路由属性 */
export interface Meta {
  /** 【目录】只有一个子路由是否始终显示 */
  alwaysShow?: boolean;
  /** 是否隐藏(true-是 false-否) */
  hidden?: boolean;
  /** ICON */
  icon?: string;
  /** 【菜单】是否开启页面缓存 */
  keepAlive?: boolean;
  /** 路由title */
  title?: string;
}
