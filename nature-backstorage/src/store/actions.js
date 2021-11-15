import state from './state'
import cookies from 'vue-cookies'
import {
  GetAllIds,
  GetRoleList,
  GetTypesList
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
  if (state.allRoles.length) {
    return
  } else {
    GetRoleList(-1).then((res) => {
      if (res.code == 0 && res.data) {
        commit("getAllRole", res.data.records)
      }
    });
  }
};

// 获取全部类型
export const getAllTypes = ({
  commit
}) => {
  if (state.typeopt.length) {
    return
  } else {
    GetTypesList().then((res) => {
      if (res.code == 0 && res.data) {
        commit("getAllTypes", res.data)
      }
    });
  }
};
