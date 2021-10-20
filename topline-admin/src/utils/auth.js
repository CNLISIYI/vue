const localStorage = window.localStorage
const USER_KEY = 'user_info'

// export 也用来导出，它支持导出多个成员
// 它的方式有个好处就是：支持按需加载，需要谁才加载谁，打包（npm run build）的时候，对于没有使用的时候不会打包到结果中

export function getUser () {
  return JSON.parse(localStorage.getItem(USER_KEY))
}

export function saveUser (data) {
  localStorage.setItem(USER_KEY, JSON.stringify(data))
}

export function removeUser () {
  localStorage.removeItem(USER_KEY)
}
