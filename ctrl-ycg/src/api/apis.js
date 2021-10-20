import req from './http.js'
import state from '../store/state'
import qs from 'qs'
import tools from '../utils/utils'

//获取会员用户信息
export const GetUserData = () => req('get', 'member/userinfo', {
  user_id: state.user_id,
  ext: 1
})

//获取用户余额
export const GetUserAccount = () => req('get', 'member/account/info', {
  user_id: state.user_id
})

//获取产品详情
export const GetProductDetail = (info_id) => req('get', 'member/sell/info', {
  user_id: state.user_id,
  info_id,
  attr: 1,
  ext: 1
})

//获取公司信息
export const GetCompanyInfo = () => req('get', 'member/companyinfo', {
  user_id: state.user_id,
  ext: 1
})

// 获取认证信息
export const GetCertifyInfo = () => req('get', 'validate/info', {
  user_id: state.user_id
})

//获取所在地区
export const GetArea = (area_id) => req('get', 'area/user', {
  area_id,
})

//获取全部地区
export const GetAllCity = (parent_id) => req('get', 'area/list', {
  parent_id,
})

//获取小课堂列表
export const GetArticleList = (pageSize) => req('get', 'article/list', {
  page: 1,
  pageSize: pageSize
})

//获取视频列表
export const GetVideoList = () => req('get', 'video/list', {
  user_id: state.user_id
})

//获取常用分类
export const GetCategorys = () => req('get', 'category/user', {
  user_id: state.user_id
})

//获取自定义分类
export const GetOwnCategory = () => req('get', 'category/user/list', {
  user_id: state.user_id
})

//搜索分类
export const GetCateSearch = (keyword) => req('get', 'category/search', {
  user_id: state.user_id,
  keyword,
  page: 0
})

//获取分类下参数
export const GetCateParams = (category_id) => req('get', 'category/attr', {
  user_id: state.user_id,
  category_id,
})

//保存产品信息设置
export const PostSellInfo = (form) => req('post', 'member/sell/store', qs.stringify({
  user_id: state.user_id,
  info_id: form.id,
  detail_id: form.detail.id,
  attr_id: form.attr.id,
  hot_index: form.hot_index,
  my_category_id: form.my_category_id,
  product_name: form.title,
  hide_keyword: form.detail.keywords,
  selling_point1: form.detail.other.selling_point.selling_point1,
  selling_point2: form.detail.other.selling_point.selling_point2,
  selling_point3: form.detail.other.selling_point.selling_point3,
  brand: form.brand,
  params_value_list: form.attr.attribute,
  unit: form.unit,
  price_type: form.price_type,
  inter_num_1: form.detail.priceitem ? form.detail.priceitem[0].n : form.detail.minamount,
  inter_price_1: form.detail.priceitem ? form.detail.priceitem[0].v : form.price,
  price: form.price,
  minamount: form.detail.minamount,
  maxamount: form.detail.maxamount,
  product_picture: form.detail.thumbs,
  video: form.detail.video_id,
  content: form.detail.content,
  category_id: form.category_id,
  push_type: form.push_type,
  priceitem: form.detail.priceitem,
  character: form.detail.other.character
}))

//sole产品信息保存
export const PostSoleSellInfo = (form) => req('post', 'user/sell/sole/productUpdate', qs.stringify({
  user_id: state.user_id,
  sell_id: form.id,
  sole_id: form.sole_id,
  product_picture: form.detail.thumbs,
  hide_keyword: form.detail.keywords,
  category_id: form.category_id,
  product_name: form.title,
  brand: form.brand,
  params_value_list: form.attr.attribute,
  unit: form.unit,
  price: form.price,
  minamount: form.detail.minamount,
  content: form.detail.content,
}))

// sole店铺分
export const GetSoleScore = () => req('get', 'data/sole/shop_score', {
  user_id: state.user_id,
})

