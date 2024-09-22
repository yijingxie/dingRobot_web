<template>
  <div class="task">
    <el-scrollbar>
      <!-- 上方搜索区域 -->
      <el-card style="margin-bottom: 15px" class="search">
        <el-form :inline="true">
          <el-form-item label="关键字">
            <el-input
              size="default"
              placeholder="任务名称 / 所属机器人 / 所属人"
              style="width: 300px"
              v-model="TaskName"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="search">
              搜索
            </el-button>
          </el-form-item>
          <el-form-item>
            <el-button icon="Refresh" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <!-- 下方表格区域 -->
      <el-card>
        <!-- 表格 -->
        <el-table border style="margin: 20px 0" :data="TaskList">
          <el-table-column
            label="序号"
            type="index"
            width="70"
            align="center"
          />
          <el-table-column
            label="任务名称"
            align="center"
            prop="task_name"
            show-overflow-tooltip
          />
          <el-table-column
            label="发送规则"
            align="center"
            prop="detail_time_for_user"
            show-overflow-tooltip
          />
          <el-table-column
            label="所属机器人"
            align="center"
            prop="robot_name"
            show-overflow-tooltip
          />
          <el-table-column
            label="所属人"
            align="center"
            prop="user_name"
            show-overflow-tooltip
          />
          <el-table-column
            label="下次执行时间"
            align="center"
            prop="next_time"
            show-overflow-tooltip
          />
          <el-table-column label="操作" align="center" width="250">
            <template #default="{ row }">
              <el-button size="small" icon="Edit" @click="modifyTask(row)">
                修改
              </el-button>
              <el-button
                size="small"
                :icon="row.is_suspend ? 'VideoPlay' : 'VideoPause'"
                :type="row.is_suspend ? 'success' : 'primary'"
                @click="updateTaskStatus(row)"
              >
                {{ row.is_suspend ? "继续" : "暂停" }}
              </el-button>
              <el-popconfirm
                width="300px"
                :title="`你确定要删除任务${row.task_name}吗？`"
                @confirm="removeTask(row)"
              >
                <template #reference>
                  <el-button size="small" icon="Delete" type="danger">
                    删除
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          v-model:current-page="pageNow"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 15, 20]"
          size="default"
          :background="true"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="getTaskList"
        />
      </el-card>
    </el-scrollbar>
    <el-drawer v-model="isDrawer">
      <!-- 抽屉头部 -->
      <template #header>
        <p style="font-size: 18px">修改任务</p>
      </template>
      <!-- 抽屉身体 -->
      <template #default>
        <el-form ref="TaskFormRef" :model="TaskForm" :rules="TaskFormRules">
          <!-- 任务名称 -->
          <el-form-item prop="task_name">
            <p>任务名称</p>
            <el-input v-model="TaskForm.task_name" style="width: 420px" />
          </el-form-item>

          <!-- 重复时间类型 -->
          <el-form-item prop="repeat_time">
            <div>
              <p>重复时间类型</p>
              <el-select
                v-model="TaskForm.repeat_time"
                placeholder="Select"
                style="width: 420px"
                size="default"
                @change="repeatTimeChange"
              >
                <el-option value="立即发送" label="立即发送" />
                <el-option value="仅发送一次" label="仅发送一次" />
                <el-option value="周重复" label="周重复" />
                <el-option value="spec" label="spec" />
              </el-select>
            </div>
          </el-form-item>

          <!-- 仅发送一次 -->
          <el-form-item
            v-if="TaskForm.repeat_time == '仅发送一次'"
            prop="detail_time"
          >
            <div>
              <p>可选时间框</p>
              <el-date-picker
                v-model="TaskForm.detail_time"
                value-format="YYYY-MM-DD HH:mm:ss"
                type="datetime"
                placeholder="Select date and time"
              />
            </div>
          </el-form-item>

          <!-- 周重复 -->
          <el-form-item
            v-if="TaskForm.repeat_time.includes('周重复')"
            prop="weekList"
          >
            <!-- 周几发送 -->
            <div>
              <p>请选择周几发送</p>
              <el-checkbox-group v-model="TaskForm.weekList">
                <el-checkbox label="周日" :value="0" />
                <el-checkbox label="周一" :value="1" />
                <el-checkbox label="周二" :value="2" />
                <el-checkbox label="周三" :value="3" />
                <el-checkbox label="周四" :value="4" />
                <el-checkbox label="周五" :value="5" />
                <el-checkbox label="周六" :value="6" />
              </el-checkbox-group>
            </div>
          </el-form-item>
          <el-form-item
            v-if="TaskForm.repeat_time == '周重复'"
            prop="detail_time"
          >
            <!-- 具体时间 -->
            <div>
              <p>具体时间</p>
              <el-time-picker
                v-model="TaskForm.detail_time"
                arrow-control
                placeholder="Arbitrary time"
                value-format="HH:mm:ss"
                prop="detail_time"
              />
            </div>
          </el-form-item>

          <!-- spec -->
          <el-form-item v-if="TaskForm.repeat_time == 'spec'" prop="spec">
            <div>
              <p>
                详情请参考
                <a href="https://github.com/robfig/cron" style="color: #4080ff">
                  https://github.com/robfig/cron
                </a>
              </p>
              <el-input v-model="TaskForm.spec" style="width: 420px" />
            </div>
          </el-form-item>

          <!-- 是否全体通知 -->
          <el-form-item>
            <div>
              <p>是否全体通知</p>
              <el-radio-group
                v-model="TaskForm.msg_text.at.isAtAll"
                @change="allNoticeChange"
              >
                <el-radio :value="true" size="large">是</el-radio>
                <el-radio :value="false" size="large">否</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>

          <!-- 通知人员姓名 -->
          <el-form-item
            v-if="!TaskForm.msg_text.at.isAtAll"
            :rules="TaskFormRules['msg_text.at.atMobiles.0.name']"
            prop="msg_text.at.atMobiles.0.name"
          >
            <div>
              <p>通知人员姓名</p>
              <el-select
                v-model="TaskForm.msg_text.at.atMobiles[0].name"
                filterable
                remote
                reserve-keyword
                placeholder="请输入姓名"
                :remote-method="remoteMethod"
                :loading="loading"
                style="width: 420px"
                @change="nameChange"
              >
                <el-option
                  v-for="item in nameList"
                  :key="item.userid"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </div>
          </el-form-item>

          <!-- 通知内容 -->
          <el-form-item prop="msg_text.text.content">
            <div>
              <p>通知内容</p>
              <el-input
                v-model="TaskForm.msg_text.text.content"
                maxlength="2000"
                style="width: 420px"
                placeholder="请输入通知内容~"
                show-word-limit
                :autosize="{ minRows: 4, maxRows: 8 }"
                type="textarea"
              />
            </div>
          </el-form-item>
        </el-form>
      </template>
      <!-- 抽屉底部 -->
      <template #footer>
        <div style="flex: auto">
          <el-button @click="isDrawer = false">取消</el-button>
          <el-button type="primary" @click="modifyTaskConfirm">确认</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
