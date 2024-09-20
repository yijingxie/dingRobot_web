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
        <el-table border style="margin: 20px 0">
          <!-- <el-table-column
            label="序号"
            type="index"
            width="100px"
            align="center"
          /> -->
          <el-table-column label="部门ID" align="center" />
          <el-table-column label="部门名称" align="center" />
          <el-table-column label="是否开启考勤" align="center" />
          <el-table-column label="部门负责人" align="center" />
          <el-table-column label="修改负责人" align="center" />
          <el-table-column label="修改推送群聊" align="center" />
          <el-table-column label="是否开启考勤周报" align="center" />
        </el-table>
        <!-- 分页器 -->
        <el-pagination
          v-model:current-page="pageNow"
          v-model:page-size="pageSize"
          :page-sizes="[5, 10, 15, 20]"
          :background="true"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="taskTotal"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </el-card>
    </el-scrollbar>
    <!-- 对话框：添加资源 -->
    <el-dialog v-model="dialogVisible" title="Tips" width="500">
      <span>添加资源</span>
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
import { ref } from "vue";

// 当前页码
let pageNow = ref<number>(1);
// 一页显示几条数据
let pageSize = ref<number>(5);
// 任务总数
let taskTotal = ref<number>(0);
// 控制添加资源对话框的显示与隐藏
let dialogVisible = ref<boolean>(false);

// 分页器下拉框改变时触发
function handleSizeChange() {}

// 分页器当前页码改变时触发
function handleCurrentChange() {}

// 添加资源
function addResource() {
  dialogVisible.value = true;
}
</script>

<style scoped lang="scss">
.departmentCheck {
  padding: 20px;
}
</style>
