<template>
  <div>
    <Appheader :identity="userdata.identity" :uid="userdata.uid"></Appheader>
    <Appnav linkname='notdone' :identity="userdata.identity" :uid="userdata.uid" :username="userdata.username"></Appnav>
    <div class="table-border">
      <h4>待处理信息（房东申请）</h4>
      <!-- elementui的表格组件 -->
      <!-- border：表格边框
      data：表格数据
       -->
      <el-table
        v-if="tableData"
        :data="tableData"
        border
        :row-class-name="tableRowClassName">
        <el-table-column
          prop="username"
          label="用户账号">
        </el-table-column>
        <el-table-column
          prop="fdname"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="fdtel"
          label="联系电话">
        </el-table-column>
        <el-table-column
          prop="date"
          label="申请日期">
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作">
          <template slot-scope="scope">
            <!-- 点击同意或拒绝的时候传入行数，也就是index，通过index拿到这条数据的uid -->
            <el-button type="text" @click="agreeClick(scope.row)">同意</el-button>
            <el-button type="text" @click="refuseClick(scope.row)">拒绝</el-button>
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
  name: "AppNotdone",
  data() {
    return {
      tableData: [],
      // 用户数据
      userdata: {},
      changedata: {},
    };
  },
  mounted() {
    let _this = this;
    _this.userdata = this.$route.query;
    _this.getNotice();
  },
  methods: {
    // 获取成为房东申请
    getNotice() {
      axios({
        method: "GET",
        url: `http://127.0.0.1:8080/getAllApplyInfo`
      })
        .then(res => {
          this.tableData = JSON.parse(res.data.data);
        })
        .catch(e => {
          this.$message.error("获取信息失败！");
        }); 
    },
    // 处理信息操作的接口
    chooseNotice() {
      let _this = this;
      axios({
        method: "POST",
        url: `http://127.0.0.1:8080/setApplyStatus`,
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify(_this.changedata)
      })
        .then(res => {
          console.log(res);
          this.$message({
            type: "success",
            message: "操作成功!"
          });
          _this.getNotice();
        })
        .catch(e => {
        });
    },
    
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 1) {
        return "warning-row";
      } else if (rowIndex === 3) {
        return "success-row";
      }
      return "";
    },
    // 同意申请
    agreeClick(row) {
      this.$confirm("确定同意该用户成为房东身份?（不可逆）", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 要传给接口的参数
          this.changedata = {
            uid: row.uid, //用户id
            isagree: 1, //同意为1，拒绝为0
            time: new Date().toLocaleDateString() //当前日期
          }
          this.chooseNotice();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "操作已取消"
          });
        });
    },
    // 拒绝申请
    refuseClick(row) {
      this.$confirm("确定拒绝该用户成为房东的申请?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.changedata = {
            uid: row.uid,
            isagree: 0,
            time: new Date().toLocaleDateString()
          }
          this.chooseNotice();
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
