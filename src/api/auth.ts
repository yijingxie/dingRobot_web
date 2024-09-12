import request from "@/utils/request";

// 枚举接口
enum API {
  LOGIN_URL = "/ding/login",
}

class AuthAPI {
  // 登录接口
  static login(data: LoginData) {
    const formData = new FormData();
    formData.append("mobile", data.mobile);
    formData.append("password", data.password);
    return request<any, LoginResult>({
      url: API.LOGIN_URL,
      method: "post",
      data: formData,
    });
  }

  // 注销接口
  static logout() {
    return request({
      url: "/api/v1/auth/logout",
      method: "delete",
    });
  }

  /** 获取验证码 接口*/
  static getCaptcha() {
    return request<any, CaptchaResult>({
      url: "/api/v1/auth/captcha",
      method: "get",
    });
  }
}

export default AuthAPI;

/** 登录请求参数 */
export interface LoginData {
  /** 用户名 */
  mobile: string;
  /** 密码 */
  password: string;
}

export interface ResponseData {
  code: number;
  msg: string;
}

export interface Authorities {
  CreatedAt: string;
  UpdatedAt: string;
  authorityId: number;
  authorityName: string;
  menus: null;
  defaultRouter: string;
}

/** 登录响应 */
export interface LoginResult extends ResponseData {
  userid: string;
  CreatedAt: string;
  UpdatedAt: string;
  name: string;
  mobile: string;
  password: string;
  dept_id?: number;
  authorityId?: number;
  authorities: Authorities[];
  title: string;
  auth_token: string;
}

/** 验证码响应 */
export interface CaptchaResult {
  /** 验证码缓存key */
  captchaKey: string;
  /** 验证码图片Base64字符串 */
  captchaBase64: string;
}
