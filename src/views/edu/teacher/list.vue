<template>
<div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
    <el-form-item>
    <el-input v-model="teacherQuery.name" placeholder="讲师名"/>
    </el-form-item>
    <el-form-item>
    <el-select v-model="teacherQuery.level" clearable placeholder="讲师头衔">
    <el-option :value="1" label="高级讲师"/>
    <el-option :value="2" label="首席讲师"/>
    </el-select>
    </el-form-item>
    <el-form-item label="添加时间">
    <el-date-picker
        v-model="teacherQuery.begin"
        type="datetime"
        placeholder="选择开始时间"
        value-format="yyyy-MM-dd HH:mm:ss"
        default-time="00:00:00"
    />
    </el-form-item>
    <el-form-item>
    <el-date-picker
        v-model="teacherQuery.end"
        type="datetime"
        placeholder="选择截止时间"
        value-format="yyyy-MM-dd HH:mm:ss"
        default-time="00:00:00"
    />
    </el-form-item>
    <el-button type="primary" icon="el-icon-search" @click="getTeacherListPage()">查询</el-button>
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
        style="width: 100%">
      <el-table-column
        align="center"
        label="序号"
        width="70">
        <template slot-scope="scope">
            {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        label="姓名"
        width="80">
      </el-table-column>
      <el-table-column
        width="80"
        align="center"
        label="头衔">
        <template slot-scope="scope">
            {{ scope.row.level===1?'高级讲师':'首席讲师' }}
        </template>
        </el-table-column>
        <el-table-column prop="intro" label="资历" align="center"/>
        <el-table-column prop="gmtCreate" label="添加时间" width="160" align="center"/>
        <el-table-column prop="sort" label="排序" width="60" align="center"/>
        <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
                <router-link :to="'/teacher/edit/'+scope.row.id">
                    <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
                </router-link>
                <el-button type="danger" size="mini" icon="el-icon-delete"
                @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
        </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
    :current-page="page"
    :page-size="limit"
    :total="total"
    background
    style="padding: 30px 0; text-align: center;"
    layout="total, prev, pager, next, jumper"
    @current-change="getTeacherListPage"
    />
</div>
</template>
<script>
//引入teacher.js
import teacher from '@/api/edu/teacher'

export default {
    data () {
        return {
            list:null,//返回的讲师集合
            total:0,//总记录数
            page:1,//当前页
            limit:5,//每页记录数
            teacherQuery:{}//条件封装对象
        }
    },
    created () {
        this.getTeacherListPage();
    },
    methods: {
        //分页获取讲师记录
        getTeacherListPage(page = 1) {
            this.page = page;
            this.listLoading = true
            teacher.getTeacherListPage(this.page,this.limit,this.teacherQuery)
            .then(Response => {
                this.list = Response.data.items
                this.total = Response.data.total
                this.listLoading = false
            })
        },
        //清空查询条件
        resetData() {
            //表单输入项清空
            this.teacherQuery = {};
            //查询所有数据
            this.getTeacherListPage();
        },
        //根据id删除讲师
        removeDataById(id) {
            this.$confirm('此操作将永久删除该讲师记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                teacher.removeDataById(id)
                .then(response => {
                    this.$message({
                    type: 'success',
                    message: '删除成功!'
                    })
                    this.getTeacherListPage(this.page)
                })
            })
        }
    } 
}

</script>