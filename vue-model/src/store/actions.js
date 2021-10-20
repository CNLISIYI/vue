import state from './state'
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
