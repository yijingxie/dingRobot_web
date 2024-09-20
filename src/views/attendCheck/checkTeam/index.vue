<template>
  <div class="departmentResource">
    <el-scrollbar>
      <!-- 下方表格 -->
      <el-card>
        <!-- 添加按钮 & 批量删除按钮 -->
        <template #header>
          <el-popconfirm title="你确定要同步考勤组信息到数据库吗？" width="300">
            <template #reference>
              <el-button type="primary" size="default" icon="Refresh">
                同步考勤组信息到数据库
              </el-button>
            </template>
          </el-popconfirm>
        </template>
        <!-- 表格 -->
        <el-table border style="margin: 20px 0">
          <el-table-column
            label="序号"
            type="index"
            width="100px"
            align="center"
          />
          <el-table-column label="考勤组ID" align="center" />
          <el-table-column label="考勤组名称" align="center" />
          <el-table-column label="提前多少分钟题型" align="center" />
          <el-table-column label="延迟多少分钟考勤" align="center" />
          <el-table-column label="是否开启考勤" align="center" />
          <el-table-column label="是否在校" align="center" />
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
.departmentResource {
  padding: 20px;
}
</style>
