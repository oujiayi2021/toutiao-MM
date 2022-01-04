import request from '@/utils/request'

/**
 * 获取文章详情
 * @param {*} id 根据文章ID获取文章详情
 */
export function getDetailById(id) {
    return request.get(`/v1_0/articles/${id}`)
}


