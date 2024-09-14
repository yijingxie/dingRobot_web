<template>
  <div class="robot">
    <el-scrollbar>
      <!-- 上方搜索区域 -->
      <el-card style="margin-bottom: 15px" class="search">
        <el-form :inline="true">
          <el-form-item label="关键字">
            <el-input
              size="default"
              placeholder="ID/机器人名称/所属人"
              style="width: 300px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" color="">搜索</el-button>
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
          <el-button type="danger" size="default" icon="Delete">
            批量删除
          </el-button>
        </template>

        <!-- 表格 -->
        <el-table border style="margin: 20px 0" :data="curRobots">
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
              <el-button type="danger" size="small" icon="Delete">
                删除
              </el-button>
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="editRobot(row)"
              >
                修改
              </el-button>
              <el-button size="small" icon="Plus">添加任务</el-button>
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
    <el-dialog title="添加机器人" width="500" v-model="robotVisible">
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";
// 引入接口，和ts类型
import RobotAPI, {
  type RobotList,
  addRobotParameter,
  Robot,
} from "@/api/robot";
// import
import type { FormInstance, FormRules } from "element-plus";

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
}

// 添加机器人对话框的确认按钮
async function addRobotConfirm() {
  // 表单校验全部通过，才能发请求
  await addRobotRef.value.validate();
  // 发起添加机器人请求
  RobotAPI.addRobot(AddRobotData.value)
    .then((data) => {
      robotVisible.value = false;
      ElMessage({
        type: "success",
        message: "添加成功",
      });
      // 清除上一次表单显示结果（点击编辑在表单留下的数据）
      AddRobotData.value = {
        robot_id: "",
        name: "",
        is_shared: 1,
      };
      // 成功后再获取一次当前页面所有机器人的数据，获取添加后的最新数据
      getRobotList();
    })
    .catch((error) => {
      ElMessage({
        type: "error",
        message: "添加失败",
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
}
</style>
