<template>
  <div class="login-container">
    <!-- 账号密码登录 -->
    <div class="password" v-if="!scanCode">
      <!-- 顶部工具栏 -->
      <div class="top-bar">
        <el-switch
          v-model="isDark"
          inline-prompt
          active-icon="Moon"
          inactive-icon="Sunny"
          @change="toggleTheme"
        />
        <lang-select class="ml-2 cursor-pointer" />
      </div>
      <!-- 登录表单 -->
      <el-card class="login-card">
        <!-- 标题 -->
        <div class="text-center relative">
          <h2>{{ defaultSettings.title }}</h2>
          <el-tag class="ml-2 absolute-rt">
            {{ defaultSettings.version }}
          </el-tag>
        </div>

        <el-form
          ref="loginFormRef"
          :model="loginData"
          :rules="loginRules"
          class="login-form"
        >
          <!--  手机号 -->
          <el-form-item prop="mobile">
            <div class="input-wrapper">
              <i-ep-user class="mx-2" />
              <el-input
                ref="mobile"
                v-model="loginData.mobile"
                :placeholder="$t('login.mobile')"
                name="mobile"
                size="large"
                class="h-[48px]"
              />
            </div>
          </el-form-item>

          <!-- 密码 -->
          <el-tooltip
            :visible="isCapslock"
            :content="$t('login.capsLock')"
            placement="right"
          >
            <el-form-item prop="password">
              <div class="input-wrapper">
                <i-ep-lock class="mx-2" />
                <el-input
                  v-model="loginData.password"
                  :placeholder="$t('login.password')"
                  type="password"
                  name="password"
                  @keyup="checkCapslock"
                  @keyup.enter="handleLoginSubmit"
                  size="large"
                  class="h-[48px] pr-2"
                  show-password
                />
              </div>
            </el-form-item>
          </el-tooltip>

          <!-- 登录按钮 -->
          <el-button
            :loading="loading"
            type="primary"
            size="large"
            class="w-full"
            @click.prevent="handleLoginSubmit"
          >
            {{ $t("login.login") }}
          </el-button>

          <h4>&nbsp;</h4>
        </el-form>
        <a
          style="color: #3579ec; text-decoration: none"
          id="redirectButton"
          @click="toggle"
        >
          切换为扫码登录
        </a>
      </el-card>

      <!-- ICP备案 -->
      <div class="icp-info" v-show="icpVisible">
        <p>
          Copyright © 2021 - 2024 youlai.tech All Rights Reserved. 有来技术
          版权所有
        </p>
        <p>皖ICP备20006496号-3</p>
      </div>
    </div>
    <!-- 扫码登录 -->
    <div class="scan" v-else>
      <div class="saomaHeader">
        <img src="../../assets//images/dingding.png" alt="钉钉扫码登录" />
        <p class="saomaTitle">正在加载中，请稍后~</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
// 外部库和依赖
import { LocationQuery, useRoute } from "vue-router";

// 内部依赖
import { useSettingsStore, useUserStore } from "@/store";
import AuthAPI, { type LoginData } from "@/api/auth";
import router from "@/router";
import defaultSettings from "@/settings";
import { ThemeEnum } from "@/enums/ThemeEnum";
import { TOKEN_KEY } from "@/enums/CacheEnum";

// 类型定义
import type { FormInstance } from "element-plus";

// 导入 login.scss 文件
import "@/styles/login.scss";

// 使用导入的依赖和库
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const route = useRoute();
// 窗口高度
const { height } = useWindowSize();
// 国际化 Internationalization
const { t } = useI18n();

// 控制扫码登录切换
let scanCode = ref<boolean>(false);
// 是否暗黑模式
const isDark = ref(settingsStore.theme === ThemeEnum.DARK);
// 是否显示 ICP 备案信息
const icpVisible = ref(true);
// 按钮 loading 状态
const loading = ref(false);
// 是否大写锁定
const isCapslock = ref(false);
// 验证码图片Base64字符串
const captchaBase64 = ref();
// 登录表单ref
const loginFormRef = ref<FormInstance>();

const loginData = ref<LoginData>({
  mobile: "18737480171",
  password: "123456",
});

// 表单校验规则
const loginRules = computed(() => {
  return {
    mobile: [
      {
        required: true,
        trigger: "blur",
        message: t("login.message.username.required"),
      },
    ],
    password: [
      {
        required: true,
        trigger: "blur",
        message: t("login.message.password.required"),
      },
      {
        min: 6,
        message: t("login.message.password.min"),
        trigger: "blur",
      },
    ],
  };
});

/** 登录表单提交 */
function handleLoginSubmit() {
  loginFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      userStore
        .login(loginData.value)
        .then(() => {
          router.push("/");
        })
        .catch((error) => {
          ElMessage({
            type: "error",
            message: "账号或密码错误",
          });
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
}

/** 解析 redirect 字符串 为 path 和  queryParams */
function parseRedirect(): {
  path: string;
  queryParams: Record<string, string>;
} {
  const query: LocationQuery = route.query;
  const redirect = (query.redirect as string) ?? "/";

  const url = new URL(redirect, window.location.origin);
  const path = url.pathname;
  const queryParams: Record<string, string> = {};

  url.searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });

  return { path, queryParams };
}

/** 主题切换 */
const toggleTheme = () => {
  const newTheme =
    settingsStore.theme === ThemeEnum.DARK ? ThemeEnum.LIGHT : ThemeEnum.DARK;
  settingsStore.changeTheme(newTheme);
};

/** 根据屏幕宽度切换设备模式 */
watchEffect(() => {
  if (height.value < 600) {
    icpVisible.value = false;
  } else {
    icpVisible.value = true;
  }
});

/** 检查输入大小写 */
function checkCapslock(event: KeyboardEvent) {
  // 防止浏览器密码自动填充时报错
  if (event instanceof KeyboardEvent) {
    isCapslock.value = event.getModifierState("CapsLock");
  }
}

// 获取重定向的地址
function redirectToDingTalk() {
  const redirectUrl =
    "https://login.dingtalk.com/oauth2/challenge.htm?redirect_uri=http%3A%2F%2F127.0.0.1%3A3000%2F%23%2FscanLogin&response_type=code&client_id=dinglyjekzn80ebnlyge&scope=openid&state=dddd&prompt=consent";
  window.location.href = redirectUrl;
  // router.push("/scanLogin");
}

// 切换为扫码登录
function toggle() {
  // 密码登录页面隐藏，扫码登录页面显示
  scanCode.value = !scanCode.value;
  // 获取重定向的地址
  redirectToDingTalk();
}
</script>
<style lang="scss" scoped></style>
