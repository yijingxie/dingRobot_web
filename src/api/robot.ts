import request from "@/utils/request";
import { ValueOf } from "element-plus/es/components/table/src/table-column/defaults";

class RobotAPI {
  // 机器人管理接口：获取当前所有的机器人信息
  static getRobotList(queryParams: any) {
    console.log("queryParams");
    console.log(queryParams.page);
    console.log(queryParams.pageSize);
    return request<any, any>({
      url: `/ding/robot/getRobotList?page=${queryParams.page}&pageSize=${queryParams.pageSize}&name=&is_shared=0`,
      method: "get",
    });
  }
}

export default RobotAPI;

// 请求参数的ts类型
export interface queryData {
  // 当前页码
  page: number;

  // 一页展示多少个数据
  pageSize: number;
}

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