//保存企业信息设置
export const PostCompanyInfo = (form) => req('post', 'member/company/update', qs.stringify({
  user_id: state.user_id,
  company: form.company,
  type: form.type,
  province: form.province,
  city: form.city,
  dis: form.dis,
  business: form.business,
  regyear: form.regyear,
  thumb: form.thumb,
  imageList: form.imageList,
  size: form.size,
  capital: form.capital,
  regunit: form.regunit,
  mode: form.mode,
  mobile: form.mobile,
  telephone: form.telephone,
  mail: form.email,
  qq: form.qq,
  postcode: form.postcode,
  fax: form.fax,
  address: form.address,
  homepage: form.homepage,
  webhomepage: form.webhomepage,
  content: form.content
}))

//保存认证信息设置
export const PostCertifyInfo = (form, vatype) => req('post', 'validate/save', qs.stringify({
  user_id: state.user_id,
  company_itemid: form.itemid || '',
  personal_itemid: form.personal.itemid || '',
  company: form.title,
  type: form.is_merchants,
  unified_code: form.unified_code,
  unified_img: form.thumb,
  contact: form.personal.title,
  per_img1: form.personal.thumb,
  per_img2: form.personal.thumb1,
  vatype
}))

// 批量操作
export const PostManagePro = (type, info_ids) => req('post', 'member/sell/batch', qs.stringify({
  user_id: state.user_id,
  type, //batchDown | batchPush | batchRefresh | batchDelete
  info_ids: JSON.stringify(info_ids)
}))

// 设置爆款
export const PostHotPro = (data) => req('post', 'user/sell/sethot', qs.stringify({
  user_id: state.user_id,
  data: JSON.stringify(data)
}))

// 追加爆款
export const AddHotPro = (data) => req('post', 'user/sell/addhot', qs.stringify({
  user_id: state.user_id,
  data: JSON.stringify(data)
}))

//取消全部爆款
export const DelAllHots = () => req('post', 'user/sell/sethotcal', qs.stringify({
  user_id: state.user_id,
}))

//取消单个爆款
export const DelHotProduct = (sell_id) => req('get', 'user/sell/hotone', {
  user_id: state.user_id,
  sell_id,
  index: 0
})

//获取会员全部产品
export const GetAllProduct = (status, page, keyword, pageSize) => req('get', 'member/sell/list', {
  user_id: state.user_id,
  status,
  page,
  keyword,
  pageSize,
})

//获取爆款产品
export const GetHotProduct = (page, keyword, pageSize) => req('get', 'member/sell/list', {
  user_id: state.user_id,
  status: 3,
  page,
  keyword,
  hot_index: 1,
  pageSize,
  order: 'hot_index',
  order_type: 'ASC'
})

//获取展示数据
export const GetSellTotal = () => req('get', 'user/sell/total', {
  user_id: state.user_id,
})

//获取低质产品
export const GetLowProduct = (repeated, info_type, displayed, group, repeat_level, star, page, keywords, pageSize) => req('get', 'user/low/list', {
  user_id: state.user_id,
  info_type,
  displayed,
  group,
  repeat_level,
  repeated,
  star,
  page,
  keywords,
  pageSize,
})

//获取重复组列表
export const GetRepeatList = () => req('get', 'user/low/group', {
  user_id: state.user_id,
})

//数据追踪
export const GetProChart = (info_id, start_date, end_date) => req('get', 'data/show/sell', {
  user_id: state.user_id,
  info_id,
  start_date,
  end_date
})

// 获取关键词列表
export const GetKeywordList = (start_date, end_date, page, pageSize) => req('get', 'data/query/list', {
  user_id: state.user_id,
  start_date: start_date + ' 00:00:00',
  end_date: end_date + ' 23:59:59',
  page,
  pageSize
})

//图片上传
export const GetUploadSts = () => req('get', 'member/upload/sts', {})

//累计上传文件字节
export const PostImgSize = (size, file_type) => req('post', 'member/upload/size', qs.stringify({
  user_id: state.user_id,
  size,
  file_type
}))

// 获取用户小程序信息
export const GetMiniApp = () => req('get', 'miniapp/query', {
  user_id: state.user_id,
})

// 保存小程序信息
export const PostMiniApp = (app_name, app_desc, app_icon) => req('post', 'miniapp/update', qs.stringify({
  user_id: state.user_id,
  app_name,
  app_desc,
  app_icon
}))

//商铺趋势变化
export const GetShopChart = (start_date, end_date) => req('get', 'data/flow/data', {
  user_id: state.user_id,
  start_date,
  end_date
})

