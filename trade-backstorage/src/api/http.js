import axios from 'axios'
import router from '../router'
import cookies from 'vue-cookies'

// const authorization = 'Bearer 2005755a-cdfc-4128-89c0-fcd4b430cf69'
const authorization = 'Bearer ' + cookies.get('authorization');

//创建axios的一个实例
var instance = axios.create({
  // timeout: 6000,
  baseURL: '/admin-center/',
  headers: {
    'Accept': '*/*',
    // 'authorization': cookies.get('authorization') ? authorization : '',
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
  if (response.data.code == 401) {
    cookies.set("authorization", '');
    cookies.set("username", '');
    router.push({
      name: "login",
    });
  }
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
    let headers = {
      'authorization': 'Bearer ' + cookies.get('authorization'),
      'Accept': '*/*',
      'Content-Type': 'application/json',
    }
    return instance.post(url, data, {
      headers: headers
    })
  } else if (method == 'get') {
    return instance.get(url, {
      params: data,
      headers: {
        'authorization': 'Bearer ' + cookies.get('authorization'),
        'Content-Type': 'application/json',
      }
    })
  } else if (method == 'delete') {
    return instance.delete(url, {
      params: data,
      headers: {
        'authorization': 'Bearer ' + cookies.get('authorization'),
        'Content-Type': 'application/json',
      }
    })
  } else if (method == 'put') {
    return instance.put(url, data, {
      headers: {
        'authorization': 'Bearer ' + cookies.get('authorization'),
        'Content-Type': 'application/json',
      }
    })
  } else {
    console.error('未知的method' + method)
    return false
  }
}
