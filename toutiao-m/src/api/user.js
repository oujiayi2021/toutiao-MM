//用户相关请求模块
import request from '@/utils/request.js'
// import store from '@/store/index.js'
// export const login = data => {
//     return request({
//         method: 'POST',
//         url: '/app/v1_0/authorizations',
//         data
//       })
//  }
/**
 * 登录后台接口
 * @param {*} data {mobile:手机号, code:验证码}
 * @returns
 */
export function login(data) {
    // 返回Prmose对象
    return request({
        url: '/v1_0/authorizations',
        method: 'POST',
        data
    })
}

// 发送验证码
/**
 * 
 * @param {*} mobile {mobile:手机号, code:验证码}
 * @returns
 */
export function sendSms(mobile){
    // 返回Prmose对象
    return request({
        url: `/v1_0/sms/codes/${mobile}`,
        method: 'GET',
    })
}

export const getUserinfo = () => {
    return request({
        method: 'GET',
        url: '/v1_0/user',
        // headers: {
        //     Authorization: `Bearer ${store.state.user.token}`
        // }
    })
}