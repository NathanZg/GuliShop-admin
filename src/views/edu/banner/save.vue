<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="Banner标题">
        <el-input v-model="banner.title" />
      </el-form-item>
      <el-form-item label="链接地址">
        <el-input v-model="banner.linkUrl" />
      </el-form-item>
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="true"
          :on-success="handleAvatarSuccess"
          :on-remove="handleRemove"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API + '/eduoss/file'"
          class="avatar-uploader"
        >
          <img v-if="imgUrl" :src="imgUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
          >保存</el-button
        >
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import bannerApi from "@/api/edu/banner";
export default {
  data() {
    return {
      banner: {},
      saveBtnDisabled: false, // 保存按钮是否禁用
      BASE_API: process.env.BASE_API,
      imgUrl: "",
    };
  },
  created() {
    this.getBannerById();
    this.init();
  },
  watch: {
    $route(to, from) {
      this.init();
    },
  },
  methods: {
    //删除上传的Banner执行
    handleRemove(file, fileList) {
      this.banner.imageUrl = "";
      this.imgUrl = "";
    },
    //上传Banner成功执行
    handleAvatarSuccess(res, file) {
      this.banner.imageUrl = res.data.url;
      this.imgUrl = this.banner.imageUrl;
    },
    //上传Banner前执行
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 <= 2;

      if (!isJPG) {
        this.$message.error("上传Banner只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传Banner大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //取消修改返回
    cancel() {
      this.$router.push({ path: "/banner/table" });
    },
    init() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id;
        this.getBannerById(id);
      } else {
        this.banner = {};
        this.imgUrl = "";
      }
    },
    saveOrUpdate() {
      //根据id判断是添加还是修改
      if (!this.banner.id) {
        this.saveBanner();
      } else {
        this.updateBanner();
      }
      this.saveBtnDisabled = true;
      this.$router.push({ path: "/banner/table" });
    },
    //添加Banner
    saveBanner() {
      bannerApi.addBanner(this.banner).then((response) => {
        this.$message({
          type: "success",
          message: "添加成功!",
        });
        //回到页面列表 路由跳转
        this.$router.push({ path: "/banner/table" });
      });
    },
    //修改Banner信息
    updateBanner() {
      bannerApi.updateBanner(this.banner).then((response) => {
        this.$message({
          type: "success",
          message: "修改成功!",
        });
      });
    },
    //根据bannerid查询Banner信息
    getBannerById() {
      if (this.$route.params && this.$route.params.id) {
        bannerApi.getBannerById(this.$route.params.id).then((response) => {
          if (
            response.data.banner != null &&
            response.data.banner != undefined
          ) {
            this.banner = response.data.banner;
            this.imgUrl = this.banner.imageUrl;
          } else {
            this.$message({
              type: "error",
              message: "该Banner不存在！",
            });
            this.$router.push({ path: "/banner/list" });
          }
        });
      }
    },
  },
};
</script>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 800px;
  height: 400px;
  display: block;
}
</style>