import request from "@/utils/request";
// 关于机器人任务的接口

class TaskAPI {
  // 添加任务
  static addTask(addTaskForm: addTaskFormParamter) {
    return request<any, addTaskResponse>({
      url: "/ding/cronTask/addTask",
      method: "post",
      data: addTaskForm,
    });
  }

  // 获取所有任务
  static getTaskList(pageNow: number, pageSize: number) {
    const parameter = <getTaskListParamter>{
      is_suspend: false,
      page: pageNow,
      pageSize: pageSize,
      robot_id: "",
      task_name: "",
    };

    return request<any, getTaskListResponse>({
      url: "/ding/cronTask/getTaskList",
      method: "post",
      data: parameter,
    });
  }

  // 修改任务接口 | 暂停继续任务接口
  static updateTask(data: updateTaskFormParamter) {
    return request<any, any>({
      url: "/ding/cronTask/updateTask",
      method: "put",
      data: data,
    });
  }

  // 根据 id 获取该任务的所有信息
  static getTaskDetailByID(id: number) {
    return request<any, getTaskDetailByIDResponse>({
      url: `/ding/cronTask/getTaskDetailByID?id=${id}`,
      method: "get",
    });
  }

  // 删除任务
  static removeTask(ID: number) {
    const parameter = {
      ID: ID,
    };
    return request<any, any>({
      url: "/ding/cronTask/removeTask",
      method: "delete",
      data: parameter,
    });
  }
}

export default TaskAPI;

// 发请求：获取所有任务
export interface getTaskListParamter {
  is_suspend: boolean;
  page: number; // 当前页码
  pageSize: number; // 一页展示多少个数据
  robot_id: string;
  task_name: string;
}

// 返回数据：获取所有任务返回的单个任务信息的 ts类型
export interface TaskResponse {
  ID: number;
  CreatedAt: string; // 任务创建时间
  UpdatedAt: string; // 任务更新时间
  DeletedAt: null;
  task_id: number; // 任务id
  is_suspend: boolean; // 是否暂停任务
  task_name: string; // 任务名称
  user_id: string; // 任务所属人id
  user_name: string; // 任务所属人名称
  robot_id: string; // 机器人id
  robot_name: string; // 机器人名称
  detail_time_for_user: string; // 发送规则
  spec: string;
  front_repeat_time: string; // 重复时间类型
  front_detail_time: string; // 重复具体时间
  msg_text: null;
  msg_link: null;
  msg_mark_down: null;
  next_time: string; // 下次发送时间
}

// 返回数据：获取所有任务接口
export interface getTaskListResponse {
  list: TaskResponse[];
  total: number; // 当前任务总数
  page: number; // 当前页码
  pageSize: number; // 一页显示多少条数据
}

// 返回数据：msg_text的参数类型
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

// 发请求：添加任务 | 修改任务 请求携带的参数总结
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
  id?: number; // ??
  robot_id: string; // 机器人id
  task_name: string; // 任务名称
  repeat_time: string; // 重复时间类型
  detail_time: string; // 具体时间信息
  spec: string; // 不知道是啥
  msg_text: msg_textParamter; // 其他内容
  weekList?: number[]; // 我收集表单数据的时候用的，发请求的时候会把它删掉
  is_suspend?: boolean; // 任务是否暂停
}

// 返回数据：添加任务接口返回的数据的 msg_text的 ts类型
export interface msg_textResponseData {
  ID: number;
  CreatedAt: string;
  UpdateAt: string;
  DeletedAt: null;
  at: {
    ID: number;
    CreatedAt: string;
    UpdateAt: string;
    DeletedAt: null;
    atMobiles: [
      {
        ID?: number;
        CreatedAt?: string;
        UpdateAt?: string;
        DeletedAt?: null;
        atMobile?: string; // 通知人员手机号
        name?: string; // 通知人员姓名
        AtID?: number;
      },
    ];
    atUserIds: null;
    isAtAll: boolean; // 是否全体通知
    MsgTextID: number;
    MsgMarkDownID: number;
  };
  text: {
    ID: number;
    CreatedAt: string;
    UpdatedAt: string;
    DeletedAt: null;
    content: string; // 通知的内容
    MsgTextID: number;
  };
  msgtype: string;
  TaskID: number;
}

// 返回数据：添加任务接口返回的数据的 ts类型
export interface addTaskResponse {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: null;
  task_id: number; // 任务id
  is_suspend: boolean; // 任务是否暂停  true：暂停  false：不暂停
  task_name: string; // 任务名称
  user_id: string; // 登录账号的id
  user_name: string; // 登录账号的名称
  robot_id: string; // 机器人id
  robot_name: string; // 机器人名称
  detail_time_for_user: string; // 具体时间描述，例如"周重复 ：周日周五周三周一21：21：29"
  spec: string; // spec时间
  front_repeat_time: string; // 重复时间类型，例如"周重复/0/5/3/1"
  front_detail_time: string; // 重复时间，例如"21:21:29"
  msg_text: msg_textResponseData;
  msg_link: null;
  msg_mark_down: null;
  next_time: string;
}

// 发请求：修改任务
export interface updateTaskFormParamter {
  detail_time: string; // 具体时间信息
  id: number; // ??
  is_suspend: boolean; // 任务是否暂停
  msg_text: msg_textParamter; // 其他内容
  repeat_time: string; // 重复时间类型
  robot_id: string; // 机器人id
  spec: string; // 不知道是啥
  task_name: string; // 任务名称
  weekList?: number[]; // 我收集表单数据的时候用的，发请求的时候会把它删掉
}

// 返回数据ts：修改任务接口  any

// 返回数据：根据 id 获取该任务的所有信息的ts类型
export interface getTaskDetailByIDResponse {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: null;
  task_id: number; // 任务id
  is_suspend: boolean; // 是否暂停
  task_name: string; // 任务名称
  user_id: string; // 所属人id
  user_name: string; // 所属人名称
  robot_id: string; // 机器人id
  robot_name: string; // 机器人名称
  detail_time_for_user: string; // 重复规则
  spec: string;
  front_repeat_time: string; // 重复时间类型
  front_detail_time: string; // 重复时间
  msg_text: msg_textResponseData;
  msg_link: null;
  msg_mark_down: null;
  next_time: string; // 下次执行时间
}
