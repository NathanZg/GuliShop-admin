<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps
      :active="1"
      process-status="wait"
      align-center
      style="marginbottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>
    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input
          v-model="courseInfo.title"
          placeholder=" 示例：机器学习项目课：从基础到搭建项目视频"
        />
      </el-form-item>
      <!-- 所属分类 TODO -->
      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="一级分类"
          @change="subjectLevelOneChange"
        >
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"
          />
        </el-select>
      </el-form-item>
      <!-- 课程讲师 TODO -->
      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="总课时">
        <el-input-number
          :min="0"
          v-model="courseInfo.lessonNum"
          controls-position="right"
          placeholder="课时数"
        />
      </el-form-item>
      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description" />
      </el-form-item>
      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API + '/eduoss/file'"
          class="avatar-uploader"
        >
          <img :src="courseInfo.cover" />
        </el-upload>
      </el-form-item>
      <el-form-item label="课程价格">
        <el-input-number
          :min="0"
          v-model="courseInfo.price"
          controls-position="right"
          placeholder="课程价格"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          :disabled="saveBtnDisabled"
          type="primary"
          @click="saveOrUpdate"
          >保存并下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import courseApi from "@/api/edu/course";
import subjectApi from "@/api/edu/subject";
import Tinymce from "@/components/Tinymce";
export default {
  watch: {
    $route(to, from) {
      this.init();
    },
  },
  components: { Tinymce },
  data() {
    return {
      saveBtnDisabled: false, // 保存按钮是否禁用
      courseInfo: {
        //最好把其中的属性都写出来，不然对于一些双向绑定的组件出现问题
        title: "",
        subjectId: "",
        subjectParentId: "",
        teacherId: "",
        lessonNum: 0,
        description: "",
        cover: "https://gulli-edu.oss-cn-shanghai.aliyuncs.com/2022/07/20/a70cab3151d84ee391ad27cedd59011bdefault.jpg",
        price: 0,
      },
      teacherList: [],
      subjectOneList: [], //一级分类
      subjectTwoList: [], //二级分类
      BASE_API: process.env.BASE_API, // 接口API地址
      courseId: "", //课程编号
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      //获取路由的courseId值
      if (this.$route.params && this.$route.params.id) {
        courseApi.isExit(this.$route.params.id).then((response) => {
          if (!response.data.isExit) {
            this.$message({
              type: "error",
              message: "该课程不存在！",
            });
            this.$router.push({ path: "/course/list" });
          } else {
            this.courseId = this.$route.params.id;
            this.getCourseInfo();
            subjectApi.getSubjectList().then((response) => {
              //获取一级分类
              this.subjectOneList = response.data.list;
              //遍历一级分类
              for (var i = 0; i < this.subjectOneList.length; i++) {
                //获取每一个一级分类
                var oneSubject = this.subjectOneList[i];
                //比较当前courseInfo里面一级分类id和所有一级分类id
                if (this.courseInfo.subjectParentId == oneSubject.id) {
                  //获取该一级分类的所有二级分类
                  this.subjectTwoList = oneSubject.children;
                }
              }
            });
            //初始化讲师列表
            this.getListTeacher();
          }
        });
      } else {
        //初始化讲师列表
        this.getListTeacher();
        //初始化一级分类
        this.getOneSubject();
      }
    },
    //根据课程id查询课程信息
    getCourseInfo() {
      courseApi.getCourseInfo(this.courseId).then((response) => {
        this.courseInfo = response.data.courseInfo;
      });
    },
    //上传之前的方法
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //上传成功调用的方法
    handleAvatarSuccess(response, file) {
      this.courseInfo.cover = response.data.url;
    },
    //一级分类改变调用函数获取二级分类
    subjectLevelOneChange(levelOneId) {
      for (var i = 0; i < this.subjectOneList.length; i++) {
        //得到每个一级分类
        var oneSubject = this.subjectOneList[i];
        //判断该一级分类id是否和当前id相同
        if (levelOneId === oneSubject.id) {
          //从该一级分类中取出二级分类
          this.subjectTwoList = oneSubject.children;
          //将courseInfo中的subjectId清空，它是跟二级下拉列表双向绑定
          this.courseInfo.subjectId = "";
        }
      }
    },
    //获取所有一级分类
    getOneSubject() {
      subjectApi.getSubjectList().then((response) => {
        this.subjectOneList = response.data.list;
      });
    },
    //获取所有讲师
    getListTeacher() {
      courseApi.getListTeacher().then((response) => {
        this.teacherList = response.data.items;
      });
    },
    //添加课程信息
    add() {
      courseApi.addCourseInfo(this.courseInfo).then((response) => {
        this.$message({
          type: "success",
          message: "添加课程信息成功!",
        });
        this.$router.push({
          path: "/course/chapter/" + response.data.courseId,
        });
      });
    },
    //修改课程信息
    update() {
      courseApi.updateCourseInfo(this.courseInfo).then((response) => {
        //提示
        this.$message({
          type: "success",
          message: "修改课程信息成功！",
        });
      });
      //跳转到第二步
      this.$router.push({
        path: "/course/chapter/" + this.courseId,
      });
    },
    saveOrUpdate() {
      //判断是添加还是修改，有id的肯定是修改
      if (this.courseInfo.id) {
        this.update();
      } else {
        this.add();
      }
    },
  },
};
</script>
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>