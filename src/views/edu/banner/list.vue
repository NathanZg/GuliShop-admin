<template>
<div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
     <el-form-item>
    <el-input v-model="bannerQuery.id" placeholder="id"/>
    <el-input v-model="bannerQuery.title" placeholder="Banner标题"/>
    </el-form-item>
    <el-form-item>
    <el-input v-model="bannerQuery.imageUrl" placeholder="图片地址"/>
    <el-input v-model="bannerQuery.linkUrl" placeholder="链接地址"/>
    </el-form-item>
    <el-form-item label="添加时间">
    <el-date-picker
        v-model="bannerQuery.gmtCreate"
        type="datetime"
        placeholder="选择开始时间"
        value-format="yyyy-MM-dd HH:mm:ss"
        default-time="00:00:00"
    />
    <el-date-picker
        v-model="bannerQuery.gmtModified"
        type="datetime"
        placeholder="选择截止时间"
        value-format="yyyy-MM-dd HH:mm:ss"
        default-time="00:00:00"
    />
    </el-form-item>
    <el-button type="primary" icon="el-icon-search" @click="getBannerListPage()">查询</el-button>
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
        prop="id"
        align="center"
        label="id"
        width="190">
      </el-table-column>
      <el-table-column
        prop="title"
        align="center"
        label="Banner标题"
        width="100">
      </el-table-column>
      <el-table-column
        prop="imageUrl"
        align="center"
        label="图片地址"
        width="572">
      </el-table-column>
      <el-table-column
        prop="linkUrl"
        align="center"
        label="链接地址"
        width="192">
      </el-table-column>
        <el-table-column prop="gmtCreate" label="添加时间" width="160" align="center"/>
        <el-table-column label="操作" width="200" align="center">
            <template slot-scope="scope">
                <router-link :to="'/banner/edit/'+scope.row.id">
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
    @current-change="getBannerListPage"
    />
</div>
</template>
<script>
//引入teacher.js
import bannerApi from '@/api/edu/banner'

export default {
    data () {
        return {
            list:null,//返回的banner集合
            total:0,//总记录数
            page:1,//当前页
            limit:5,//每页记录数
            bannerQuery:{}//条件封装对象
        }
    },
    created () {
        this.getBannerListPage();
    },
    methods: {
        //分页获取讲师记录
        getBannerListPage(page = 1) {
            this.page = page;
            this.listLoading = true
            bannerApi.getBannerListPage(this.page,this.limit,this.bannerQuery)
            .then(Response => {
                this.list = Response.data.items
                this.total = Response.data.total
                this.listLoading = false
            })
        },
        //清空查询条件
        resetData() {
            //表单输入项清空
            this.bannerQuery = {};
            //查询所有数据
            this.getBannerListPage();
        },
        //根据id删除讲师
        removeDataById(id) {
            this.$confirm('此操作将永久删除该Banner记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                bannerApi.removeBannerById(id)
                .then(response => {
                    this.$message({
                    type: 'success',
                    message: '删除成功!'
                    })
                    this.getBannerListPage(this.page)
                })
            })
        }
    } 
}

</script>