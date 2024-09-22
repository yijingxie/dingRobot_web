<template>
  <div class="robot">
    <el-scrollbar>
      <!-- 上方搜索区域 -->
      <el-card style="margin-bottom: 15px" class="search">
        <el-form :inline="true">
          <el-form-item label="关键字">
            <el-input
              size="default"
              placeholder="ID / 机器人名称 / 所属人"
              style="width: 300px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search">搜索</el-button>
          </el-form-item>
          <el-form-item>
            <el-button icon="Refresh">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>
      <!-- 下方添加、表格区域 -->
      <el-card>
        <template #header>
          <!-- 按钮：添加机器人 -->
          <el-button
            type="success"
            size="default"
            icon="Plus"
            @click="addRobot"
          >
            新增
          </el-button>
          <!-- 按钮：批量删除机器人 -->
          <el-popconfirm
            title="你确定要批量删除机器人吗"
            width="250px"
            @confirm="deleteRobots"
          >
            <template #reference>
              <el-button
                type="danger"
                icon="Delete"
                :disabled="deleteRobotIdArr.robot_ids.length > 0 ? false : true"
              >
                批量删除
              </el-button>
            </template>
          </el-popconfirm>
        </template>

        <!-- 表格 -->
        <el-table
          border
          style="margin: 20px 0"
          :data="curRobots"
          @selection-change="selectChange"
        >
          <el-table-column type="selection" />
          <el-table-column
            label="序号"
            type="index"
            width="100px"
            align="center"
          />
          <el-table-column
            label="机器人ID"
            align="center"
            prop="robot_id"
            style="padding: 0 50px"
            show-overflow-tooltip
          />
          <el-table-column label="机器人名称" align="center" prop="name" />
          <el-table-column label="所属人" align="center" prop="user_name" />
          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <el-popconfirm
                :title="`你确定要删除${row.name}吗`"
                width="250px"
                @confirm="deleteRobot(row.robot_id)"
              >
                <template #reference>
                  <el-button type="danger" size="small" icon="Delete">
                    删除
                  </el-button>
                </template>
              </el-popconfirm>

              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="editRobot(row)"
              >
                修改
              </el-button>
              <el-button size="small" icon="Plus" @click="addTask(row)">
                添加任务
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <!-- size-change: page-size改变时触发，即一页展示多少条数据被改变时触发（下拉框）-->
        <!-- current-change: current-page改变时触发，即当前页码改变触发-->
        <el-pagination
          v-model:current-page="pageNow"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 15, 20]"
          size="default"
          :background="true"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="getRobotList"
          style="margin-top: 30px"
        />
      </el-card>
    </el-scrollbar>
    <!-- 对话框：添加与修改机器人 -->
    <el-dialog
      :title="robotInputVisible ? '修改机器人' : '添加机器人'"
      width="500"
      v-model="robotVisible"
    >
      <!-- 表单 -->
      <el-form :model="AddRobotData" :rules="addRobotRules" ref="addRobotRef">
        <el-form-item label="机器人ID" label-width="100px" prop="robot_id">
          <el-input
            v-model="AddRobotData.robot_id"
            :disabled="robotInputVisible"
          />
        </el-form-item>
        <el-form-item label="机器人名称" label-width="100px" prop="name">
          <el-input v-model="AddRobotData.name" />
        </el-form-item>
        <el-form-item label="是否共享机器人" prop="is_shared">
          <el-radio-group v-model="AddRobotData.is_shared">
            <el-radio :value="1">共享</el-radio>
            <el-radio :value="0">不共享</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <!-- 底部取消与确认按钮 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="robotVisible = false">取消</el-button>
          <el-button type="primary" @click="addRobotConfirm">确认</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 抽屉：给机器人添加任务 -->
    <el-drawer v-model="isDrawer">
      <!-- 抽屉头部 -->
      <template #header>
        <p style="font-size: 18px">添加任务</p>
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
            v-if="TaskForm.repeat_time.includes('周重复')"
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
          <el-button type="primary" @click="addTaskConfirm">确认</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";
// 引入接口，和ts类型
import RobotAPI, {
  type RobotList,
  addRobotParameter,
  Robot,
  deleteRobotParamter,
  getPersonNameList,
} from "@/api/robot";
import TaskAPI, { type addTaskFormParamter } from "@/api/task";
// import
import type { FormRules } from "element-plus";

// 当前页码
let pageNow = ref<number>(1);
// 一页多少条数据
let pageSize = ref<number>(5);
// 机器人数据总数
let total = ref<number>(0);
// 当前页面的所有机器人数据
let curRobots = ref<RobotList>([]);
// 控制添加机器人对话框的显示与隐藏
let robotVisible = ref<boolean>(false);
// 控制添加机器人对话框里的ID输入框是否禁用：false不禁用  true禁用
let robotInputVisible = ref<boolean>(false);
// 获取添加机器人的表单数据
let AddRobotData = ref<addRobotParameter>({
  robot_id: "",
  name: "",
  is_shared: 1,
});
// 添加机器人表单实例
let addRobotRef = ref();
// 准备一个数组存储批量删除的用户的ID
let deleteRobotIdArr = reactive<deleteRobotParamter>({
  robot_ids: [],
});
// 控制分配任务的抽屉的显示与隐藏
let isDrawer = ref<boolean>(false);

// 收集添加任务的表单数据
let TaskForm = reactive<addTaskFormParamter>({
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
});

// 控制通知人员姓名下拉搜索框的数据搜索加载状态
let loading = ref(false);
// 存储通知人员模糊查询数据
let nameList = ref<getPersonNameList[]>([]);
// 添加任务表单实例
let TaskFormRef = ref();

