<template>
  <div class="wrap">
    <pra-title title-ch="学院管理" title-en="TEACHER MANAGER"></pra-title>
    <!--搜索部分-->
    <div class="searchWrap">
      <div class="searchWrap-left">
        <el-input v-model="collegeName" placeholder="请输入学院" size="small"></el-input>
        <el-button type="primary" icon="el-icon-search" class="searchWrap-button" @click="getCollegeList">搜索</el-button>
        <el-button type="primary" class="searchWrap-button" @click="reset">重置</el-button>
      </div>
      <div class="searchWrap-right"></div>
    </div>

    <div class="wrap-center" v-loading="allLoading">
      <el-table :data="collegeList" style="width: 100%" class="wrap-table">
        <el-table-column prop="col_num" label="学院编号" max-width="180"></el-table-column>
        <el-table-column prop="col_name" label="学院" max-width="180"></el-table-column>
        <el-table-column prop="tea_name" label="院长" max-width="180"></el-table-column>
        <el-table-column
            fixed="right"
            label="操作"
            width="200">
          <template slot-scope="scope">
            <el-button type="primary" @click="showColInfo(scope.row)" size="small">查看</el-button>
            <el-button type="success" size="small" @click="showEditColInfo(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--查看,编辑和添加教工信息-->
    <el-dialog :visible.sync="showColInfoDialog" :title="isEdit?(isAdd?'添加学院':'编辑学院'):'查看学院信息'" class="dialog">
      <el-row class="dialogRow">
        <div class="dialogRow-left">编号：</div>
        <el-input v-model="collegeInfo.col_num" placeholder="请输入学院编号" :disabled="!isAdd"></el-input>
      </el-row>
      <el-row class="dialogRow">
        <div class="dialogRow-left">学院：</div>
        <el-input v-model="collegeInfo.col_name" placeholder="请输入学院名称" :disabled="!isEdit"></el-input>
      </el-row>
      <el-row class="dialogRow">
        <div class="dialogRow-left">院长：</div>
        <el-select v-model="collegeInfo.tea_name" placeholder="请选择院长" :disabled="!isEdit" class="rowSelect" @change="collegeChange">
          <el-option
              v-for="(item,index) in teacherList"
              :key="item.tea_id"
              :label="item.tea_name"
              :value="item.tea_id">
          </el-option>
        </el-select>
      </el-row>
      <span slot="footer" class="dialog-footer" :hidden="!isEdit">
        <el-button @click="showColInfoDialog = false">取 消</el-button>
        <el-button type="primary" @click="editColInfo" v-show="!isAdd">编 辑</el-button>
        <el-button type="primary" @click="addColInfo" v-show="isAdd">添 加</el-button>
      </span>
    </el-dialog>
    <div class="footerWrap">
      <div class="footerWrap-left">
        <el-button type="primary" @click="showAddColInfo" size="small">添加</el-button>
      </div>
      <el-pagination @size-change="getCollegeList" @current-change="getCollegeList" :current-page="currentPage"
                     :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>
<script>
  import ElCol from "element-ui/packages/col/src/col";
  export default{
    components: {ElCol},
    data(){
      return{
        collegeList:[],
        teacherList:[],
        collegeInfo:{},
        pageSize:10,
        currentPage:1,
        total:0,
        isEdit:false,
        isAdd:false,
        showColInfoDialog:false,
        allLoading:false,
        collegeName:"",
      }
    },
    created(){
      this.getCollegeList();
    },
    methods: {
      //获取学院列表
      getCollegeList: function () {
        let root = this;
        let para = {
          "page": root.currentPage,
          "pageSize": root.pageSize,
          "col_name": root.collegeName,
        }
        root.allLoading = true;
        this.Http.get("collegeList", para).then((res) => {
          root.allLoading = false;
          if (res.data.success) {
            root.collegeList = res.data.data;
            root.total = res.data.count;
          }
        })
      },
      //获取教师列表
      getTeacherList:function () {
        let root=this;
        this.Http.get("teaList").then((res)=>{
          if(res.data.success){
            let data=res.data.data;
            root.teacherList=data;
          }
        })
      },
      //重置
      reset: function () {
        this.pageSize = 10;
        this.currentPage = 1;
        this.total = 0;
        this.collegeName="";
        this.getCollegeList();
      },
      //显示学院信息
      showColInfo: function (option) {
        this.showColInfoDialog = true;
        this.collegeInfo = option;
        this.isEdit = false;
      },
      //显示编辑学院信息
      showEditColInfo: function (option) {
        this.showColInfoDialog = true;
        this.collegeInfo = JSON.parse(JSON.stringify(option));
        this.isEdit = true;
        this.isAdd = false;
        this.getTeacherList();
      },
      //显示添加学院信息
      showAddColInfo: function () {
        this.showColInfoDialog = true;
        this.isEdit = true;
        this.isAdd = true;
        this.collegeInfo = {
          "col_num":"",
          "col_name":"",
          "tea_id":"",
          "tea_name":"",
        }
      },
      //需要上传的学院信息
      getData: function () {
        let collegeInfo = this.collegeInfo;
        return {
          col_id: collegeInfo.col_id,
          col_num: collegeInfo.col_num,
          col_name: collegeInfo.col_name,
          tea_id: collegeInfo.tea_id,
        }
      },//编辑
      editColInfo:function () {
        let root=this;
        let para=root.getData()
        this.Http.put('college',para).then((res)=>{
          if(res.data.success){
            root.showColInfoDialog=false;
            root.getCollegeList();
            this.$message({
              title: '提示',
              message: '修改成功',
              type: 'success'
            });
          }else{
            this.$message({
              title: '警告',
              message: res.data.message,
              type: 'error'
            });
          }
        })
      },
      //添加
      addColInfo: function () {
        let root = this;
        let para = root.getData()
        this.Http.post('college', para).then((res) => {
          if (res.data.success) {
            root.showColInfoDialog = false;
            root.getCollegeList()
            this.$message({
              title: '提示',
              message: '添加成功',
              type: 'success'
            });
          } else {
            this.$message({
              title: '警告',
              message: res.data.message,
              type: 'error'
            });
          }
        })
      },
      collegeChange:function (value) {
        this.collegeInfo.tea_id=value;
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "../sass/manageTeacher";
</style>
<style lang="scss">
  /*修改组件内部样式不可以使用scoped*/
  .wrap-table .cell{
    text-align: center !important;
  }
</style>

