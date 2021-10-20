import OSS from 'ali-oss'
import FileSaver from "file-saver";
import {
  GetUserLogout
} from "../api/apis";

// 时间戳转yyyy-mm-dd h:m:s
const timeToDate = (times) => {
  let date = new Date(parseInt(times) * 1000);
  let YY = date.getFullYear() + '-';
  let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
  let hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  let mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  let ss = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return YY + MM + DD + " " + hh + mm + ss;
}

// 时间戳转yyyy-mm-dd
const toYMDDate = (times) => {
  let date = new Date(parseInt(times) * 1000);
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
}

// 标准时间转yyyy-mm-dd
const StoYMDDate = (date) => {
  return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
}

// 时间戳转mm-dd hh:mm
const toMDDate = (times) => {
  let date = new Date(parseInt(times) * 1000);
  let MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  let DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
  let hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  let mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  return MM + DD + " " + hh + mm;
}

// 获取前n天的日期 yyyy-mm-dd
const pastDate = (nums) => {
  let now = new Date().getTime(),
    past = new Date(now - 24 * 60 * 60 * 1000 * nums);
  return `${past.getFullYear()}-${past.getMonth()+1}-${past.getDate()}`
}

// 计算距离时间 dd:hh
const toDayHour = (times) => {
  let stimes = times - new Date().getTime() / 1000;
  if (stimes < 0) {
    return `0 ${state.arkDatas.base.hour}`
  } else {
    let dd = Math.floor(stimes / (60 * 60 * 24));
    let hh = Math.floor(stimes / (60 * 60)) - dd * 24;
    return `${dd} ${state.arkDatas.base.day} ${hh} ${state.arkDatas.base.hour}`
  }
}

const isMobile = () => {
  let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
  return flag;
}


// 外部链接
const openUrl = (url) => {
  window.open(url, "_blank");
}
// 打开产品详情页
const openProduct = (id) => {
  window.open(`https://www.yuncaigou.net/sell-show-${id}.html`, "_blank")
}
// 打开产品详情页
const open1688Pro = (id) => {
  window.open(`https://detail.1688.com/offer/${id}.html`, "_blank")
}

// 只能输入汉字、字母、数字
const inputLimit = (value) => {
  return value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, "")
}
// 只能输入汉字
const onlyChinese = (value) => {
  return value.replace(/[^\u4E00-\u9FA5]/g, "")
}


// kb转gb
const bytesToSize = (bytes) => {
  if (bytes === 0) return {
    sizes: '0 B',
    nums: 0
  };
  let k = 1024,
    sizes = ['B', 'KB', 'MB', 'GB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return {
    sizes: (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i],
    nums: (bytes / Math.pow(k, i)).toFixed(2)
  };
}

// 获取全部产品
const getProList = (status, keyword, page) => {
  GetAllProduct(status, keyword, page)
    .then((res) => {
      if (res.code == 0) {
        return res.body.page.count;
      }
    })
}

// 上传图片OSS
const getClient = (data) => {
  const client = new OSS({
    endpoint: 'http://oss-cn-beijing.aliyuncs.com',
    region: 'oss-cn-beijing.aliyuncs.com',
    accessKeyId: data.AccessKeyId,
    accessKeySecret: data.AccessKeySecret,
    stsToken: data.SecurityToken,
    bucket: 'ctrlyuncaigou'
  });
  return client
}

// 导出文件
const exportCSV = (data, filename) => {
  const Json2csvParser = require("json2csv").Parser;
  const parser = new Json2csvParser();
  const csvData = parser.parse(data);
  const blob = new Blob(["\uFEFF" + csvData], {
    type: "text/plain;charset=utf-8;",
  });
  FileSaver.saveAs(blob, filename);
}

// 产品状态
const proStatus = (data) => {
  if (data == 0) {
    return "下架"
  } else if (data == 1) {
    return "审核失败"
  } else if (data == 2) {
    return "审核中"
  } else {
    return "正常"
  }
}

