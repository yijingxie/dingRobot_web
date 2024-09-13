<template>
  <div class="app-container">
    <!-- <h1>Vue3-Element-Admin-Thin</h1> -->
    <el-card>
      <div class="card">
        <img :src="userStore.user.avatar" alt="" />
        <div class="right">
          <p class="top">上午好，{{ userStore.user.username }}!</p>
          <p class="bottom">今天天气晴朗，气温在15°C至25°C之间，东南风。</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
// 引入封装的时间函数
import { getTime } from "@/utils/time";
// 引入用户仓库
import { useUserStore } from "@/store";

// 创建用户仓库实例
const userStore = useUserStore();

defineOptions({
  name: "Home",
  inheritAttrs: false,
});
</script>

<style lang="scss" scoped>
.app-container {
  .card {
    display: flex;
    align-items: center;

    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }

    .right {
      margin-left: 30px;

      .bottom {
        font-size: 14px;
        color: rgb(156 163 175);
      }
    }
  }
}
</style>
