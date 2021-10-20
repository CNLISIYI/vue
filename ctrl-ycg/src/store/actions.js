import state from './state'
import {
  GetUserData,
  GetCompanyInfo,
  GetUploadSts
} from '../api/apis'
import cookies from 'vue-cookies'
import {
  MessageBox
} from 'element-ui';
import router from '../router'


// 获取会员用户信息
export const getUserData = ({
  commit
}, userid) => {
  if (state.userData.userid) {
    return
  } else {
    GetUserData().then((res) => {
      if (res.code == 0) {
        commit("getUserData", res.body)
      } else {
        return false
      }
    }).catch((err) => {
      console.log(err);
    });
  }
};

// 获取会员公司信息
export const getCompanyData = ({
  commit
}, userid) => {
  if (state.companyData.userid) {
    return
  } else {
    GetCompanyInfo().then((res) => {
      if (res.code == 0) {
        if (!res.body.company) {
          MessageBox.alert('您还没有完善公司信息，请先完善公司信息', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              router.push({
                name: "myinformate",
              });
            }
          });
        } else if (!(cookies.get('ctrl_cer_user_name') == 1 && cookies.get('ctrl_cer_company') == 1)) {
          MessageBox.alert('您还没有完成实名认证，无法进行其他操作，请先进行实名认证', '提示', {
            confirmButtonText: '确定',
            callback: action => {
              router.push({
                name: "mycertify",
              });
            }
          });
        } 
        else if (state.userData.b2bMember.diff < 91) {
          MessageBox.confirm(`您的爱采购会员将于${state.userData.b2bMember.bdb2b_time}到期`, '提示', {
            confirmButtonText: '立即续费',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            window.open("https://yuncaigou.net/s-show-43.html", "_blank");
          })
        }
        commit("getCompanyData", res.body)
      } else {
        return false
      }
    }).catch((err) => {
      console.log(err);
    });
  }
};


// 获取sts token
export const getUploadSts = ({
  commit
}) => {
  if (new Date().getTime() < state.uploadSts.timer + 60 * 60 * 1000) {
    return
  } else {
    GetUploadSts().then((res) => {
        if (res.code == 0) {
          let _data = res.body;
          _data.timer = new Date().getTime();
          commit("getUploadSts", _data)
        }
      })
      .catch((err) => {
        this.$message.error(err);
      })
  }
};



// 用户id
export const getUserId = ({
  commit
}) => {
  commit("getUserId", $cookies.get('ctrl_shop_toid'))
};
