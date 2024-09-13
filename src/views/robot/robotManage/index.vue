<template>
  <div class="robot">
    <el-scrollbar>
      <!-- 上方搜索区域 -->
      <el-card style="margin-bottom: 10px">111</el-card>
      <!-- 下方添加、表格区域 -->
      <el-card style="height: 3000px">
        <!-- 按钮：添加机器人 -->
        <el-button type="success" size="default" icon="Plus" @click="addRobot">
          新增
        </el-button>
        <!-- 按钮：批量删除机器人 -->
        <el-button type="danger" size="default" icon="Delete">
          批量删除
        </el-button>
        <!-- 表格 -->
        <el-table border style="margin: 20px 0" :data="curRobots">
          <el-table-column type="selection" />
          <el-table-column label="序号" type="index" />
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
        <!-- 分页器 -->
        <!-- size-change: page-size改变时触发，即一页展示多少条数据被改变时触发（下拉框）-->
        <!-- current-change: current-page改变时触发，即当前页码改变触发-->
        <el-pagination
          v-model:current-page="pageNow"
          v-model:page-size="pageSize"
          :page-sizes="[2, 3, 4, 6]"
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
    <el-dialog title="添加机器人" width="500" v-model="isAddRobot">
      <!-- 表单 -->
      <el-form>
        <el-form-item label="机器人ID" label-width="100px">
          <el-input />
        </el-form-item>
        <el-form-item label="机器人名称" label-width="100px">
          <el-input />
        </el-form-item>
        <el-form-item label="是否共享机器人">
          <el-radio-group>
            <el-radio>共享</el-radio>
            <el-radio>不共享</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <!-- 底部取消与确认按钮 -->
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

// 当前页码
let pageNow = ref<number>(1);
// 一页多少条数据
let pageSize = ref<number>(2);
// 机器人数据总数
let total = ref<number>(0);
// 当前页面的所有机器人数据
let curRobots = ref<RobotList>([]);
// 控制添加机器人对话框的显示与隐藏
let isAddRobot = ref<boolean>(false);
// 获取表单数据
let formData = ref<any>({
  robot_id: "",
  name: "",
  is_shared: 1,
});

// 添加机器人按钮
const addRobot = () => {
  isAddRobot.value = true;
};

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

// 分页器下拉框改变时触发,一改变就返回第一页
function handleSizeChange() {
  getRobotList();
}

// 分页器页码改变时触发
// function handleCurrentChange() {
//   getRobotList();
// }

// 组件一挂载就发请求获取机器人信息
onMounted(() => {
  getRobotList();
});
</script>

<style scoped lang="scss">
.robot {
  padding: 10px;
}
</style>