// 引入接口，ts类型
import RobotAPI, { type getPersonNameList } from "@/api/robot";
import TaskAPI, { type TaskResponse, updateTaskFormParamter } from "@/api/task";
import type { FormRules } from "element-plus";

// 当前页码
let pageNow = ref<number>(1);
// 一页显示几条数据
let pageSize = ref<number>(5);
// 任务总数
let total = ref<number>(0);
// 搜索框任务名称
let TaskName = ref<string>("");
// 修改任务的抽屉的显示与隐藏
let isDrawer = ref<boolean>(false);
// 控制通知人员姓名下拉搜索框的数据搜索加载状态
let loading = ref(false);
// 当前页面的所有任务数据
let TaskList = ref<TaskResponse[]>([]);
// 收集添加任务的表单数据
let TaskForm = reactive<updateTaskFormParamter>({
  id: 0,
  robot_id: "", // 机器人ID
  task_name: "", // 任务名称
  repeat_time: "", // 重复时间类型
  detail_time: "", // 具体时间
  msg_text: {
    at: {
      atMobiles: [
        {
          atMobile: "", // 通知人员手机号
          name: "", // 通知人员姓名
        },
      ],
      isAtAll: false, // 是否全体通知
    },
    text: {
      content: "", // 通知内容
    },
    msgtype: "text", // 通知类型
  },
  spec: "",
  weekList: [], // 周几发送，[0,1,2,3,4,5,6]
  is_suspend: false, // 是否暂停任务
});
// 修改任务表单实例
let TaskFormRef = ref();
// 存储通知人员模糊查询数据
let nameList = ref<getPersonNameList[]>([]);

// 获取当前页面全部任务
function getTaskList(page: number = 1) {
  pageNow.value = page;
  TaskAPI.getTaskList(pageNow.value, pageSize.value)
    .then((data) => {
      TaskList.value = data.list;
      total.value = data.total;
    })
    .catch((error) => {
      console.log(error);
    });
}