//商品排名变化
export const GetRankList = (start_date, page) => req('get', 'data/show/list', {
  user_id: state.user_id,
  start_date: start_date + ' 00:00:00',
  end_date: tools.pastDate(1) + ' 23:59:59',
  page,
  pageSize: 20
})

//获取相册列表
export const GetPhotoList = (page, keyword, pageSize) => req('get', 'photo/group', {
  user_id: state.user_id,
  page,
  keyword,
  pageSize: pageSize ? pageSize : 20
})

//获取某相册图片
export const GetPhotoPics = (group_id) => req('get', 'photo/list', {
  user_id: state.user_id,
  group_id
})

// 上传图片到相册
export const PostPhotos = (info_id, src, names) => req('post', 'photo/create', qs.stringify({
  user_id: state.user_id,
  info_id,
  src: JSON.stringify(src),
  names: JSON.stringify(names)
}))

// 修改相册名
export const UpdateAlbumName = (id, title) => req('post', 'album/update', qs.stringify({
  user_id: state.user_id,
  id,
  title
}))

// 新建相册
export const AddAlbum = (title) => req('post', 'album/create', qs.stringify({
  user_id: state.user_id,
  title
}))

// 删除相册
export const DeleteAlbum = (ids) => req('post', 'album/delete', qs.stringify({
  user_id: state.user_id,
  ids: JSON.stringify(ids)
}))

// 删除图片
export const DeletePhotos = (ids) => req('post', 'photo/delete', qs.stringify({
  user_id: state.user_id,
  ids: JSON.stringify(ids)
}))

// 保存相册排序
export const PostPhotoOrder = (group_id, ids) => req('post', 'photo/orders', qs.stringify({
  user_id: state.user_id,
  group_id,
  ids: JSON.stringify(ids)
}))

// 保存图片名称
export const UpdatePhotoName = (photo_id, order) => req('get', 'photo/intro', {
  user_id: state.user_id,
  photo_id,
  order
})

// 检查商品
export const GetImageProList = (image_url) => req('get', 'user/sell/imagelist', {
  user_id: state.user_id,
  image_url
})

// 批量修改图片
export const PostBatchimg = (old_url, new_url, info_ids) => req('post', 'user/sell/batchimg', qs.stringify({
  user_id: state.user_id,
  old_url,
  new_url,
  info_ids: JSON.stringify(info_ids)
}))

// 删除视频
export const DeleteVideos = (video_id) => req('get', 'video/delete', {
  user_id: state.user_id,
  video_id
})

// 上传视频
export const PostVideo = (oss_url, size, title) => req('post', 'video/bdupload', qs.stringify({
  user_id: state.user_id,
  oss_url,
  size,
  title
}))

// 获取自定义分类
export const GetCategory = (parent_id) => req('get', 'category/user/child', {
  user_id: state.user_id,
  parent_id
})

// 删除自定义分类
export const DelCategory = (info_id) => req('post', 'category/user/delete', qs.stringify({
  user_id: state.user_id,
  info_id: JSON.stringify(info_id)
}))

// 保存自定义分类
export const PostCategory = (parent_id, category_name) => req('post', 'category/user/save', qs.stringify({
  user_id: state.user_id,
  parent_id,
  category_name
}))

// 获取资质列表
export const GetAbility = () => req('get', 'member/license/user', {
  user_id: state.user_id,
  // user_id: 2162,
})

// 获取资质类别列表
export const GetAbilityData = () => req('get', 'member/license/category', {
  user_id: state.user_id,
})

// 上传资质
export const PostNewAbility = (form) => req('post', 'member/license/add', qs.stringify({
  user_id: state.user_id,
  industry_id: form.industry_id,
  license_id: form.license_id,
  lice_expire_time: form.lice_expire_time,
  lice_serial_num: form.lice_serial_num,
  certi_name: form.certi_name,
  license_img: form.license_img
}))

// 获取模板列表
export const GetTplList = () => req('get', 'shop/tpl/list', {
  user_id: state.user_id,
})

// 获取店铺设置
export const GetSettingInfo = () => req('get', 'shop/setting/info', {
  user_id: state.user_id,
})

