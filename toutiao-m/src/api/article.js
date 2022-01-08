
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

//评论点赞
export const addCommentLike = target => {
    return request({
        method: 'POST',
        url: '/v1_0/comment/likings',
        data: {
            target
        }
    })
}

//取消评论点赞
export const deleteCommentLike = target => {
    return request({
        method: 'DELETE',
        url: `/v1_0/comment/likings/${target}`,
        data: {
            target
        }
    })
}

//发布评论或回复
export const addComments = data => {
    return request({
        method: 'POST',
        url: '/v1_0/comments',
        data
    })
}

//文章收藏
export const addCollect = target => {
    return request({
        method: 'POST',
        url: '/v1_0/article/collections',
        data: {
            target
        }
    })
}

//取消文章收藏
export const deleteCollect = target => {
    return request({
        method: 'DELETE',
        url: `/v1_0/article/collections/${target}`,
    })
}

//获取文章收藏列表
export const getCollection = target => {
    return request({
        method: 'GET',
        url: '/v1_0/article/collections',
        data: {
            target
        }
    })
}
//获取用户阅读历史
export const getHistory = target => {
    return request({
        method: 'GET',
        url: '/v1_0/user/histories',
        data: {
            target
        }
    })
}