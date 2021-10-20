<template>
  <el-row class="app-header" :gutter="20">
    <el-col :span="10">江苏传智播客教育科技股份有限公司</el-col>
    <el-col :span="5" :offset="5">
      <el-dropdown trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          <img width="30" :src="userInfo.photo">
          {{ userInfo.name }}<i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">用户设置</el-dropdown-item>
          <!--
            我们可以使用 .native 事件修饰符将原始的 html 页面注册到组件的根元素
           -->
          <!-- <el-dropdown-item command="b">退出</el-dropdown-item> -->
          <el-dropdown-item @click.native="handleLogout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-row>
</template>

<script>
import { removeUser, getUser } from '@/utils/auth'

export default {
  name: 'AppHeader',
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    // this.userInfo = JSON.parse(window.localStorage.getItem('user_info')) || {
    //   name: '123456798',
    //   photo: 'http://toutiao.meiduo.site/Fkj6tQi3xJwVXi1u2swCElotfdCi'
    // }
    this.userInfo = getUser()
  },
  methods: {
    handleLogout () {
      this.$confirm('确认退出吗？', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清空本地存储中的 user_info
        // window.localStorage.removeItem('user_info')
        removeUser()

        // 跳转到登录页
        this.$router.push({ name: 'login' })

        this.$message({
          type: 'success',
          message: '退出成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    },

    handleCommand (dropdownItem) {
      console.log('handleCommand', dropdownItem)
    }
  }
}
</script>

<style lang="less" scoped>
.app-header {
  height: 60px;
  display: flex;
  align-items: center;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #409EFF;
  img {
    border-radius: 50%;
  }
}

.el-icon-arrow-down {
  font-size: 12px;
}
</style>
