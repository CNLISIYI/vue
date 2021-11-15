import axios from 'axios'
import cookies from 'vue-cookies'

const authorization = 'Bearer 2005755a-cdfc-4128-89c0-fcd4b430cf69'
// const authorization = 'Bearer '+cookies.get('ctrl_shop_to')

//创建axios的一个实例
var instance = axios.create({
  // timeout: 6000,
  baseURL: '/admin-center/',
  headers: {
    'Accept':'*/*',
    authorization: authorization,
    'Content-Type': 'application/json',
  }
})


//------------------- 一、请求拦截器 忽略
instance.interceptors.request.use(function (config) {

  return config;
}, function (error) {
  console.log('请求错误')
  return Promise.reject(error);
});

//----------------- 二、响应拦截器 忽略
instance.interceptors.response.use(function (response) {

  return response.data;
}, function (error) {
  console.log('拦截器报错');
  return Promise.reject(error);
});

/**
 * 使用es6的export default导出了一个函数，导出的函数代替axios去帮我们请求数据，
 * 函数的参数及返回值如下：
 * @param {String} method 请求的方法：get、post、delete、put
 * @param {String} url   请求的url:
 * @param {Object} data  请求的参数
 * @returns {Promise}   返回一个promise对象，其实就相当于axios请求数据的返回值
 */
export default function (method, url, data = null) {
  method = method.toLowerCase();
  if (method == 'post') {
    return instance.post(url, data)
  } else if (method == 'get') {
    return instance.get(url, {
      params: data
    })
  } else if (method == 'delete') {
    return instance.delete(url, {
      params: data
    })
  } else if (method == 'put') {
    return instance.put(url, data)
  } else {
    console.error('未知的method' + method)
    return false
  }
}
