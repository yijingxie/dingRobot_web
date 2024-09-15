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
  static addTask(addTaskForm: any) {
    return request<any, any>({
      url: "/ding/cronTask/addTask",
      method: "post",
      data: addTaskForm,
    });
  }

  // 获取通知人员姓名  模糊查询
  static getPersonName(name: string) {
    return request<any, any>({
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

// 添加任务请求携带的参数的 ts类型
export interface addTaskFormParamter {
  robot_id: string; // 机器人id
  task_name: string; // 任务名称
  repeat_time: string; // 重复时间类型
  detail_time: string; // 具体时间信息
  spec: string; // 不知道是啥
  msg_text: msg_textParamter; // 其他内容
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
