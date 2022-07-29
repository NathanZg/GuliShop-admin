import request from '@/utils/request'

export default {
    //条件分页查询Banner
    getBannerListPage(current,limit,bannerQuery) {
        return request({
          url: `/educms/bannerAdmin/pageBanner/${current}/${limit}`,
          method: 'post',
          data: bannerQuery
        })
    },
    //根据id删除banner
    removeBannerById(id) {
      return request({
        url: `/educms/bannerAdmin/removeBanner/${id}`,
        method: 'delete',
      })
    },
    //添加banner
    addBanner(banner) {
      return request({
        url: `/educms/bannerAdmin/addBanner`,
        method: 'put',
        data: banner
      })
    },
    //根据id查询banner信息
    getBannerById(id) {
      return request({
        url:`/educms/bannerAdmin/getBanner/${id}`,
        method:'get'
      })
    },
    //修改banner信息
    updateBanner(banner) {
      return request({
        url: `/educms/bannerAdmin/updateBanner`,
        method: 'post',
        data: banner
      })
    }
}