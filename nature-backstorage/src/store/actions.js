import state from './state'
import cookies from 'vue-cookies'
import {
  GetAllIds,
  GetRoleList,
  GetMyMenus,
  GetTypesList
} from '../api/apis'


// 获取全部权限id
export const getAllIds = ({
  commit
}) => {
  if (state.allIds.length) {
    return
  } else {
    let ids = []
    GetAllIds().then((res) => {
      if (res.code == 0 && res.data) {
        res.data.map((item) => {
          if(item.menuId>34) {
            ids.push({
              value: item.menuId,
              label: item.menuName
            });
            if (item.children) {
              item.children.map(citem => {
                ids.push({
                  value: citem.menuId,
                  label: citem.menuName
                });
                if (citem.children) {
                  citem.children.map(ditem => {
                    ids.push({
                      value: ditem.menuId,
                      label: ditem.menuName
                    });
                  })
                }
              })
            }
          }
        });
        commit("getAllIds", ids)
        // commit("getAllIds", res.data)
      }
    });
  }
};

// 获取我的权限id
export const getMyMenus = ({
  commit
}) => {
  if (state.myMenus.length) {
    return
  } else {
    let ids = []
    GetMyMenus().then((res) => {
      if (res.code == 0 && res.data) {
        res.data.permissions.map(item => {
          ids.push(item.id)
          if (item.children) {
            item.children.map(citem => {
              ids.push(citem.id)
            })
          }
        })
        commit("getMyMenus", ids)
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
