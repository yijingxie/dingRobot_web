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

  // 获取所有考勤组信息
  static getAttendGropuList(page: number, pageSize: number) {
    return request<any, getAttendGroupListResponse>({
      url: `/ding/attendanceGroup/GetAttendanceGroupList?page=${page}&pageSize=${pageSize}`,
      method: "get",
    });
  }

  // 更新考勤组信息
  static updateAttenGroup(data: updateAttenGroupParamter) {
    return request<any, any>({
      url: "/ding/attendanceGroup/updateAttendanceGroup",
      method: "put",
      data: data,
    });
  }

  // 同步考勤组信息到数据库
  static importAttendGroupData() {
    return request<any, any>({
      url: "/ding/attendanceGroup/ImportAttendanceGroupData",
      method: "get",
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

/*-------------发请求参数 ts：更新部门考勤信息接口----------------*/
export interface updateCheckListParamter {
  ResponsibleUserIds: string[]; // 负责人id
  dept_id: number; // 部门id
  is_attendance_week_paper: boolean; // 是否开启考勤周报
  is_jianshu_or_blog: number;
  is_leet_code: number;
  is_robot_attendance: boolean; // 是否开启考勤
  is_send_first_person: 0;
  robot_token: string; // 机器人token
}

/*-------------返回数据 ts：获取所有考勤组信息接口----------------*/
export interface getAttendGroupListResponse {
  list: attendGroupListResponse[];
  total: number; // 数据总数
  page: number; // 当前页码
  pageSize: number; // 一页有多少个数据
}

// 单个考勤组信息
export interface attendGroupListResponse {
  CreatedAt: string;
  UpdatedAt: string; // 更新时间
  DeletedAt: null;
  group_id: number; // 考勤组id
  group_name: string; // 考勤组名称
  member_count: number; // 考勤组成员总数
  work_day_list: null;
  classes_list: null;
  selected_class: null;
  robot_alter_task_id: number; // 提醒考勤定时任务id
  robot_attend_task_id: number; // 考勤定时任务id
  alert_spec: string; // 提醒规则
  attend_spec: string; // 考勤规则
  rest_times: null;
  is_alter_attendance: boolean; // 是否开启考勤提醒
  is_robot_attendance: boolean; // 是否开启考勤
  is_send_first_person: boolean;
  is_in_school: boolean; // 是否在校
  alert_time: number; // 提前多少分钟提醒
  delay_time: number; // 延迟多少分钟考勤
  next_time: string; // 下一次考勤时间
  is_attend_week_paper: boolean; // 是否开启考勤周报
}

/*-------------发请求参数 ts：更新考勤组信息接口----------------*/
export interface updateAttenGroupParamter {
  alert_time: number; // 提前多少分钟提醒
  delay_time: number; // 延迟多少分钟考勤
  group_id: number; // 考勤组id
  // is_alert_attendance: boolean,   其实这里应该是写【is_alert_attendance】的，但是估计是后端字段单词打错了，现在先按照后端的【is_alter_attendance】来
  is_alter_attendance: boolean; // 是否开启考勤提醒
  is_attend_week_paper: boolean; // 是否考勤周报
  is_in_school: boolean; // 是否在校
  is_robot_attendance: boolean; // 是否开启考勤
}
