import request from '@/utils/request'
export default {
    getCommentPageList(page, limit,courseId,commentQuery) {
        return request({
            url: `/eduservice/comment/pageComment/${courseId}/${page}/${limit}`,
            method: 'post',
            data: commentQuery
        })
    },
    deleteCommentById(commentId) {
        return request({
            url: `/eduservice/comment/deleteComment/${commentId}`,
            method: 'delete'
        })
    }
}