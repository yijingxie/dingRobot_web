<template>
  <div class="task">
    <el-scrollbar>
      <el-card>
        <!-- 表格 -->
        <el-table border style="margin: 20px 0">
          <el-table-column label="任务名称" align="center" />
          <el-table-column label="发送规则" align="center" />
          <el-table-column label="所属机器人" align="center" />
          <el-table-column label="所属人" align="center" />
          <el-table-column label="下次执行时间" align="center" />
          <el-table-column label="操作" align="center" />
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

// 分页器下拉框改变时触发
function handleSizeChange() {}

// 分页器当前页码改变时触发
function handleCurrentChange() {}
</script>

<style scoped lang="scss">
.task {
  padding: 20px;
}
</style>
