import cookies from 'vue-cookies'

export default {
  userData: {}, //会员用户信息
  companyData: {}, //会员公司信息
  vipUseData: [], //会员有效权限
  user_id: cookies.get('ctrl_shop_toid'), //会员id
  // user_id: 3523, //会员id
  mobileWidth: document.documentElement.offsetWidth || document.body.offsetWidth, //当前设备分辨率宽度
  uploadSts: {}, //上传图片sts对象
  //计量单位
  unitOption: [{
      label: "把", //b
    },
    {
      label: "包",
    },
    {
      label: "板",
    },
    {
      label: "车", //c
    },
    {
      label: "袋", //d
    },
    {
      label: "吨", 
    },
    {
      label: "副", //f
    },
    {
      label: "幅", 
    },
    {
      label: "个", //g
    },
    {
      label: "根", 
    },
    {
      label: "毫米", //h
    },
    {
      label: "户",
    },
    {
      label: "架", //j
    },
    {
      label: "件",
    },
    {
      label: "间",
    },
    {
      label: "克", //k
    },
    {
      label: "颗", 
    },
    {
      label: "块", 
    },
    {
      label: "厘米", //l
    },
    {
      label: "立方米",
    },
    {
      label: "粒",
    },
    {
      label: "辆",
    },
    {
      label: "类",
    },
    {
      label: "米", //m
    },
    {
      label: "面",
    },
    {
      label: "亩",
    },
    {
      label: "年", //n
    },
    {
      label: "平方米", //p
    },
    {
      label: "瓶",
    },
    {
      label: "千克", //q
    },
    {
      label: "升", //s
    },
    {
      label: "台", //t
    },
    {
      label: "套",
    },
    {
      label: "条",
    },
    {
      label: "天",
    },
    {
      label: "桶",
    },
    {
      label: "位", //w
    },
    {
      label: "箱", //x
    },
    {
      label: "月", //y
    },
    {
      label: "张", //z
    },
    {
      label: "组",
    },
  ],
}
