import request from '@/utils/request'
const api_name = '/admin/statistics/daily'
export default {
    //生成今日数据
    nowChart() {
        return request({
            url: `/statistics/nowChart`,
            method: 'get'
        })
    },
    //筛选获取统计数据
    showChart(searchObj) {
        return request({
            url: `/statistics/showChart`,
            method: 'post',
            data:searchObj
        })
    }
}