// 分页器下拉框改变时触发
function handleSizeChange() {
  getTaskList();
}

// 重复时间类型发生改变时触发  value:下拉框的值
function repeatTimeChange(value: any) {
  // 1. 重置仅发送一次里的数据---可选时间框
  // 2. 重置周重复里的数据---周几发送 + 具体时间
  // 3. 重置spec里的数据---spec详情参考

  // 清除具体时间detail_time的值
  TaskForm.detail_time = "";
  // 周重复里的周几发送信息也清空
  TaskForm.weekList = [];
  TaskForm.spec = "";
}

// 是否全体通知radio一改变就会触发的回调
function allNoticeChange() {
  TaskForm.msg_text.at.atMobiles = [
    {
      atMobile: "",
      name: "",
    },
  ];
}

// detai_time的校验规则
function detail_timeValidator(rule: any, value: any, callback: any) {
  if (value) {
    callback();
  } else {
    callback(new Error("请输入时间"));
  }
}

// 修改任务表单校验规则
const TaskFormRules = reactive<FormRules<typeof TaskForm>>({
  task_name: [
    { required: true, trigger: "blur", message: "请输入任务名称" },
    { min: 2, trigger: "blur", message: "任务名称长度至少为2" },
  ],
  repeat_time: [
    { required: true, trigger: "change", message: "至少要选择一项" },
  ],
  detail_time: [
    {
      type: "date",
      required: true,
      trigger: "change",
      validator: detail_timeValidator,
    },
  ],
  weekList: [
    {
      type: "array",
      required: true,
      trigger: "change",
      message: "至少选择一项",
    },
  ],
  spec: [{ required: true, trigger: "blur", message: "请输入spec" }],
  "msg_text.at.atMobiles.0.name": [
    {
      required: true,
      trigger: ["blur", "change"],
      message: "请填写通知人员姓名",
    },
  ],
  "msg_text.text.content": [
    { required: true, trigger: "blur", message: "请输入通知内容" },
  ],
});

