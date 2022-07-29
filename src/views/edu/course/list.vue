<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="courseQuery.title" placeholder="课程名" />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="courseQuery.status"
          clearable
          placeholder="课程状态"
        >
          <el-option :value="'Normal'" label="已发布" />
          <el-option :value="'Draft'" label="未发布" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="courseQuery.minPrice" placeholder="最低价格" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="courseQuery.maxPrice" placeholder="最高价格" />
      </el-form-item>
      <el-form-item label="">
        <el-date-picker
          v-model="courseQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="courseQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-button
        type="primary"
        icon="el-icon-search"
        @click="getCourseListPage()"
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
      <el-table-column prop="title" align="center" label="课程名" width="325">
      </el-table-column>
      <el-table-column width="120" align="center" label="课程状态">
        <template slot-scope="scope">
          {{ scope.row.status === "Normal" ? "已发布" : "未发布" }}
        </template>
      </el-table-column>
      <el-table-column
        prop="viewCount"
        label="浏览数量"
        width="80"
        align="center"
      />
      <el-table-column
        prop="lessonNum"
        width="80"
        label="课时数"
        align="center"
      />
      <el-table-column
        prop="gmtCreate"
        label="添加时间"
        align="center"
        width="280"
      />
      <el-table-column label="操作" width="530" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/editInfo/' + scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit"
              >编辑课程基本信息</el-button
            >
          </router-link>
          <router-link :to="'/course/editChapter/' + scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit"
              >编辑课程大纲</el-button
            >
          </router-link>
          <router-link :to="'/course/commentManage/' + scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-setting"
              >课程评论管理</el-button
            >
          </router-link>
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
      @current-change="getCourseListPage"
    />
  </div>
</template>
<script>
//引入course.js
import courseApi from "@/api/edu/course";

export default {
  data() {
    return {
      list: null, //返回的讲师集合
      total: 0, //总记录数
      page: 1, //当前页
      limit: 5, //每页记录数
      courseQuery: {}, //条件封装对象
    };
  },
  created() {
    this.getCourseListPage();
  },
  methods: {
    //分页获取课程记录
    getCourseListPage(page = 1) {
      this.page = page;
      this.listLoading = true;
      courseApi
        .getCourseListPage(this.page, this.limit, this.courseQuery)
        .then((Response) => {
          this.list = Response.data.items;
          this.total = Response.data.total;
          this.listLoading = false;
        });
    },
    //清空查询条件
    resetData() {
      //表单输入项清空
      this.courseQuery = {};
      //查询所有数据
      this.getCourseListPage();
    },
    //根据id删除课程
    removeDataById(id) {
      this.$confirm("此操作将永久删除该课程, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        courseApi.removeDataById(id).then((response) => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.getCourseListPage(this.page);
        });
      });
    },
  },
};
</script>