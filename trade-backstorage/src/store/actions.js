import state from './state'
import cookies from 'vue-cookies'
import {
  GetAllIds,
  GetRoleList
} from '../api/apis'


// 获取全部权限id
export const getAllIds = ({
  commit
}) => {
  if (state.allIds) {
    return
  } else {
    let ids = []
    GetAllIds().then((res) => {
      if (res.code == 0 && res.data) {
        res.data.map((item) => {
          ids.push(item.menuId);
          if (item.children) {
            ids.push(item.children.menuId);
          }
        });
        commit("getAllIds", ids)
      }
    });
  }
};

// 获取全部角色
export const getAllRole = ({
  commit
}) => {
  if (state.allRoles) {
    return
  } else {
    GetRoleList(-1).then((res) => {
      if (res.code == 0 && res.data) {
        commit("getAllRole", res.data)
      }
    });
  }
};

// 用户id
export const getUserId = ({
  commit
}) => {
  commit("getUserId", cookies.get('ctrl_shop_toid'))
};