// 获取当前页面机器人信息
function getRobotList(page: number = 1) {
  pageNow.value = page;
  RobotAPI.getRobotList(pageNow.value, pageSize.value)
    .then((data) => {
      curRobots.value = data.list;
      total.value = data.total;
    })
    .catch((error) => {
      console.log(error);
    });
}

// 添加机器人按钮
function addRobot() {
  // 显示对话框
  robotVisible.value = true;
  // id输入框可用
  robotInputVisible.value = false;
  // 清除上一次的表单校验结果
  nextTick(() => {
    addRobotRef.value.clearValidate("robot_id");
    addRobotRef.value.clearValidate("name");
    addRobotRef.value.clearValidate("is_shared");
  });
  // 清除上一次表单显示结果（点击编辑在表单留下的数据）
  AddRobotData.value = {
    robot_id: "",
    name: "",
    is_shared: 1,
  };
}

// 添加|编辑机器人对话框的确认按钮
async function addRobotConfirm() {
  // 表单校验全部通过，才能发请求
  await addRobotRef.value.validate();
  // 发起添加机器人请求
  RobotAPI.addRobot(AddRobotData.value)
    .then((data) => {
      robotVisible.value = false;
      ElMessage({
        type: "success",
        message: robotInputVisible.value ? "修改成功" : "添加成功",
      });
      // 成功后再获取一次当前页面所有机器人的数据，获取添加后的最新数据
      getRobotList();
    })
    .catch((error) => {
      ElMessage({
        type: "error",
        message: robotInputVisible.value ? "修改失败" : "添加失败",
      });
      console.log(error);
    });
}

// 编辑机器人按钮
function editRobot(row: Robot) {
  robotVisible.value = true;
  // ID输入框禁用
  robotInputVisible.value = true;
  AddRobotData.value.robot_id = row.robot_id;
  AddRobotData.value.name = row.name;
  AddRobotData.value.is_shared = row.is_shared;
}

// 删除一个机器人
function deleteRobot(robotId: string) {
  deleteRobotIdArr.robot_ids.push(robotId);
  RobotAPI.deleteRobot(deleteRobotIdArr)
    .then((data) => {
      ElMessage({
        type: "success",
        message: "删除成功",
      });
      getRobotList(
        curRobots.value.length >= 1 ? pageNow.value : pageNow.value - 1
      );
    })
    .catch((error) => {
      ElMessage({
        type: "error",
        message: "删除失败",
      });
    });
}

// 批量删除机器人
function deleteRobots() {
  RobotAPI.deleteRobot(deleteRobotIdArr)
    .then((data) => {
      ElMessage({
        type: "success",
        message: "批量删除成功",
      });
      getRobotList(
        curRobots.value.length >= 1 ? pageNow.value : pageNow.value - 1
      );
    })
    .catch((error) => {
      ElMessage({
        type: "error",
        message: "批量删除失败",
      });
      console.log(error);
    });
}

// table复选框勾选的时候会触发的事件
function selectChange(value: any) {
  // value: table会自动注入value，value即你选中的每一项数据
  deleteRobotIdArr.robot_ids = value.map((item: Robot) => {
    return item.robot_id;
  });
  console.log(deleteRobotIdArr.robot_ids);
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

// 分页器下拉框改变时触发,一改变就返回第一页
function handleSizeChange() {
  getRobotList();
}

// robot_id的校验规则
const validateRobot_Id = (rule: any, value: any, callback: any) => {
  if (value.length > 0) {
    callback();
  } else {
    callback(new Error("请输入正确的 id格式"));
  }
};

// name的检验规则
const validateName = (rule: any, value: any, callback: any) => {
  if (value.length >= 2) {
    callback();
  } else {
    callback(new Error("名称长度至少两位"));
  }
};

// 添加机器人的表单的校验
const addRobotRules = reactive<FormRules<typeof AddRobotData>>({
  robot_id: [{ required: true, trigger: "blur", validator: validateRobot_Id }],
  name: [{ required: true, trigger: "blur", validator: validateName }],
});

// 添加任务按钮
function addTask(row: Robot) {
  // 打开抽屉
  isDrawer.value = true;
  TaskForm.robot_id = row.robot_id;
  // 重置该表单项，将其值重置为初始值，并移除校验结果
  nextTick(() => {
    TaskFormRef.value.resetFields();
  });
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

// 拼接需要的周重复的字符串
function weekListChange(): string {
  let repeatTimeStr = "周重复/";
  repeatTimeStr += (TaskForm.weekList as number[]).join("/");
  return repeatTimeStr;
}

// 添加任务确认按钮
async function addTaskConfirm() {
  // 表单校验，通过再发请求
  await TaskFormRef.value.validate();
  if (TaskForm.repeat_time.includes("周重复")) {
    TaskForm.repeat_time = weekListChange();
  }

  let Paramter = TaskForm;
  delete Paramter.weekList;
  // 提交任务数据，发请求
  TaskAPI.addTask(Paramter)
    .then((data) => {
      isDrawer.value = false;
      ElMessage({
        type: "success",
        message: "添加任务成功",
      });
    })
    .catch((error) => {
      console.log(error);
      isDrawer.value = false;
      ElMessage({
        type: "error",
        message: "添加任务失败",
      });
    });
}

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

// detai_time的校验规则
function detail_timeValidator(rule: any, value: any, callback: any) {
  if (value) {
    callback();
  } else {
    callback(new Error("请输入时间"));
  }
}

// 添加任务表单校验规则
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

// 组件一挂载就发请求获取机器人信息
onMounted(() => {
  getRobotList();
});
</script>

<style scoped lang="scss">
.robot {
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
