import req from './http.js'
import state from '../store/state'
import qs from 'qs'
import tools from '../utils/utils'

// 登录
export const userLogin = (form, codekey) => req('post', '/login', qs.stringify({
  username: form.username,
  password: form.password,
  imgCodeKey: codekey,
  imageCode: form.code,
  clientId,
  clientSecret
}))
// 设置新密码
export const setNewPassword = (oldPwd, newPwd) => req('put', '/changePwd', qs.stringify({
  oldPwd,
  newPwd
}))
// 注销
export const userLogout = (userName, clientId) => req('get', '/logout', {
  userName,
  clientId
})
//获取验证码
export const GetImgcode = () => req('get', 'common/captchaImage', {})
//获取首页数据
export const GetHomeData = () => req('get', 'trade/homePage/getDataStatistics', {})

//获取首页公告
export const GetHomeNotice = () => req('get', 'cms/home/announcement', {})

//获取首页新闻
export const GetHomeNews = () => req('get', 'cms/home/news', {})

// 获取录入信息列表
export const GetInfoData = (pageNumber, create_time, exchange_code) => req('post', 'trade/marketInfo/list', qs.stringify({
  pageNumber,
  filters: JSON.stringify([{
      property: "create_time",
      operator: "like",
      value: create_time
    },
    {
      property: "exchange_code",
      operator: "eq",
      value: exchange_code
    },
  ]),
  pageSize: 20
}))

// 新增录入信息
export const PostInfoData = (form) => req('post', 'trade/marketInfo/saveOrUpdate', qs.stringify({
  id: form.id,
  exchangeCode: form.exchangeCode,
  exchangeName: form.exchangeName,
  openingPrice: form.openingPrice,
  closingPrice: form.closingPrice,
  tradedQuantity: form.tradedQuantity,
  tradedPrice: form.tradedPrice,
  highestPrice: form.highestPrice,
  lowestPrice: form.lowestPrice,
  infoTime: form.infoTime,
}))

//获取录入信息详情
export const GetInfoDetail = (id) => req('get', 'trade/marketInfo', {
  id
})

//删除录入信息
export const DelInfo = (id) => req('delete', 'trade/marketInfo', {
  id
})

// 获取用户管理列表
export const GetUserMana = (pageNumber, entName, createTime, role, status) => req('post', 'user/userManage/list', qs.stringify({
  pageNumber,
  filters: JSON.stringify([{
      property: "ent_name",
      operator: "like",
      value: entName
    },
    {
      property: "createTime",
      operator: "eq",
      value: createTime
    },
    {
      property: "role",
      operator: "eq",
      value: role
    },
    {
      property: "status",
      operator: "eq",
      value: status
    }
  ]),
  pageSize: 20
}))


//修改用户管理状态
export const RejectUserMana = (id, status, reject) => req('put', 'user/userManage/status', {
  id,
  status,
  reject
})

//获取用户管理详情
export const GetUserManaData = (id) => req('get', 'user/userManage/getUserManageDetail', {
  id
})

// 获取碳汇项目列表
export const GetTanMana = (pageNumber, entName, name, declareTime, status) => req('post', 'trade/entProject/list', qs.stringify({
  pageNumber,
  filters: JSON.stringify([{
      property: "ent_name",
      operator: "like",
      value: entName
    },
    {
      property: "name",
      operator: "like",
      value: name
    },
    {
      property: "declareTime",
      operator: "eq",
      value: declareTime
    },

    {
      property: "status",
      operator: "eq",
      value: status
    }
  ]),
  pageSize: 20
}))


//修改碳汇项目状态
export const RejectTanMana = (id, status, reject) => req('put', 'trade/entProject/status', {
  id,
  status,
  reject
})

//获取碳汇项目详情
export const GetTanManaData = (id) => req('get', 'trade/entProject', {
  id
})

