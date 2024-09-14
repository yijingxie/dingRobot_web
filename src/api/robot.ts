import request from "@/utils/request";

class RobotAPI {
  // 机器人管理接口：获取当前所有的机器人信息
  static getRobotList(pageNow: number, pageSize: number) {
    return request<any, ResponseRobotData>({
      url: `/ding/robot/getRobotList?page=${pageNow}&pageSize=${pageSize}&name=&is_shared=0`,
      method: "get",
    });
  }

  // 添加机器人接口
  static addRobot(data: addRobotParameter) {
    return request<any, any>({
      url: "/ding/robot/addRobot",
      method: "post",
      data: data,
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

// 添加机器人的参数的ts类型
export interface addRobotParameter {
  is_shared: number; // 是否共享
  name: string; // 机器人名字
  robot_id: string; // 机器人id
}
