import FileSaver from "file-saver";
import state from '../store/state'


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

const isMobile = () => {
  let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
  return flag;
}

// 外部链接
const openUrl = (url) => {
  window.open(url, "_blank");
}

// 只能输入汉字、字母、数字
const inputLimit = (value) => {
  return value.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g, "")
}
// 只能输入汉字
const onlyChinese = (value) => {
  return value.replace(/[^\u4E00-\u9FA5]/g, "")
}

// 只能输入数字
const onlyNumber = (value) => {
  return value.replace(/[^\d]/g, '')
}

// 只能输入字母
const onlyEnglish = (value) => {
  return value.replace(/[^\a-\z\A-\Z]/g, '')
}

// base64转url
function imageBase64ToBlob(urlData, type = 'image/jpeg') {
  try {
    var arr = urlData.split(',')
    var mime = arr[0].match(/:(.*?);/)[1] || type;
    var bytes = window.atob(arr[1]);
    var ab = new ArrayBuffer(bytes.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < bytes.length; i++) {
      ia[i] = bytes.charCodeAt(i);
    }
    let blob_data = new Blob([ab], {
      type: mime
    });
    return URL.createObjectURL(blob_data)
  } catch (e) {
    var ab = new ArrayBuffer(0);
    let blob_data = new Blob([ab], {
      type: type,
    });
    return URL.createObjectURL(blob_data)
  }
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

// 文件流转换
const export_excel_file = (export_data) => {
  let link = document.createElement("a");
  let blogw = new Blob([export_data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8"
  })
  let objectUrl = window.URL.createObjectURL(blogw);
  link.href = objectUrl;
  let file_name = `导入数据模板.xlsx`;
  link.download = file_name;
  link.click();
  window.URL.revokeObjectURL(objectUrl);

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

// 手机号
const PhoneInput = (nums) => {
  if (nums.length > 11) {
    return nums.slice(0, 11);
  } else {
    return nums
  }
}

// 身份类型转换
const roleToLabel = (value) => {
  let label = ''
  switch (parseInt(value)) {
    case 0:
      label = '项目业主'
      break
    case 1:
      label = '排放单位'
      break
    case 2:
      label = '项目代理人'
      break
    default:
      label = ''
      break;
  }
  return label;
}

const isMenus = (id) => {
  return state.myMenus.includes(id)
}

const checkIds = (datas) => {
  if (datas.includes(9) && datas.includes(10) && datas.includes(11) && datas.includes(12)) {
    datas.map((item, index) => {
      if (item == 2) {
        datas.slice(index, 1)
      }
      datas.push(2)
    })
  }
  if (datas.includes(13) && datas.includes(14) && datas.includes(15) && datas.includes(16)) {
    datas.map((item, index) => {
      if (item == 3) {
        datas.slice(index, 1)
      }
      datas.push(3)
    })
  }
  if (datas.includes(17) && datas.includes(18) && datas.includes(19) && datas.includes(20)) {
    datas.map((item, index) => {
      if (item == 4) {
        datas.slice(index, 1)
      }
      datas.push(4)
    })
  }
  if (datas.includes(21) && datas.includes(22) && datas.includes(23) && datas.includes(24)) {
    datas.map((item, index) => {
      if (item == 5) {
        datas.slice(index, 1)
      }
      datas.push(5)
    })
  }
  if (datas.includes(25) && datas.includes(26) && datas.includes(27) && datas.includes(28)) {
    datas.map((item, index) => {
      if (item == 7) {
        datas.slice(index, 1)
      }
      datas.push(7)
    })
  }
  if (datas.includes(29) && datas.includes(30) && datas.includes(31)) {
    datas.map((item, index) => {
      if (item == 25) {
        datas.slice(index, 1)
      }
      datas.push(25)
    })
  }
  if (datas.includes(32) && datas.includes(33) && datas.includes(34)) {
    datas.map((item, index) => {
      if (item == 26) {
        datas.slice(index, 1)
      }
      datas.push(26)
    })
  }
}

export default {
  timeToDate,
  toYMDDate,
  isMobile,
  openUrl,
  bytesToSize,
  toMDDate,
  isMenus,
  exportCSV,
  pastDate,
  StoYMDDate,
  inputLimit,
  onlyChinese,
  PhoneInput,
  imageBase64ToBlob,
  onlyNumber,
  onlyEnglish,
  roleToLabel,
  // checkIds,
  export_excel_file
}
