import req from './http.js'
import state from '../store/state'
import qs from 'qs'

//get 
export const GetProductDetail = (info_id) => req('get', 'member/sell/info', {
  info_id
})


// post
export const PostNewAgent = (form) => req('post', 'agent/save', qs.stringify({
  user_id: state.user_id,
  cphoto_box: form.cphoto_box ? JSON.stringify(form.cphoto_box) : '0',
}))
