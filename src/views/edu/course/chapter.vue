<template>
  <div class="app-container">
    <h2 style="text-align: center">发布新课程</h2>
    <el-steps
      :active="2"
      process-status="wait"
      align-center
      style="marginbottom: 40px"
    >
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>
    <el-button type="text" @click="openChapterDialog">添加章节</el-button>
    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number
            v-model="chapter.sort"
            :min="0"
            controlsposition="right"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title" />
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number
            v-model="video.sort"
            :min="0"
            controlsposition="right"
          />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.isFree">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API + '/eduvod/video/uploadAliYunVideo'"
            :limit="1"
            class="upload-demo"
          >
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">
                最大支持1G，<br />
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br />
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br />
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br />
                SWF、TS、VOB、WMV、WEBM 等视频格式上传
              </div>
              <i class="el-icon-question" />
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button
          :disabled="saveVideoBtnDisabled"
          type="primary"
          @click="saveOrUpdateVideo"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!-- TODO -->
    <!-- 章节 -->
    <ul class="chapterList">
      <li v-for="chapter in chapaterVideoList" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button type="text" @click="openVideo(chapter.id)"
              >添加课时</el-button
            >
            <el-button type="text" @click="openEditChapter(chapter.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="removeChapter(chapter.id)"
              >删除</el-button
            >
          </span>
        </p>
        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>
              {{ video.title }}
              <span class="acts">
                <el-button type="text" @click="openEditVideo(video.id)"
                  >编辑</el-button
                >
                <el-button type="text" @click="removeVideo(video.id)"
                  >删除</el-button
                >
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next"
          >下一步</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import chapterApi from "@/api/edu/chapter";
