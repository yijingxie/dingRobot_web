<template>
  <div class="departmentCheck">
    <el-scrollbar>
      <!-- 搜索区域 -->
      <el-card style="margin-bottom: 15px" class="search">
        <el-form :inline="true">
          <el-form-item label="关键字">
            <el-input
              size="default"
              placeholder="ID / 部门名称 / 负责人"
              style="width: 220px"
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
      <!-- 下方表格 -->
      <el-card>
        <!-- 表格 -->
        <el-table border style="margin: 20px 0" :data="checkList">
          <el-table-column label="部门ID" align="center" prop="dept_id" />
          <el-table-column label="部门名称" align="center" prop="name" />
          <el-table-column
            label="部门负责人"
            align="center"
            prop="ResponsibleUsers[0].name"
          />
          <!-- 推送到哪个群聊是通过机器人token来确认的 -->
          <el-table-column
            align="center"
            prop="is_robot_attendance"
            label="是否开启考勤"
            :formatter="formatterAttendance"
          />
          <el-table-column
            label="是否开启考勤周报"
            align="center"
            prop="is_attendance_week_paper"
            :formatter="formatterAttendance"
          />
          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <el-button
                size="small"
                type="primary"
                @click="updateCheckList(row)"
                icon="Edit"
              >
                修改
              </el-button>
              <el-button size="small" @click="isDialog = true" icon="Tickets">
                查看全部
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          v-model:current-page="pageNow"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 15, 20]"
          :background="true"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="getCheckList"
        />
      </el-card>
    </el-scrollbar>
    <!-- 对话框：查看全部 -->
    <el-dialog v-model="isDialog">
      <div>111</div>
    </el-dialog>
    <!-- 抽屉：修改信息，是否开启考勤，是否开启考勤周报，修改部门的负责人，修改推送的群聊-->
    <el-drawer v-model="isDrawer">
      <!-- 抽屉头部 -->
      <template #header>
        <p style="font-size: 18px">修改部门考勤信息</p>
      </template>
      <!-- 抽屉身体 -->
      <template #default>
        <el-form ref="checkFormRef" :rules="checkFormRules" :model="checkForm">
          <el-form-item>
            <p>部门名称</p>
            <el-input
              v-model="dept_name_drawer"
              style="width: 420px"
              disabled
            />
          </el-form-item>
          <el-form-item>
            <div>
              <p>部门负责人</p>
              <el-select
                v-model="manager_name_drawer"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="部门负责人姓名"
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
          <el-form-item prop="robot_token">
            <p>推送群聊</p>
            <el-input
              v-model="checkForm.robot_token"
              style="width: 420px"
              placeholder="请输入对应群的 token(机器人 token)"
            />
          </el-form-item>
          <el-form-item>
            <div>
              <p>是否开启考勤</p>
              <el-radio-group v-model="checkForm.is_robot_attendance">
                <el-radio :value="true" size="large">是</el-radio>
                <el-radio :value="false" size="large">否</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
          <el-form-item>
            <div>
              <p>是否开启考勤周报</p>
              <el-radio-group v-model="checkForm.is_attendance_week_paper">
                <el-radio :value="true" size="large">是</el-radio>
                <el-radio :value="false" size="large">否</el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
        </el-form>
      </template>
      <!-- 抽屉底部 -->
      <template #footer>
        <el-button @click="isDrawer = false">取消</el-button>
        <el-button type="primary">确认</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import CheckAPI, {
  type checkListResponse,
  updateCheckListParamter,
} from "@/api/check";
import RobotAPI, { type getPersonNameList } from "@/api/robot";
import { FormRules } from "element-plus";

// 当前页码
let pageNow = ref<number>(1);
// 一页显示几条数据
let pageSize = ref<number>(5);
// 任务总数
let total = ref<number>(0);
// 全部部门考勤信息列表
let checkList = ref<checkListResponse[]>([]);
// 部门成员信息列表
// let userList = ref<userResponse[]>([]);
// 搜索框搜索的内容
let search = ref<string>("");
// 控制查看全部对话框的显示与隐藏
let isDialog = ref<boolean>(false);
// 控制修改的抽屉的显示与隐藏
let isDrawer = ref<boolean>(false);
// 修改按钮抽屉表单收集
let checkForm = reactive<updateCheckListParamter>({
  ResponsibleUserIds: "", // 负责人id
  dept_id: 0, // 部门id
  is_attendance_week_paper: true, // 是否开启考勤周报
  is_jianshu_or_blog: 0,
  is_leet_code: 0,
  is_robot_attendance: true, // 是否开启考勤
  is_send_first_person: 0,
  robot_token: "", // 机器人token
});
// 打开抽屉时当前对象的部门名称
let dept_name_drawer = ref<string>("");
// 打开抽屉时当前对象的负责人名称
let manager_name_drawer = ref<string>("");
// 控制通知人员姓名下拉搜索框的数据搜索加载状态
let loading = ref(false);
// 存储通知人员模糊查询数据
let nameList = ref<getPersonNameList[]>([]);
// checkForm表单实例
let checkFormRef = ref();

// 获取全部部门考勤信息
function getCheckList(page: number = 1) {
  pageNow.value = page;
  CheckAPI.getCheckList(pageNow.value, pageSize.value, search.value)
    .then((data) => {
      total.value = data.total;
      checkList.value = data.list;
    })
    .catch((error) => {
      console.log(error);
    });
}

// 格式化内容：prop中的is_robot_attendance或者is_attendance_week_paper为true，则prop显示为“是”，为false则显示“否”
function formatterAttendance(
  row: any,
  column: any,
  cellValue: any,
  index: any
) {
  // row:当前正在处理的对象的信息
  // column：正在处理的列的配置对象，这个对象包含了列的所有配置信息，例如prop、label、width等等
  // cellValue：is_robot_attendance的值
  // index：当前行的索引（从0开始），表示当前行在表格数据数组中的位置
  return cellValue ? "是" : "否";
}

// 分页器下拉框改变时触发
function handleSizeChange() {
  console.log("下拉框");
  getCheckList();
}

// 修改部门考勤信息
function updateCheckList(row: checkListResponse) {
  // 打开抽屉
  isDrawer.value = true;
  // 清除上一次的表单校验结果
  nextTick(() => {
    checkFormRef.value.clearValidate("robot_token");
  });
  // 赋值抽屉信息
  if (row.ResponsibleUsers) {
    manager_name_drawer.value = row.ResponsibleUsers[0].name;
    checkForm.ResponsibleUserIds = row.ResponsibleUsers[0].userid;
  }
  dept_name_drawer.value = row.name;
  checkForm.dept_id = row.dept_id;
  checkForm.is_attendance_week_paper = row.is_attendance_week_paper;
  checkForm.is_robot_attendance = row.is_robot_attendance;
  checkForm.robot_token = row.robot_token; // 修改群聊其实就是修改机器人token
}

// 添加部门负责人框输入值一改变就触发，从后端拿去模糊查询数据
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

// 添加部门负责人，选择输入框内容后触发，一触发就把该负责人的id给checkForm里的ResponseibleUserIds
function nameChange(value: string) {
  // value: 选中的值，例如谢xx，王xx，张xx
  let manageId = nameList.value.filter((item) => item.name == value)[0].userid;
  checkForm.ResponsibleUserIds = manageId;
}

// checkFormRules表单校验规则
const checkFormRules = reactive<FormRules<typeof checkForm>>({
  robot_token: [
    { required: true, trigger: "blur", message: "请输入对应群的token" },
  ],
});

onMounted(() => {
  getCheckList();
});
</script>

<style scoped lang="scss">
.departmentCheck {
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
