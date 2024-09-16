<template>
  <div class="scanLogin">
    <div class="saomaHeader">
      <img src="../../assets//images/dingding.png" alt="钉钉扫码登录" />
      <p class="saomaTitle">页面跳转中，请稍后~</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import AuthAPI from "@/api/auth";
import { TOKEN_KEY } from "@/enums/CacheEnum";
import router from "@/router";

// 获取地址栏参数
function getUrlParam(name: any) {
  const temp = window.location.href.split("?")[1];
  const parm = new URLSearchParams("?" + temp);
  return parm.get(name);
}

// 扫码登录
function scanLogin() {
  console.log("开始尝试获取authCode");
  // 获取地址栏参数
  let authCode = getUrlParam("authCode");
  console.log(authCode);
  if (authCode) {
    // 调用跳转接口
    AuthAPI.reqRedirect(authCode).then((res) => {
      if (res.code == 0) {
        console.log("res", "扫码登录");
        localStorage.setItem("authCode", authCode);
        localStorage.setItem("username", res.data.username);
        localStorage.setItem(TOKEN_KEY, res.data.auth_token);
        router.push("/home");
      } else {
        window.location.href = "http://localhost:3000/#/";
      }
    });
  }
}

onMounted(() => {
  scanLogin();
});
</script>

<style scoped lang="scss">
.scanLogin {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background: url("@/assets/images/login-background-light.jpg") no-repeat center
    right;

  .saomaHeader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
</style>
