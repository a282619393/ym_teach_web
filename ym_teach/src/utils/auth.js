import Cookies from 'js-cookie'
import store from '../store/index'


const TokenKey = 'Admin-Token'

export function getToken(token) {
  //return Cookies.get(TokenKey)
  return window.sessionStorage.getItem(TokenKey)
}

export function setToken(token) {
 // return Cookies.set(TokenKey, token)
 return window.sessionStorage.setItem(TokenKey, token)
}

export function removeToken() {
 // return Cookies.remove(TokenKey)
 return window.sessionStorage.removeItem(TokenKey)
}
export function objClear(obj){
  for(let i in obj){
    obj[i]=""
  }
  return obj
}
export function isObjNull(obj){
  for(let key in obj){
    return false; 
  }
  return true; 
}