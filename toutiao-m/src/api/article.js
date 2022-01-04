
// 文章请求模块
import request from '@/utils/request.js'

//请求获取文章列表数据

export const getArticles = params => {
    return request({
        method: 'GET',
        url: '/v1_0/articles',
        params   //=(params:params)
    })
}

/**
 * 获取文章评论
 * @param {String} articleId - 文章ID
 * @param {String} offset - 上一页数据最后一个ID，做为下一页请求的偏移量
 */
export const getComments =params => {
    return request({
        method: 'GET',
        url: '/v1_0/comments',
        params
    })
}