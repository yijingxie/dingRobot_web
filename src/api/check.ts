import request from "@/utils/request";

// 考勤组管理接口
class CheckAPI {
  // 获取全部考勤信息
  static getCheckList(page: number, pageSize: number, name: string = "") {
    return request<any, getCheckListResponse>({
      url: `/ding/dept/getDeptListDetail?page=${page}&pageSize=${pageSize}&name=${name}`,
      method: "get",
    });
  }

  // 更新部门考勤信息
  static updateCheckList(data: updateCheckListParamter) {
    // 思路总结
    //0. 更新部门考勤信息，都需要携带修改的部门的id
    //1. 是否开启考勤：修改is_robot_attendance的值
    //2. 是否开启考勤周报：修改is_attendance_week_paper的值
    //3. 修改负责人：修改ResponsibleUserIds的值
    //4. 修改推送群聊：修改robot_token的值（机器人在群里，修改推送群聊需要群token，即群里的机器人token）
    return request<any, any>({
      url: "/ding/dept/updateDept",
      method: "post",
      data: data,
    });
  }
}

export default CheckAPI;

/*-------------返回数据 ts：获取全部部门考勤信息接口------------*/
export interface getCheckListResponse {
  list: checkListResponse[];
  total: number; // 数据总数
  page: number; // 当前页码
  pageSize: number; // 一页显示多少条数据
}

// 单个部门考勤信息列表 ts
export interface checkListResponse {
  CreatedAt: string;
  UpdatedAt: string;
  UserList: userResponse[];
  dept_id: number; // 部门id
  Deleted: null;
  name: string; // 部门名称
  parent_id: number;
  is_send_first_person: number;
  robot_token: string; // 机器人token
  is_robot_attendance: boolean; // 是否开启考勤
  is_jianshu_or_blog: number;
  is_leet_code: number;
  is_study_week_paper: number;
  is_attendance_week_paper: boolean; // 是否开启考勤周报
  ResponsibleUsers: userResponse[]; // 部门负责人信息列表
  Children: null;
}

// 单个部门成员信息
export interface userResponse {
  userid: string; // 成员id
  Deleted: null;
  CreatedAt: string;
  UpdatedAt: string;
  name: string; // 成员姓名
  mobile: string; // 成员手机号
  password: string;
  dept_id: number;
  authorityId: number;
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

/*-------------发请求参数 ts：更新部门考勤信息----------------*/
export interface updateCheckListParamter {
  ResponsibleUserIds: string; // 负责人id
  dept_id: number; // 部门id
  is_attendance_week_paper: boolean; // 是否开启考勤周报
  is_jianshu_or_blog: number;
  is_leet_code: number;
  is_robot_attendance: boolean; // 是否开启考勤
  is_send_first_person: 0;
  robot_token: string; // 机器人token
}