// 添加通知人员姓名框输入值一改变就触发
function remoteMethod(value: string) {
  // value：输入框输入的值
  // 发请求，后端返回数据（比如说我输入一个谢字，然后发请求，后端返回给我的数据里有谢AA,谢BB,谢CC，我需要的是谢CC）
  if (value) {
    loading.value = true;
    RobotAPI.getPersonName(value)
      .then((res) => {
        loading.value = false;
        nameList.value = res.list;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

// 通知人员姓名一修改就把对应人员手机号赋值
function nameChange(value: string) {
  let mobile = nameList.value.filter((item) => item.name == value)[0].mobile;
  TaskForm.msg_text.at.atMobiles[0].atMobile = mobile;
}

// 拼接需要的周重复的字符串
function weekListChange(): string {
  let repeatTimeStr = "周重复/";
  repeatTimeStr += (TaskForm.weekList as number[]).join("/");
  return repeatTimeStr;
}

// 把周重复里的具体周几提取出来
function extractRepeat_time(repeat_time: string) {
  const timeString = repeat_time.slice(4);
  return timeString.split("/").map(Number);
}

// 修改任务按钮   抽屉打开，根据id获取这个任务的具体信息，赋值信息显示，因为数据是双向绑定，可以在抽屉中直接修改信息
function modifyTask(row: TaskResponse) {
  console.log(row);
  isDrawer.value = true;
  // 赋值任务id
  nextTick(() => {
    // 重置该表单项，将其值重置为初始值，并移除校验结果
    TaskFormRef.value.resetFields();
    // 发请求获得该项任务的具体信息
    // 这里后端设计的是通过ID拿相应的任务信息，而不是通过task_id？？？不知道为啥这么设计
    TaskAPI.getTaskDetailByID(row.ID)
      .then((data) => {
        TaskForm.id = data.ID;
        TaskForm.robot_id = data.robot_id;
        TaskForm.task_name = data.task_name;
        TaskForm.detail_time = data.front_detail_time;
        TaskForm.msg_text.at.atMobiles[0].atMobile = data.msg_text.at
          .atMobiles[0].atMobile as string;
        TaskForm.msg_text.at.atMobiles[0].name = data.msg_text.at.atMobiles[0]
          .name as string;
        TaskForm.msg_text.at.isAtAll = data.msg_text.at.isAtAll;
        TaskForm.msg_text.text.content = data.msg_text.text.content;
        TaskForm.msg_text.msgtype = data.msg_text.msgtype;
        TaskForm.is_suspend = data.is_suspend;
        if (data.front_repeat_time.includes("周重复")) {
          // 把周重复里的具体周几提取出来
          TaskForm.weekList = extractRepeat_time(data.front_repeat_time);
          TaskForm.repeat_time = "周重复";
        } else if (data.front_repeat_time.includes("spec")) {
          // 这样写是因为当后端返回周重复的数据时，不知道为什么还会有spec数据？？可能是写的时候添加的错误信息？？不知道先这样写吧
          TaskForm.spec = data.spec;
        } else {
          TaskForm.repeat_time = data.front_repeat_time;
        }
      })
      .catch((error) => {
        console.log(error);
      });
  });
}

// 修改任务确认按钮
async function modifyTaskConfirm() {
  // 表单校验，通过再发请求
  await TaskFormRef.value.validate();
  if (TaskForm.repeat_time.includes("周重复")) {
    TaskForm.repeat_time = weekListChange();
  }

  let Paramter = TaskForm;
  // 不论修改前任务是什么状态，修改后都要进入继续状态（开启状态）
  TaskForm.is_suspend = false;
  delete Paramter.weekList;
  // 提交修改的任务数据，发请求
  TaskAPI.updateTask(Paramter)
    .then((data) => {
      isDrawer.value = false;
      ElMessage({
        type: "success",
        message: "任务修改成功！",
      });
      getTaskList(
        TaskList.value.length >= 1 ? pageNow.value : pageNow.value - 1
      );
    })
    .catch((error) => {
      console.log(error);
      isDrawer.value = false;
      ElMessage({
        type: "error",
        message: "修改任务失败",
      });
    });
}

// 关于修改和暂停：
// 1. 任务开启状态时，修改任务后，任务仍然是开启状态
// 2. 任务暂停状态时，任务修改后，任务状态会从暂停变为开启状态
// 3. 总结，只要修改，就开启任务

// 暂停 / 继续按钮：说白了就还是修改任务
function updateTaskStatus(row: TaskResponse) {
  // 1. 根据id获取点击的任务的数据到TaskForm中，修改TaskForm为需要的参数
  // 2. 发请求修改数据，再次获取数据
  TaskAPI.getTaskDetailByID(row.ID)
    .then((data) => {
      TaskForm.id = data.ID;
      TaskForm.robot_id = data.robot_id;
      TaskForm.task_name = data.task_name;
      TaskForm.detail_time = data.front_detail_time;
      TaskForm.msg_text.at.atMobiles[0].atMobile = data.msg_text.at.atMobiles[0]
        .atMobile as string;
      TaskForm.msg_text.at.atMobiles[0].name = data.msg_text.at.atMobiles[0]
        .name as string;
      TaskForm.msg_text.at.isAtAll = data.msg_text.at.isAtAll;
      TaskForm.msg_text.text.content = data.msg_text.text.content;
      TaskForm.msg_text.msgtype = data.msg_text.msgtype;
      TaskForm.is_suspend = data.is_suspend;
      TaskForm.repeat_time = data.front_repeat_time;
      if (data.front_repeat_time.includes("spec")) {
        TaskForm.spec = data.spec;
      }
      let Paramter = TaskForm;
      delete Paramter.weekList;
      Paramter.is_suspend = !Paramter.is_suspend;
      TaskAPI.updateTask(Paramter)
        .then((data) => {
          isDrawer.value = false;
          ElMessage({
            type: "success",
            message: TaskForm.is_suspend ? "任务暂停成功" : "任务继续",
          });
          getTaskList();
        })
        .catch((error) => {
          console.log(error);
          isDrawer.value = false;
          ElMessage({
            type: "error",
            message: "修改任务失败",
          });
        });
    })
    .catch((error) => {
      console.log(error);
    });
}

// 删除按钮
function removeTask(row: TaskResponse) {
  console.log(row);
  TaskAPI.removeTask(row.ID)
    .then(() => {
      ElMessage({
        type: "success",
        message: "删除成功",
      });
      getTaskList();
    })
    .catch((error) => {
      ElMessage({
        type: "error",
        message: "删除失败",
      });
      console.log(error);
    });
}

// 搜索按钮
function search() {}

// 重置按钮
function reset() {
  TaskName.value = "";
  getTaskList();
}

onMounted(() => {
  getTaskList();
});
</script>

<style scoped lang="scss">
.task {
  padding: 20px;

  .search {
    .el-form {
      margin-bottom: 0;

      .el-form-item--default {
        margin-bottom: 0;
      }
    }
  }

  .el-drawer__header {
    margin-bottom: 0;
  }
}

p {
  padding: 0;
  margin: 0;
}
</style>
