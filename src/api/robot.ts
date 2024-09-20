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

  // 添加任务
  static addTask(addTaskForm: addTaskFormParamter) {
    return request<any, any>({
      url: "/ding/cronTask/addTask",
      method: "post",
      data: addTaskForm,
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

// msg_text的参数类型
export interface msg_textParamter {
  // 是否全体通知
  //  是  →  不添加通知人信息（姓名 + 手机号）
  //  否  →  添加通知人信息
  at: {
    // 通知人员信息
    atMobiles: [
      {
        atMobile: string; // 通知人员手机号
        name: string; // 通知人员姓名
      },
    ];
    isAtAll: boolean; // 是否全体通知
  };
  text: {
    content: string; // 通知的内容
  };
  msgtype: string; // 通知的类型
}

// 添加任务请求携带的参数总结
// 机器人id
// 任务名称
// 重复时间类型
//  --立即发送  获取点击确定按钮的时间
//  --仅发送一次  发送时间
//  --周重复  发送时间=周几+当天发送时间
//  --spec  spec
// 是否全体通知
// --全体通知  不加通知人姓名
// --不全体通知  加通知人姓名
// 通知的内容
// 添加任务请求携带的参数的 ts类型
export interface addTaskFormParamter {
  robot_id: string; // 机器人id
  task_name: string; // 任务名称
  repeat_time: string; // 重复时间类型
  detail_time: string; // 具体时间信息
  spec: string; // 不知道是啥
  msg_text: msg_textParamter; // 其他内容
  weekList?: number[]; // 我收集表单数据的时候用的，发请求的时候会把它删掉
}

// 添加任务接口返回的数据的 ts类型
export interface addTaskResponse {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: null;
  task_id: number; // 任务id
  is_suspend: boolean;
  task_name: string; // 任务名称
  user_id: string; // 登录账号的id
  user_name: string; // 登录账号的名称
  robot_id: "8f41f992e61336847301aca1bf12ebd93f2dd77350df28e9b800f9255c0bf514";
  robot_name: "测试222";
  detail_time_for_user: "周重复 ：周日周五周三周一21：21：29";
  spec: "29 21 21 ? * 0,5,3,1";
  front_repeat_time: "周重复/0/5/3/1";
  front_detail_time: "21:21:29";
  msg_text: [];
  msg_link: null;
  msg_mark_down: null;
  next_time: "2024-09-18T21:21:29+08:00";
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
