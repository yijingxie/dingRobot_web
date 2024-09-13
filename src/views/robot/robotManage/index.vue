<template>
  <div class="robot">
    <el-scrollbar>
      <el-card style="height: 3000px; padding: 10px">
        <!-- 按钮：添加机器人 -->
        <el-button type="primary" size="default" icon="Plus" @click="addRobot">
          新增
        </el-button>
        <!-- 按钮：批量删除机器人 -->
        <el-button type="danger" size="default" icon="Delete">
          批量删除
        </el-button>
        <!-- 表格 -->
        <el-table border style="margin: 20px 0" :data="curRobots">
          <el-table-column label="序号" type="selection" />
          <el-table-column
            label="机器人ID"
            align="center"
            prop="robot_id"
            show-overflow-tooltip
          />
          <el-table-column label="机器人名称" align="center" prop="name" />
          <el-table-column label="所属人" align="center" prop="user_name" />
          <el-table-column label="操作" align="center">
            <el-button type="danger" size="small">删除</el-button>
            <el-button type="primary" size="small">修改</el-button>
            <el-button size="small">添加任务</el-button>
          </el-table-column>
        </el-table>
      </el-card>
    </el-scrollbar>
    <!-- 对话框：添加与修改机器人 -->
    <el-dialog title="Tips" width="500" v-model="isAddRobot">
      <span>增加机器人</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="isAddRobot = false">取消</el-button>
          <el-button type="primary">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
// 引入ts类型
import RobotAPI, { type RobotList, queryData } from "@/api/robot";

// 控制添加机器人对话框的显示与隐藏
let isAddRobot = ref<boolean>(false);
// 获取机器人信息需要的参数
let queryParams = reactive<queryData>({
  page: 1,
  pageSize: 10,
});
// 当前页面的所有机器人数据
let curRobots = ref<RobotList>([]);

// 添加机器人按钮
const addRobot = () => {
  isAddRobot.value = true;
};

// 获取当前页面机器人信息
function getRobotList() {
  RobotAPI.getRobotList(queryParams)
    .then((data) => {
      curRobots.value = data.list;
    })
    .catch((error) => {
      console.log(error);
    });
}

// 组件一挂载就发请求获取机器人信息
onMounted(() => {
  getRobotList();
});
</script>

<style scoped lang="scss">
.robot {
  padding: 20px;
}
</style>
