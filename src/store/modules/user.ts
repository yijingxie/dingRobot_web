import AuthAPI, { type LoginData } from "@/api/auth";
import UserAPI, { type UserInfo } from "@/api/user";
import { resetRouter } from "@/router";
import { store } from "@/store";
import { TOKEN_KEY } from "@/enums/CacheEnum";

export const useUserStore = defineStore("user", () => {
  const user = ref<UserInfo>({
    token: "", // 用户token
    username: "", // 用户名称
    userId: "", // 用户id
    roles: [], // 角色
    perms: [], // 权限
    avatar: "", // 头像
  });

  /**
   * 登录
   *
   * @param {LoginData}
   * @returns
   */
  function login(loginData: LoginData) {
    return new Promise<void>((resolve, reject) => {
      AuthAPI.login(loginData)
        .then((result) => {
          user.value.username = result.name;
          user.value.userId = result.userid;
          user.value.token = result.auth_token;
          localStorage.setItem(TOKEN_KEY, result.auth_token);
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // 获取信息(用户昵称、头像、角色集合、权限集合)
  function getUserInfo() {
    console.log("发请求获取用户信息");
    user.value.username = "闫佳鹏";
    user.value.roles.push("admin");
    user.value.avatar =
      "https://foruda.gitee.com/images/1723603502796844527/03cdca2a_716974.gif?imageView2/1/w/80/h/80";
    user.value.perms = [
      "sys:menu:delete",
      "sys:dept:edit",
      "sys:dict_type:add",
      "sys:dict:edit",
      "sys:dict:delete",
      "sys:dict_type:edit",
      "sys:menu:add",
      "sys:user:add",
      "sys:role:edit",
      "sys:dept:delete",
      "sys:user:edit",
      "sys:user:delete",
      "sys:user:password:reset",
      "sys:dept:add",
      "sys:role:delete",
      "sys:dict_type:delete",
      "sys:menu:edit",
      "sys:dict:add",
      "sys:role:add",
      "sys:user:query",
      "sys:user:export",
      "sys:user:import",
    ];
    // return new Promise<UserInfo>((resolve, reject) => {
    //   UserAPI.getInfo()
    //     .then((data) => {
    //       if (!data) {
    //         reject("Verification failed, please Login again.");
    //         return;
    //       }
    //       if (!data.roles || data.roles.length <= 0) {
    //         reject("getUserInfo: roles must be a non-null array!");
    //         return;
    //       }
    //       Object.assign(user.value, { ...data });
    //       resolve(data);
    //     })
    //     .catch((error) => {
    //       reject(error);
    //     });
    // });
  }

  // user logout
  function logout() {
    return new Promise<void>((resolve, reject) => {
      AuthAPI.logout()
        .then(() => {
          localStorage.setItem(TOKEN_KEY, "");
          location.reload(); // 清空路由
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // remove token
  function resetToken() {
    console.log("resetToken");
    return new Promise<void>((resolve) => {
      localStorage.setItem(TOKEN_KEY, "");
      resetRouter();
      resolve();
    });
  }

  return {
    user,
    login,
    getUserInfo,
    logout,
    resetToken,
  };
});

/**
 * 用于在组件外部（如在Pinia Store 中）使用 Pinia 提供的 store 实例。
 * 官方文档解释了如何在组件外部使用 Pinia Store：
 * https://pinia.vuejs.org/core-concepts/outside-component-usage.html#using-a-store-outside-of-a-component
 */
export function useUserStoreHook() {
  return useUserStore(store);
}
