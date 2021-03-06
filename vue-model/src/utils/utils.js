import OSS from 'ali-oss'
import FileSaver from "file-saver";

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


export default {
  timeToDate,
  toYMDDate,
  isMobile,
  openUrl,
  bytesToSize,
  toMDDate,
  toDayHour,
  openProduct,
  getProList,
  exportCSV,
  pastDate,
  StoYMDDate,
  inputLimit,
  onlyChinese,
  open1688Pro,
}
