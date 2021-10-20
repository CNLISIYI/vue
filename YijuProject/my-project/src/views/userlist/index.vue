<template>
  <div>
    <Appheader :identity="userdata.identity" :uid="userdata.uid"></Appheader>
    <Appnav linkname='userlist' :identity="userdata.identity" :uid="userdata.uid" :username="userdata.username"></Appnav>
    <div class="table-border">
      <h4>会员信息列表</h4>
      <!-- elementui的表格组件 -->
      <!-- border：表格边框
      data：表格数据
       -->
      <el-table
        v-if="tableData"
        :data="tableData"
        border>
        <el-table-column
          prop="username"
          label="用户账号">
        </el-table-column>
        <el-table-column
          prop="identity"
          label="身份"
          width="120px">
        </el-table-column>
        <el-table-column
          prop="name"
          label="昵称">
        </el-table-column>
        <el-table-column
          prop="sex"
          label="性别"
          width="120px">
        </el-table-column>
        <el-table-column
          prop="tel"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="120px">
          <template slot-scope="scope">
            <el-button
              @click="deleteClick(scope.row)"
              type="text"
              size="small">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-else class="no-order">
        <img src="@/assets/noContent.png" alt="">
        <p>暂无信息</p>
      </div>
    </div>
    <Appfooter></Appfooter>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "AppUserlist",
  data() {
    return {
      tableData: [],
      // 用户数据
      userdata: {},
      thisId: '',
    };
  },
  mounted() {
    let _this = this;
    _this.userdata = this.$route.query;
    _this.getUserInfo();
  },
  methods: {
    // 获取所有用户列表
    getUserInfo() {
      axios({
        method: "GET",
        url: `http://127.0.0.1:8080/getAllUserInfo`
      })
        .then(res => {
          this.tableData = res.data;
          this.tableData.map(item => {
            // 把身份标识转换成文字
            if (item.identity == 1) {
              item.identity = "房东";
            } else if (item.identity == 0) {
              item.identity = "普通会员";
            }
          });
          this.tableData.map((item, index) => {
            // 如果身份标识是管理员，删除这条信息
            if (item.identity == 2) {
              this.tableData.splice(index, 1);
            }
          });
        })
        .catch(e => {
          this.$message.error("获取信息失败！");
        });
    },
    // 删除的接口
    deleteUser() {
      let _this = this;
      axios({
        method: "POST",
        url: `http://127.0.0.1:8080/delUserInfo?uid=${this.thisId}`,
        headers: { "Content-Type": "application/json" },
      })
        .then(res => {
          console.log(res);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          _this.getUserInfo();
        })
        .catch(e => {});
    },
    // 删除用户
    deleteClick(row) {
      this.$confirm("确定删除该用户所有数据？（不可逆）", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 要传给接口的参数
          this.thisId = row.uid;
          this.deleteUser();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "操作已取消"
          });
        });
    }
  }
};
</script>

<style lang="scss">
@import "index.scss";
</style>