// 获取成交项目列表
export const GetAgreeMana = (pageNumber, from_ent_name, to_ent_name, status, create_time) => req('post', 'trade/transferOrder/list', qs.stringify({
  pageNumber,
  filters: JSON.stringify([{
      property: "from_ent_name",
      operator: "like",
      value: from_ent_name
    },
    {
      property: "to_ent_name",
      operator: "like",
      value: to_ent_name
    },
    {
      property: "status",
      operator: "eq",
      value: status
    },
    {
      property: "create_time",
      operator: "eq",
      value: create_time
    },
  ]),
  pageSize: 20
}))


//修改成交项目状态
export const RejectAgreeMana = (id, status, reject) => req('put', 'trade/transferOrder/status', {
  id,
  status,
  reject
})

//获取成交项目详情
export const GetAgreeManaData = (id) => req('get', 'trade/transferOrder', {
  id
})

//编辑成交项目详情
export const EditAgreeData = (form) => req('put', 'trade/transferOrder', qs.stringify({
  id: form.id,
  status: form.status,
  totalAmount: form.totalAmount,
  serviceFee: form.serviceFee,
}))

// 管理成交单
export const GetDoneMana = (pageNumber, type, status, create_time, project_name, buy_ent_name, sell_ent_name) => req('post', 'trade/tradedOrder/list', qs.stringify({
  pageNumber,
  filters: JSON.stringify([{
      property: "type",
      operator: "eq",
      value: type
    },
    {
      property: "status",
      operator: "eq",
      value: status
    },
    {
      property: "create_time",
      operator: "eq",
      value: create_time
    },
    {
      property: "project_name",
      operator: "like",
      value: project_name
    },
    {
      property: "buy_ent_name",
      operator: "like",
      value: buy_ent_name
    },
    {
      property: "sell_ent_name",
      operator: "like",
      value: sell_ent_name
    },
  ]),
  pageSize: 20
}))

//编辑成交单
export const EditDoneData = (form) => req('put', 'trade/tradedOrder', qs.stringify({
  id: form.id,
  totalAmount: form.totalAmount,
  serviceFee: form.serviceFee,
}))


// 获取用户列表
export const GetUserList = (pageNumber, name, phone) => req('post', 'system/user/list', qs.stringify({
  pageNumber,
  filters: JSON.stringify([{
      property: "nick_name",
      operator: "like",
      value: name
    },
    {
      property: "phone",
      operator: "like",
      value: phone
    }
  ]),
  pageSize: 20
}))

//获取用户详情
export const GetUsers = (userId) => req('get', 'system/user', {
  userId
})

//删除用户
export const DelUser = (userId) => req('delete', 'system/user', {
  userId
})
//编辑用户
export const EditUserData = (form) => req('put', 'system/user', qs.stringify({
  id: form.id,
  nickName: form.nickName,
  phone: form.phone,
  userName: form.userName,
  password: form.password,
  deptName: form.deptName,
  roleId: form.roleId
}))

//新增用户
export const PostUserData = (form) => req('post', 'system/user', qs.stringify({
  nickName: form.nickName,
  phone: form.phone,
  userName: form.userName,
  password: form.password,
  deptName: form.deptName,
  roleId: form.roleId
}))

// 获取角色列表
export const GetRoleList = (pageNumber) => req('post', 'system/role/list', qs.stringify({
  pageNumber,
  pageSize: 20
}))

//删除角色
export const DelRole = (roleId, roleIdTN, flag) => req('delete', 'system/role/removeRelation', {
  roleId,
  roleIdTN,
  flag
})
//编辑角色
export const EditRoleData = (roleName, ids) => req('put', 'system/role/saveOrUpdate', qs.stringify({
  roleName,
  ids: JSON.stringify(ids)
}))
// 获取角色权限
export const GetAllIds = () => req('post', 'system/menu/list', qs.stringify({
  pageNumber: 1,
  pageSize: -1
}))
// 获取操作日志列表
export const GetHistory = (pageNumber) => req('post', 'system/operLog/list', qs.stringify({
  pageNumber,
  pageSize: 20
}))
//获取服务费信息
export const GetFee = () => req('get', 'trade/entTradeRate', {})
// 保存服务费设置
export const PostFee = (entId, rate) => req('post', 'trade/entTradeRate', qs.stringify({
  entId,
  rate
}))
