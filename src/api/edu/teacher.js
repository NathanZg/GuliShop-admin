import request from '@/utils/request'

export default {
    getTeacherListPage(current,limit,teacherQuery) {
        return request({
          url: `/eduservice/teacher/pageTeacher/${current}/${limit}`,
          method: 'post',
          data: teacherQuery
        })
    },
    removeDataById(id) {
      return request({
        url: `/eduservice/teacher/${id}`,
        method: 'delete',
      })
    },
    //添加讲师
    addTeacher(teacher) {
      return request({
        url: `/eduservice/teacher/addTeacher`,
        method: 'put',
        data: teacher
      })
    },
    //根据id查询讲师信息
    getTeacherInfoById(id) {
      return request({
        url:`/eduservice/teacher/getTeacher/${id}`,
        method:'get'
      })
    },
    //修改讲师信息
    updateTeacher(teacher) {
      return request({
        url: `/eduservice/teacher/updateTeacher`,
        method: 'post',
        data: teacher
      })
    }
}