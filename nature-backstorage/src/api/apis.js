import req from './http.js'
import state from '../store/state'

// 登录
export const userLogin = (form, codekey) => req('post', 'login', {
  username: form.username,
  password: form.password,
  imgCodeKey: codekey,
  imageCode: form.code,
})
// 设置新密码
export const setNewPassword = (oldPwd, newPwd) => req('put', 'changePwd', {
  oldPwd,
  newPwd
})
// 找回密码
export const setPasswordFirst = (userName, phone, phoneCode) => req('post', 'retrievePassword', {
  userName,
  phone,
  phoneCode
})
// 重置密码
export const ResetPassword = (id, password) => req('put', 'resetPassword', {
  id,
  password
})
// 注销
export const userLogout = (clientId) => req('get', 'logout', {
  clientId
})

//获取验证码
export const GetImgcode = () => req('get', 'common/captchaImage', {})
//获取首页数据
export const GetHomeData = () => req('get', 'cms/home/statistics', {})

//获取首页公告
export const GetHomeNotice = () => req('get', 'cms/home/announcement', {})

//获取首页新闻
export const GetHomeNews = () => req('get', 'cms/home/news', {})

// 获取banner列表
export const GetBannerData = (pageNumber, title) => req('post', 'cms/banner/list', {
  pageNumber,
  pageSize: 20,
  filters: [{
    property: "title",
    operator: "like",
    value: title
  }],
  orders: [{
    property: "id",
    direction: "desc"
  }]
})

// 新增banner
export const PostBannerData = (form) => req('post', 'cms/banner', {
  title: form.title, //标题
  image: form.image, //banner图
  url: form.url ? form.url : '', //跳转链接
  orders: form.orders ? form.orders : '' //显示顺序
})

//获取banner详情
export const GetBannerDetail = (bannerId) => req('get', `cms/banner/${bannerId}`, {})

//编辑banner详情
export const EditBannerData = (form) => req('put', 'cms/banner', {
  id: form.id,
  title: form.title, //标题
  image: form.image, //banner图
  url: form.url ? form.url : '', //跳转链接
  orders: form.orders ? form.orders : '' //显示顺序
})

//删除banner
export const DelBanner = (bannerId) => req('delete', `cms/banner/${bannerId}`, {})

//驳回banner
export const RejectBanner = (id, reject) => req('put', 'cms/banner/reject', {
  id,
  status: 2,
  reject
})

//修改banner状态
export const PassBanner = (id, status) => req('put', 'cms/banner/status', {
  id,
  status
})

// 获取文章类型
export const GetTypesList = () => req('post', 'cms/article/categoryList', {})

// 获取文章列表
export const GetNewsList = (pageNumber, title, time_l, time_r, status, category_id) => req('post', 'cms/article/list', {
  pageNumber,
  filters: [{
      property: "title",
      operator: "like",
      value: title
    },
    {
      property: "release_time",
      operator: "ge",
      value: time_l
    },
    {
      property: "release_time",
      operator: "le",
      value: time_r
    },
    {
      property: "status",
      operator: "eq",
      value: status
    },
    {
      property: "category_id",
      operator: "eq",
      value: category_id
    }
  ],
  pageSize: 20
})

//删除文章
export const DelArticle = (articleId) => req('delete', `cms/article/${articleId}`, {})

//驳回文章
export const RejectArticle = (id, reject) => req('put', 'cms/article/reject', {
  id,
  reject
})

//修改文章状态
export const PassArticle = (id) => req('put', `cms/article/status/${id}`, {
})

//获取文章详情
export const GetArticleDetail = (articleId) => req('get', `cms/article/${articleId}`, {})

//编辑文章详情
export const EditNewsData = (form) => req('put', 'cms/article', {
  id: form.id,
  title: form.title,
  image: form.image,
  description: form.description,
  author: form.author,
  categoryId: form.categoryId,
  home_news: form.homeNews,
  content: form.content
})

//发布文章
export const PostNews = (form) => req('post', 'cms/article', {
  title: form.title,
  image: form.image,
  description: form.description,
  author: form.author,
  categoryId: form.categoryId,
  home_news: form.homeNews,
  content: form.content
})

// 获取用户列表
export const GetUserList = (pageNumber, name, phone) => req('post', 'system/user/list', {
  pageNumber,
  filters: [{
      property: "nick_name",
      operator: "like",
      value: name
    },
    {
      property: "phone",
      operator: "like",
      value: phone
    }
  ],
  pageSize: 20
})

//获取用户详情
export const GetUsers = (userId) => req('get', `system/user/${userId}`, {})

//删除用户
export const DelUser = (userId) => req('delete', `system/user/${userId}`, {})

//新增用户
export const PostUserData = (form) => req('post', 'system/user', {
  nickName: form.nickName,
  phone: form.phone,
  userName: form.userName,
  password: form.password,
  deptName: form.deptName,
  roleId: form.roleId,
  userType: '1',
  tenant_id: -1
})

//编辑用户
export const EditUserData = (form) => req('put', `system/user/${form.id}`, {
  nickName: form.nickName,
  phone: form.phone,
  password: form.password,
  deptName: form.deptName,
  roleId: form.roleId,
  id: form.id
})


// 获取角色列表
export const GetRoleList = (pageNumber) => req('post', 'system/role/list', {
  pageNumber,
  pageSize: 20
})

//删除角色
export const DelRole = (roleId, roleIdTN, flag) => req('post', 'system/role/removeRelation', {
  roleId,
  roleIdTN,
  flag
})
//编辑角色
export const EditRoleData = (roleName, roleId, ids) => req('post', 'system/role/saveOrUpdate', {
  roleName,
  roleId,
  ids
})
// 获取角色权限
export const GetAllIds = () => req('post', 'system/menu/list', {
  pageNumber: 1,
  pageSize: -1
})
// 获取用户权限
// export const GetMyMenus = () => req('get', 'system/menu/roleMenuTree', {
//   userType: 1
// })
export const GetMyMenus = () => req('get', 'getInfo', {
})
// 获取对应角色权限 
export const GetRoleMenus = (roleId) => req('get', 'system/menu/checked', {
  roleId,
  userType: 1
})
// 获取操作日志列表
export const GetHistory = (pageNumber) => req('post', 'system/operLog/list', {
  pageNumber,
  pageSize: 20
})
