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
    console.log("后端返回用户的路由权限信息");
    // return request<any, RouteVO[]>({
    //   url: "/api/v1/menus/routes",
    //   method: "get",
    // });
    return {
      code: "00000",
      data: [
        {
          path: "/robot",
          component: "Layout",
          redirect: "/robot/robotManage",
          name: "Robot",
          meta: {
            title: "机器人管理",
            icon: "document",
            hidden: false,
            alwaysShow: false,
            params: null,
          },
          children: [
            {
              path: "/robot/robotManage",
              component: "robot/robotManage/index",
              name: "RobotManage",
              meta: {
                title: "机器人管理",
                icon: "document",
                hidden: false,
                alwaysShow: false,
                params: null,
              },
            },
            {
              path: "/robot/taskSchedule",
              component: "robot/taskSchedule/index",
              name: "TaskSchedule",
              meta: {
                title: "定时任务管理",
                icon: "el-icon-Link",
                hidden: false,
                alwaysShow: false,
                params: null,
              },
            },
          ],
        },
        {
          path: "/resource",
          component: "Layout",
          redirect: "/resource/personResource",
          name: "Resource",
          meta: {
            title: "资源管理",
            icon: "cascader",
            hidden: false,
            alwaysShow: true,
            params: null,
          },
          children: [
            {
              path: "/resource/personResource",
              component: "resource/personResource/index",
              name: "PersonResource",
              meta: {
                title: "个人资源",
                icon: "",
                hidden: false,
                alwaysShow: false,
                params: null,
              },
            },
            {
              path: "/resource/departmentResource",
              component: "resource/departmentResource/index",
              name: "DepartmentResource",
              meta: {
                title: "部门资源",
                icon: "",
                hidden: false,
                alwaysShow: false,
                params: null,
              },
            },
            {
              path: "/resource/publicResource",
              component: "resource/publicResource/index",
              name: "PublicResource",
              meta: {
                title: "公开资源",
                icon: "",
                hidden: false,
                alwaysShow: false,
                params: null,
              },
            },
          ],
        },
        {
          path: "/attendCheck",
          component: "Layout",
          redirect: "/attendCheck/departmentCheck",
          name: "AttendCheck",
          meta: {
            title: "考勤组管理",
            icon: "cascader",
            hidden: false,
            alwaysShow: true,
            params: null,
          },
          children: [
            {
              path: "/attendCheck/departmentCheck",
              component: "attendCheck/departmentCheck/index",
              name: "DepartmentCheck",
              meta: {
                title: "部门考勤管理",
                icon: "",
                hidden: false,
                alwaysShow: false,
                params: null,
              },
            },
            {
              path: "/attendCheck/checkTeam",
              component: "attendCheck/checkTeam/index",
              name: "CheckTeam",
              meta: {
                title: "考勤组管理",
                icon: "",
                hidden: false,
                alwaysShow: false,
                params: null,
              },
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