import videoApi from "@/api/edu/video";
import courseApi from "@/api/edu/course";
export default {
  watch: {
    $route(to, from) {
      this.init();
    },
  },
  data() {
    return {
      saveVideoBtnDisabled: false,
      saveBtnDisabled: false, // 保存按钮是否禁用
      chapaterVideoList: [],
      courseId: "",
      dialogChapterFormVisible: false, //是否显示章节表单
      dialogVideoFormVisible: false, //小节表单弹框
      chapter: {
        courseId: "",
        title: "",
        sort: 0,
      },
      video: {
        courseId: "",
        title: "", //标题
        sort: 0,
        isFree: false,
        videoSourceId: "", //阿里云的视频id
        videoOriginalName: "", //文件名
      },
      fileList: [], //上传文件列表
      BASE_API: process.env.BASE_API, // 接口API地址
    };
  },
  created() {
    this.init();
  },
  methods: {
    //初始化
    init() {
      if (this.$route.params && this.$route.params.id) {
        courseApi.isExit(this.$route.params.id).then((response) => {
          if (!response.data.isExit) {
            this.$message({
              type: "error",
              message: "该课程不存在！",
            });
            this.$router.push({ path: "/course/list" });
            return;
          }
        });
        this.courseId = this.$route.params.id;
        this.getChapterVideo();
      }
    },
    //取消添加课时
    cancel() {
      this.dialogVideoFormVisible = false;
      if (this.video.videoSourceId != null && this.video.videoSourceId !== "") {
        videoApi
          .removeAliYunVideo(this.video.videoSourceId)
          .then((response) => {
            //清空文件列表
            this.fileList = [];
            //清空视频id
            this.video.videoSourceId = "";
            //清空视频名称
            this.video.videoOriginalName = "";
          });
      }
    },
    //删除上传文件前调用的方法
    beforeVodRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    //处理删除上传了的文件的方法
    handleVodRemove(file, fileList) {
      videoApi.removeAliYunVideo(this.video.videoSourceId).then((response) => {
        this.$message({
          type: "success",
          message: "删除视频成功！",
        });
        //清空文件列表
        this.fileList = [];
        //清空视频id
        this.video.videoSourceId = "";
        //清空视频名称
        this.video.videoOriginalName = "";
      });
    },
    //成功回调
    handleVodUploadSuccess(response, file, fileList) {
      this.video.videoSourceId = response.data.videoId;
      //给上传视频名称赋值
      this.video.videoOriginalName = file.name;
    },
    //视图上传多于一个视频
    handleUploadExceed(files, fileList) {
      this.$message.warning("想要重新上传视频，请先删除已上传的视频");
    },
    //.................................小节的方法........................
    //修改小节
    updateVideo() {
      videoApi.updateVideo(this.video).then((response) => {
        this.dialogVideoFormVisible = false;
        this.$message({
          type: "success",
          message: "修改小节成功！",
        });
        //更新页面
        this.getChapterVideo();
      });
    },
    //打开修改弹窗
    openEditVideo(videoId) {
      videoApi.getVideoInfo(videoId).then((response) => {
        this.dialogVideoFormVisible = true;
        this.video = response.data.video;
      });
    },
    //删除小节
    removeVideo(id) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        videoApi.deleteVideo(id).then((response) => {
          //提示信息
          this.$message({
            type: "success",
            message: "删除小节成功!",
          });
          //刷新页面
          this.getChapterVideo();
        });
      });
    },
    //打开添加小节弹窗
    openVideo(chapterId) {
      //清空
      this.video = {
        courseId: "",
        title: "",
        sort: 0,
        isFree: false,
      };
      this.fileList = [];
      //弹框
      this.dialogVideoFormVisible = true;
      //设置章节id
      this.video.chapterId = chapterId;
    },
    //添加小节
    addVideo() {
      //设置课程id
      this.video.courseId = this.courseId;
      videoApi.addVideo(this.video).then((response) => {
        this.dialogVideoFormVisible = false;
        this.$message({
          type: "success",
          message: "添加小节成功!",
        });
        //刷新页面
        this.getChapterVideo();
      });
    },
    saveOrUpdateVideo() {
      if (this.video.id) {
        this.updateVideo();
      } else {
        this.addVideo();
      }
    },
    //.................................👇章节的方法.....................
    //删除章节
    removeChapter(chapterId) {
      this.$confirm("此操作将永久删除该记录, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return chapterApi.deleteChapter(chapterId);
        })
        .then(() => {
          this.getChapterVideo(); // 刷新列表
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        });
    },
    //根据课程id查询章节和小节
    getChapterVideo() {
      chapterApi.getChapterVideo(this.courseId).then((response) => {
        this.chapaterVideoList = response.data.ChapterVideos;
      });
    },
    previous() {
      this.$router.push({ path: "/course/info/" + this.courseId });
    },
    next() {
      this.$router.push({ path: "/course/publish/" + this.courseId });
    },
    saveOrUpdate() {
      if (this.chapter.id) {
        this.updateChapter();
      } else {
        this.addChapter();
      }
    },
    //打开添加章节弹窗
    openChapterDialog() {
      this.chapter.title = "";
      this.chapter.sort = 0;
      this.dialogChapterFormVisible = true;
    },
    addChapter() {
      this.chapter.courseId = this.courseId;
      chapterApi.addChapter(this.chapter).then((response) => {
        this.dialogChapterFormVisible = false;
        this.$message({
          type: "success",
          message: "添加章节成功！",
        });
        //刷新页面
        this.getChapterVideo();
      });
    },
    //打开修改章节弹窗
    openEditChapter(chapterId) {
      chapterApi.getChapterInfo(chapterId).then((response) => {
        this.chapter = response.data.chapter;
        this.dialogChapterFormVisible = true;
      });
    },
    //修改章节
    updateChapter() {
      chapterApi.updateChapter(this.chapter).then((response) => {
        this.dialogChapterFormVisible = false;
        this.$message({
          type: "success",
          message: "修改章节成功！",
        });
        this.getChapterVideo();
      });
    },
  },
};
</script>
<style scoped>
.chapterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}
.chapterList li {
  position: relative;
}
.chapterList p {
  position: relative;
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #ddd;
}
.chapterList .acts {
  position: relative;
  z-index: 1;
  float: right;
  font-size: 14px;
}
.videoList {
  padding-left: 50px;
}
.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #ddd;
}
</style>