import request from "@/utils/request";

class RobotAPI {
  // 机器人管理接口：获取当前所有的机器人信息
  static getRobotList(pageNow: number, pageSize: number) {
    return request<any, ResponseRobotData>({
      url: `/ding/robot/getRobotList?page=${pageNow}&pageSize=${pageSize}&name=&is_shared=0`,
      method: "get",
    });
  }

  // 添加|修改机器人接口
  static addRobot(data: addRobotParameter) {
    return request<any, any>({
      url: "/ding/robot/addRobot",
      method: "post",
      data: data,
    });
  }

  // 删除 | 批量删除机器人
  static deleteRobot(robot_ids: deleteRobotParamter) {
    return request<any, any>({
      url: "/ding/robot/removeRobot",
      method: "delete",
      data: robot_ids,
    });
  }

  // 获取通知人员姓名  模糊查询
  static getPersonName(name: string) {
    return request<any, getPersonNameResponse>({
      url: `/ding/user/robot@user?name=${name}`,
      method: "get",
    });
  }
}

export default RobotAPI;

// ----------------------机器人相关ts类型------------------------------

// 单个机器人的数据列表
export interface Robot {
  // 机器人id
  robot_id: string;

  // 机器人名称
  name: string;

  // 机器人添加者id
  ding_user_id: string;

  // 机器人添加者名称
  user_name: string;

  // 机器人是否共享    1：共享  0：不共享
  is_shared: number;

  // 机器人任务
  Tasks?: null;

  deleted?: null;

  ding_token?: null;
}

// 当前页面所有机器人信息的数据列表
export type RobotList = Robot[];

// 关于当前页面所有机器人的后端返回信息
export interface ResponseRobotData {
  // 机器人信息列表
  list: RobotList;

  // 数据总数
  total: number;

  // 当前页码
  page: number;

  // 一页展示多少个数据
  pageSize: number;
}

// 添加|修改机器人的参数的ts类型
export interface addRobotParameter {
  is_shared: number; // 是否共享
  name: string; // 机器人名字
  robot_id: string; // 机器人id
}

// 删除机器人请求携带参数的 ts类型
export interface deleteRobotParamter {
  // 机器人id
  robot_ids: string[];
}

export interface getPersonNameList {
  userid: string; // 人员id
  name: string; // 人员姓名
  mobile: string; // 手机号
  Deleted: null;
  CreatedAt: string; // 创建时间
  UpdatedAt: string; // 更新时间
  dept_id: number;
  authority: {
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: null;
    authorityId: number;
    authorityName: string;
    menus: null;
    defaultRouter: string;
  };
  InterviewRecords: null;
  is_study_week_paper: number;
  is_leet_code: number;
  is_jianshu_or_blog: number;
  jianshu_addr: string;
  blog_addr: string;
  leetcode_addr: string;
  auth_token: string;
  ding_token: {};
  ext_attrs: null;
}

//  获取通知人员姓名接口返回值的 ts类型
export interface getPersonNameResponse {
  list: getPersonNameList[]; // 人员具体数据
  total: number; // 数据总数
  page: number;
  pageSize: number;
}