// 保存模板
export const PostTplPic = (itemid) => req('post', 'shop/tpl/apply', qs.stringify({
  user_id: state.user_id,
  itemid
}))

// 保存店铺设置
export const PostShopSetting = (data) => req('post', 'shop/setting/update', qs.stringify({
  user_id: state.user_id,
  data: JSON.stringify(data)
}))

// 获取推广数据
export const GetPopularInfo = (start_date, end_date) => req('get', 'spread/user', {
  user_id: state.user_id,
  start_date,
  end_date
})

// 获取扣费记录
export const GetSpreadFee = (page) => req('get', 'spread/flows', {
  user_id: state.user_id,
  page,
  page_size: 20
})

// 获取店铺分
export const getShopStar = () => req('post', 'data/star/week', qs.stringify({
  user_id: state.user_id,
}))

// 获取代发任务列表
export const GetAgentData = (page) => req('get', 'agent/cron/list', {
  user_id: state.user_id,
  page,
  page_size: 20
})

// 启动、停止代发任务
export const SetAgentData = (cron_id, st) => req('get', 'agent/cron/status', {
  user_id: state.user_id,
  cron_id,
  st
})

// 获取代发标题
export const getAgentTitle = (cron_id) => req('get', 'agent/title', {
  user_id: state.user_id,
  cron_id,
})

// 编辑代发标题
export const PostAgentTitle = (title, id) => req('post', 'agent/title/update', qs.stringify({
  user_id: state.user_id,
  title,
  id
}))

// 删除代发标题
export const delAgentTitle = (id) => req('get', 'agent/title/delete', {
  user_id: state.user_id,
  id
})

// 检测违禁词
export const PostCheckTitle = (data) => req('post', 'agent/title/check', qs.stringify({
  user_id: state.user_id,
  data: JSON.stringify(data)
}))

// 获取代发详情
export const getAgentInfo = (cron_id) => req('get', 'agent/cron/detail', {
  user_id: state.user_id,
  cron_id
})

// 创建代发
export const PostNewAgent = (form, detailInfo) => req('post', 'agent/save', qs.stringify({
  user_id: state.user_id,
  cron_id: form.cron_id,
  main_id: form.main_id,
  content_id: form.content_id,
  crontab_name: form.crontab_name,
  push_total: form.push_total,
  day_total: form.day_total,
  day_random: detailInfo.day_random,
  req_time: form.req_time,
  push_time: form.push_time,
  title: form.title,
  category_id: form.category_id,
  my_category_id: form.my_category_id,
  keywords: form.keywords,
  photo_id: detailInfo.photo_id,
  cphoto_box: form.cphoto_box?JSON.stringify(form.cphoto_box):'0',
  brand: detailInfo.brand,
  params_value: form.params_value,
  unit: detailInfo.unit,
  price: detailInfo.price,
  minamount: detailInfo.minamount,
  maxamount: detailInfo.maxamount,
  video_id: detailInfo.video_id,
  content: form.content
}))

// 获取问价消息
export const getMessageList = (page) => req('get', 'user/buy/price/index', {
  user_id: state.user_id,
  page,
  page_size: 20
})

// 获取求购列表
export const getNewsBuyList = (page) => req('get', 'user/buy', {
  user_id: state.user_id,
  page,
  page_size: 20
})

// 删除求购信息
export const DelNewsBuy = (id) => req('post', 'user/buy/del', qs.stringify({
  user_id: state.user_id,
  id
}))

// 获取求购信息
export const getNewsBuyInfo = (id) => req('get', 'user/buy/detail', {
  user_id: state.user_id,
  id
})

// 获取求购分类
export const getNewsBuyClass = () => req('get', 'category/tree', {
  user_id: state.user_id,
})

//保存求购信息编辑
export const PostNewsBuyedit = (form) => req('post', 'user/buy/newSave', qs.stringify({
  user_id: state.user_id,
  id: form.id,
  title: form.title,
  price: form.price,
  days: form.days,
  amount: form.amount,
  content: form.content,
  catid: form.catid,
  thumbs: form.thumbs
}))

