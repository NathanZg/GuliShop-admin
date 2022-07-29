<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="commentQuery.memberId" placeholder="用户id" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="commentQuery.nickname" placeholder="用户名" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="commentQuery.content" placeholder="评论内容" />
      </el-form-item>
      <el-form-item label="">
        <el-date-picker
          v-model="commentQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="commentQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="getCommentPageList()"
        >查询</el-button
      >
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
      :data="list"
      style="width: 100%"
    >
      <el-table-column align="center" label="序号" width="70">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="memberId"
        align="center"
        label="用户ID"
        width="300"
      >
      </el-table-column>
      <el-table-column
        prop="nickname"
        align="center"
        label="用户名"
        width="115"
      >
      </el-table-column>
      <el-table-column
        prop="content"
        align="center"
        label="评论内容"
        width="600"
      >
      </el-table-column>
      <el-table-column
        prop="gmtCreate"
        label="添加时间"
        align="center"
        width="250"
      />
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="removeDataById(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      background
      style="padding: 30px 0; text-align: center"
      layout="total, prev, pager, next, jumper"
      @current-change="getCommentPageList"
    />
  </div>
</template>
<script>
import commentApi from "@/api/edu/comment";
import courseApi from "@/api/edu/course";
export default {
  data() {
    return {
      list: null, //返回的评论集合
      total: 0, //总记录数
      page: 1, //当前页
      limit: 5, //每页记录数
      commentQuery: {}, //条件封装对象
    };
  },
  watch: {
    $route(to, from) {
      this.isExit(this.$route.params.id);
    },
  },
  created() {
    this.isExit(this.$route.params.id);
    this.getCommentPageList();
  },
  methods: {
    //判断该课程是否存在
    isExit(id) {
      courseApi.isExit(id).then((response) => {
        if (!response.data.isExit) {
          this.$message({
            type: "error",
            message: "该课程不存在！",
          });
          this.$router.push({ path: "/course/list" });
        }
      });
    },
    //分页获取课程记录
    getCommentPageList(page = 1) {
      this.page = page;
      this.listLoading = true;
      if (this.$route.params.id != undefined && this.$route.params.id != "") {
        commentApi
          .getCommentPageList(
            this.page,
            this.limit,
            this.$route.params.id,
            this.commentQuery
          )
          .then((Response) => {
            this.list = Response.data.items;
            this.total = Response.data.total;
            this.listLoading = false;
          });
      }
    },
    //清空查询条件
    resetData() {
      //表单输入项清空
      this.commentQuery = {};
      //查询所有数据
      this.getCommentPageList();
    },
    //根据id删除课程
    removeDataById(id) {
      this.$confirm("此操作将永久删除该评论, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        commentApi.deleteCommentById(id).then((response) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getCommentPageList(this.page);
        });
      });
    },
  },
};
</script>