// 商家认证
const superShop = (value) => {
  let _str = '';
  if (value.memberinfo_field_fac_check) {
    _str += '实力工厂;'
  }
  if (value.memberinfo_field_stall_check) {
    _str += '实力档口;'
  }
  if (value.memberinfo_brand_shop_check) {
    _str += '品牌店铺;'
  }
  if (value.memberinfo_spot_check) {
    _str += '现货商家'
  }
  return _str ? _str : '无认证'
}

// 问题类型
const questype = (data) => {
  let _str = '';
  if (data.image) {
    if (data.image == 10) {
      _str += '主图重复;'
    } else if (data.image == 11) {
      _str += '主图水印;'
    } else if (data.image == 12) {
      _str += '主图不清晰;'
    } else {
      _str += '图片问题;'
    }
  }
  if (data.title) {
    if (data.title == 1) {
      _str += '标题商品词过多;'
    } else if (data.title == 3) {
      _str += '低质标题包含问句;'
    }else if (data.title == 16) {
      _str += '标题含多余字符;'
    }else if (data.title == 17) {
      _str += '标题含无效词;'
    }else if (data.title == 18) {
      _str += '标题长度欠佳;'
    }else if (data.title == 19) {
      _str += '标题内容重复;'
    }else if (data.title == 20) {
      _str += '标题关键词堆砌;'
    }else if (data.title == 21) {
      _str += '标题丰富度低;'
    } else {
      _str += '标题问题;'
    }
  }
  if (data.price) {
    if (data.price == 2) {
      _str += '虚假价格;'
    } else if (data.price == 8) {
      _str += '价格面议;'
    } else {
      _str += '价格问题;'
    }
  }
  if (data.param) {
    if (data.param == 4) {
      _str += '有效参数小于5'
    } else if (data.param == 15) {
      _str += '无效参数'
    } else {
      _str += '参数问题'
    }
  }
  if (data.detail) {
    if (data.detail == 5) {
      _str += '无描述'
    } else if (data.detail == 6) {
      _str += '描述无商品图片'
    } else if (data.detail == 7) {
      _str += '描述无富文本字段'
    } else if (data.detail == 9) {
      _str += '详情丰富度低'
    } else if (data.detail == 13) {
      _str += '详情低质'
    } else if (data.detail == 14) {
      _str += '详情图重复'
    } else {
      _str += '详情问题'
    }
  }
  return _str ? _str : '未知原因'
}

// 退出登录
const userLogout = () => {
  const time = new Date().getTime();
  $cookies.set('user_token', '', time - 86400 * 365, '/', 'yuncaigou.net');
  $cookies.set('ctrl_shop_toid', '', time - 86400 * 365, '/', 'yuncaigou.net');
  $cookies.set('ctrl_id', '', time - 86400 * 365, '/', 'yuncaigou.net');
  $cookies.set('ctrl_member_id', '', time - 86400 * 365, '/', 'yuncaigou.net');
  $cookies.set('ctrl_user_name', '', time - 86400 * 365, '/', 'yuncaigou.net');
  $cookies.set('ctrl_token', '', time - 86400 * 365, '/', 'yuncaigou.net');
  $cookies.set('_act_ctrl', null);
  GetUserLogout()
    .then((data) => {
      if (data && data.sso) {
        var arrayData = eval(data.sso);
        $.each(arrayData, function (i, item) {
          console.log(item);
          $.getJSON(item);
        })
      }
      window.location.href = "https://passport.ctrl.cn/logout?back_url=https://www.yuncaigou.net";
    })
    .catch((err) => {
      this.$message.error(err);
    });
}

export default {
  timeToDate,
  toYMDDate,
  isMobile,
  openUrl,
  getClient,
  bytesToSize,
  toMDDate,
  toDayHour,
  openProduct,
  getProList,
  exportCSV,
  proStatus,
  pastDate,
  StoYMDDate,
  userLogout,
  inputLimit,
  onlyChinese,
  superShop,
  open1688Pro,
  questype
}
