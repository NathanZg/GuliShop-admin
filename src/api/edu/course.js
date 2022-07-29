import request from '@/utils/request'

export default {
    //判断该课程是否存在
    isExit(id) {
        return request({
            url: `/eduservice/course/isExit/${id}`,
            method: 'get',
        })
    },
    //分页条件查询课程
    getCourseListPage(current, limit, courseQuery) {
        return request({
            url: `/eduservice/course/pageCourse/${current}/${limit}`,
            method: 'post',
            data: courseQuery
        })
    },
    //根据id删除课程
    removeDataById(id) {
        return request({
            url: `/eduservice/course/${id}`,
            method: 'delete',
        })
    },
    //课程最终发布
    publishCourse(courseId) {
        return request({
            url: `/eduservice/course/publishCourse/${courseId}`,
            method: 'post',
        })
    },
    //根据课程id获取
    getPublishCourseInfo(courseId) {
        return request({
            url: `/eduservice/course/getPublishCourseInfo/${courseId}`,
            method: 'get',
        })
    },
    addCourseInfo(courseInfo) {
        return request({
            url: `/eduservice/course/addCourseInfo`,
            method: 'post',
            data: courseInfo
        })
    },
    //查询所有讲师
    getListTeacher() {
        return request({
            url: '/eduservice/teacher/findAll',
            method: 'get',

        })
    },
    //根据课程id查询课程基本信息
    getCourseInfo(courseId) {
        return request({
            url: `/eduservice/course/getCourseInfo/${courseId}`,
            method: 'get'
        })
    },
    //修改课程信息
    updateCourseInfo(courseInfo) {
        return request({
            url: `/eduservice/course/updateCourseInfo`,
            method: 'post',
            data: courseInfo
        })
    }
}