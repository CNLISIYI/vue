import cookies from 'vue-cookies'

export default {
  userData: {}, //会员用户信息
  user_id: '', //会员id
  typeopt: [
    { value: "0", label: "本交所动态" },
    { value: "1", label: "政策要闻" },
    { value: "2", label: "市场动态" },
    { value: "3", label: "科研动向" },
    { value: "4", label: "通知公告" },
    { value: "5", label: "交易流程" },
    { value: "6", label: "关于我们" },
    { value: "7", label: "帮助中心" },
    { value: "8", label: "交易费用" },
    { value: "9", label: "国际快讯" },
    { value: "10", label: "开户流程" },
    { value: "11", label: "国家法规" },
    { value: "11", label: "地方法规" },
  ],
  allIds: [],
  allRoles: []
}
