<template>
  <div class="departmentResource">
    <el-scrollbar>
      <!-- 下方表格 -->
      <el-card>
        <!-- 同步按钮 -->
        <template #header>
          <el-popconfirm title="你确定要同步考勤组信息到数据库吗？" width="300">
            <template #reference>
              <el-button type="success" size="default" icon="Refresh">
                同步考勤组信息到数据库
              </el-button>
            </template>
          </el-popconfirm>
        </template>
        <!-- 表格 -->
        <el-table border style="margin: 20px 0" :data="attendList">
          <el-table-column
            label="序号"
            type="index"
            width="100px"
            align="center"
          />
          <el-table-column label="考勤组ID" align="center" prop="group_id" />
          <el-table-column
            label="考勤组名称"
            align="center"
            prop="group_name"
          />
          <el-table-column
            label="人员总数"
            align="center"
            prop="member_count"
          />
          <el-table-column
            label="提前考勤提醒(/min)"
            align="center"
            prop="alert_time"
          />
          <el-table-column
            label="延迟考勤(/min)"
            align="center"
            prop="delay_time"
          />
          <el-table-column
            label="下次考勤时间"
            align="center"
            prop="next_time"
            show-overflow-tooltip
          />
          <el-table-column label="操作" align="center">
            <template #default="{ row }">
              <el-button
                size="small"
                icon="Tickets"
                type="primary"
                @click="checkAll(row)"
              >
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
          @current-change="getAttendList"
        />
      </el-card>
    </el-scrollbar>

    <!-- 对话框：查看全部-->
    <el-dialog v-model="dialogVisible" width="1000" title="查看全部">
      <el-form :data="curAttendInfo">
        <el-form-item>
          <span class="setType">
            <span class="setWeight">考勤组id：</span>
            {{ curAttendInfo.group_id }}
          </span>
          <span class="setType">
            <span class="setWeight">考勤组名称：</span>
            {{ curAttendInfo.group_name }}
          </span>
          <span class="setType">
            <span class="setWeight">考勤组人员总数：</span>
            {{ curAttendInfo.member_count }}
          </span>
        </el-form-item>
        <el-form-item>
          <span class="setType">
            <span>是否开启考勤：</span>
            <el-switch v-model="curAttendInfo.is_robot_attendance" />
          </span>
          <span class="setType">
            <span>是否开启考勤提醒：</span>
            <el-switch v-model="curAttendInfo.is_alter_attendance" />
          </span>
          <span class="setType">
            <span>是否在校：</span>
            <el-switch v-model="curAttendInfo.is_in_school" />
          </span>
          <span class="setType">
            <span>是否开启考勤周报：</span>
            <el-switch v-model="curAttendInfo.is_attend_week_paper" />
          </span>
        </el-form-item>
        <el-form-item>
          <el-card style="width: 100%">
            <el-table
              border
              :data="[curAttendInfo]"
              style="margin-bottom: 20px"
            >
              <el-table-column
                label="提前多少分钟提醒"
                prop="alert_time"
                align="center"
              />

              <el-table-column
                label="延迟多少分钟考勤"
                prop="delay_time"
                align="center"
              />
              <el-table-column
                label="下次考勤时间"
                prop="next_time"
                align="center"
              />
              <el-table-column
                label="更新时间"
                prop="UpdatedAt"
                :formatter="formatterTime"
                align="center"
              />
            </el-table>
            <el-table border :data="[curAttendInfo]">
              <el-table-column
                label="提醒考勤任务id"
                prop="robot_alter_task_id"
                align="center"
              />
              <el-table-column
                label="考勤任务id"
                prop="robot_attend_task_id"
                align="center"
              />
              <el-table-column
                label="考勤提醒规则"
                prop="alert_spec"
                align="center"
              />
              <el-table-column
                label="考勤规则"
                prop="attend_spec"
                align="center"
              />
            </el-table>
          </el-card>
        </el-form-item>
      </el-form>

      <!-- 底部取消与确认按钮 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
// 引入接口和 ts
import CheckAPI, { type attendGroupListResponse } from "@/api/check";

// 当前页码
let pageNow = ref<number>(1);
// 一页显示几条数据
let pageSize = ref<number>(5);
// 任务总数
let total = ref<number>(0);
// 控制查看全部对话框的显示与隐藏
let dialogVisible = ref<boolean>(false);
// 存储当前页面所有考勤组信息
let attendList = ref<attendGroupListResponse[]>([]);
// 点击查看全部按钮某一个考勤组的全部信息
let curAttendInfo = ref<attendGroupListResponse>({
  CreatedAt: "",
  UpdatedAt: "",
  DeletedAt: null,
  group_id: 0,
  group_name: "",
  member_count: 0,
  work_day_list: null,
  classes_list: null,
  selected_class: null,
  robot_attend_task_id: 0,
  attend_spec: "",
  alert_spec: "",
  robot_alter_task_id: 0,
  rest_times: null,
  is_robot_attendance: false,
  is_alter_attendance: false,
  is_send_first_person: false,
  is_in_school: true,
  alert_time: 0,
  delay_time: 0,
  next_time: "",
  is_attend_week_paper: false,
});

// 获取所有考勤组信息
function getAttendList(page: number = 1) {
  pageNow.value = page;
  CheckAPI.getAttendGropuList(pageNow.value, pageSize.value)
    .then((data) => {
      attendList.value = data.list;
      total.value = data.total;
    })
    .catch((error) => {
      console.log(new Error(error));
    });
}

// 分页器下拉框改变时触发
function handleSizeChange() {
  getAttendList();
}

// 格式化时间  2024-09-29T10:55:40+08:00  转变为  2024-09-29 10:55:40
function formatterTime(row: any, column: any, cellValue: any, index: any) {
  let time = cellValue.replace(/\.\d+\+\d+:\d+$/, "").replace("T", " ");
  return time;
}

// 格式化考勤规则 | 考勤提醒规则
function formatterRules() {}

// 查看全部按钮
function checkAll(row: attendGroupListResponse) {
  dialogVisible.value = true;
  curAttendInfo.value = row;
}

onMounted(() => {
  getAttendList();
});
</script>

<style scoped lang="scss">
.departmentResource {
  padding: 20px;

  .setType {
    margin-right: 30px;

    .setWeight {
      font-weight: 700;
    }
  }
}
</style>
