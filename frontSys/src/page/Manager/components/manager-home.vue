<template>
  <div class="wrapper">
    <div class="wrapper-left" :style="'width:'+leftWidth+'px'">
      <div class="wrapper-left-top">
        <div class="wrapper-logo">
          {{isCollapse?"":"教务"}}
        </div>
        <div :class="'wrapper-shrink iconfont '+(isCollapse?'icon-youshuangjiantou':'icon-zuoshuangjiantou')" @click="collapseClick"></div>
      </div>
      <el-menu default-active="1-4-1" class="wrapper-left-body" @open="" @close="" :collapse="isCollapse" :unique-opened="true" :collapse-transition="false" :router="true" active-text-color="#409EFF">
        <el-submenu index="/managerHome">
          <template slot="title">
            <i class="wrapper-left-left-icon iconfont icon-yonghudianji"></i>
            <span slot="title">个人信息</span>
          </template>
          <el-menu-item index="/managerHome">个人信息</el-menu-item>
        </el-submenu>
        <el-submenu index="/managerHome/manageStudent">
          <template slot="title">
            <i class="wrapper-left-left-icon iconfont icon-xuesheng"></i>
            <span slot="title">学生管理</span>
          </template>
          <el-menu-item index="/managerHome/manageStudent">学生列表</el-menu-item>
        </el-submenu>
        <el-submenu index="2">
          <template slot="title">
            <i class="wrapper-left-left-icon iconfont icon-jiaoshi"></i>
            <span slot="title">教工管理</span>
          </template>
          <el-menu-item index="/managerHome/manageTeacher">教工列表</el-menu-item>
        </el-submenu>
        <el-submenu index="/homeManager/manageCollege">
          <template slot="title">
            <i class="wrapper-left-left-icon iconfont icon-school"></i>
            <span slot="title">学院管理</span>
          </template>
          <el-menu-item index="/managerHome/manageCollege">学院管理</el-menu-item>
          <el-menu-item index="/managerHome/manageMajor">专业管理</el-menu-item>
          <el-menu-item index="/managerHome/manageClass">班级管理</el-menu-item>
        </el-submenu>
      </el-menu>
    </div>
    <div class="wrapper-right" :style="'width:calc(100% - '+leftWidth+'px)'">
      <div class="wrapper-right-top">
        <el-menu
            :router="true"
            class="el-menu-demo"
            mode="horizontal"
            background-color="#333"
            text-color="#fff"
            active-text-color="rgb(255, 208, 75)">
          <el-menu-item index="/managerHome">个人信息</el-menu-item>
          <el-submenu index="2">
            <template slot="title"><span class="iconfont icon-geren wrapper-right-top-icon"></span>{{userName}}(管理员)</template>
            <el-menu-item index="/"><span class="iconfont icon-tuichu1 wrapper-right-top-item-icon"></span>退出</el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
  export default{
    data(){
      return{
        isCollapse:false,
        leftWidth:230,
        userName:"",
      }
    },
    created(){
      let userInfo=localStorage.getItem("userInfo");
      userInfo=JSON.parse(userInfo);
      this.userName=userInfo.man_name;
    },
    methods:{
      collapseClick:function () {
        let root=this;
        if(root.isCollapse){
          setTimeout(function () {
            root.isCollapse=false;
          },200)
          root.leftWidth=230;
        }else{
          root.isCollapse=true;
          root.leftWidth=66;
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  @import "../sass/manager-home.scss";
</style>