//保存求购信息新增
export const PostNewsBuy = (form) => req('post', 'user/buy/newAdd', qs.stringify({
  user_id: state.user_id,
  title: form.title,
  price: form.price,
  days: form.days,
  amount: form.amount,
  content: form.content,
  catid: form.catid,
  thumbs: form.thumbs
}))

// 获取1688用户配置
export const getAliUser = () => req('get', 'alibaba/config/check', {
  user_id: state.user_id,
})

// 获取1688产品列表
export const getAliList = (page) => req('get', 'alibaba/item/list', {
  user_id: state.user_id,
  page,
  page_size: 20
})

// 设置1688用户配置
export const PostAliKey = (app_key, secret) => req('post', 'alibaba/config/bind', qs.stringify({
  user_id: state.user_id,
  secret,
  app_key
}))

// 1688是否需要重新授权
export const getAliCheck = () => req('get', 'alibaba/check', {
  user_id: state.user_id,
})

// 1688请求token
export const PostAliToken = (code, url) => req('post', 'alibaba/token', qs.stringify({
  user_id: state.user_id,
  code,
  url
}))

// 1688同步产品请求
export const getAliSync = () => req('get', 'alibaba/item/sync', {
  user_id: state.user_id,
})

// 1688获取可迁移列表
export const getAliMovelist = () => req('get', 'alibaba/item/useful', {
  user_id: state.user_id,
})

// 1688迁移产品
export const PostAliMove = (form) => req('post', 'alibaba/item/push', qs.stringify({
  user_id: state.user_id,
  unit: form.unit,
  category_id: form.category_id,
  brand: form.brand,
  character: form.character,
  video_id: form.video_id,
  selling_point1: form.selling_point1,
  selling_point2: form.selling_point2,
  selling_point3: form.selling_point3,
  hide_keyword: JSON.stringify(form.hide_keyword),
  ids: form.ids,
  my_category_id: 0
}))

// 用户充值
export const PostBanlance = (base_price, pay_type) => req('post', 'order/recharge', qs.stringify({
  user_id: state.user_id,
  base_price,
  price: base_price,
  pay_type // weixin/alipay
}))

// 批量修改产品
export const PostSellBatch = (form) => req('post', 'user/sell/doBatch', qs.stringify({
  user_id: state.user_id,
  sell_type: form.sell_type,
  sell_all: form.sell_all,
  brand: form.brand,
  maxamount: form.maxamount,
  unit: form.unit,
  video: form.video_id?form.video_id:0,
  price: form.price,
  minamount: form.minamount,
  picture_old: form.picture_old,
  picture_new: form.picture_new,
  title_old: form.title_old,
  title_new: form.title_new,
  detail_old: form.detail_old,
  detail_new: form.detail_new,
  sell_ids: form.sell_ids,
  priceitem: form.priceitem,
  category_id: form.category_id,
}))

// 获取问答列表
export const getAnswerlist = (status, page) => req('get', 'ask/list', {
  user_id: state.user_id,
  status,
  page,
  pageSize: 10,
  order: 'dispTime',
  order_type: 'DESC'
})

// 放弃回答
export const PostAsForgive = (ask_id, reson) => req('post', 'ask/giveup', qs.stringify({
  user_id: state.user_id,
  ask_id,
  reson
}))

// 问答详情
export const getAnswerInfo = (ask_id) => req('get', 'ask/info', {
  user_id: state.user_id,
  ask_id
})

// 保存回答
export const PostAnswer = (form) => req('post', 'ask/update', qs.stringify({
  user_id: state.user_id,
  ask_id: form.ask_id,
  sell_id: form.sell_id,
  source: form.source,
  master_picture: form.master_picture,
  bk_overview: form.bk_overview,
  bk_info: form.bk_info,
  child_overview_1: form.child_overview_1,
  child_picture_1: form.child_picture_1,
  child_info_1: form.child_info_1,
  child_overview_2: form.child_overview_2,
  child_picture_2: form.child_picture_2,
  child_info_2: form.child_info_2,
  child_overview_3: form.child_overview_3,
  child_picture_3: form.child_picture_3,
  child_info_3: form.child_info_3
}))

// 退出登录
export const GetUserLogout = () => req('get', 'https://passport.ctrl.cn/sso/goodbye', {
  callback: '?'
})
