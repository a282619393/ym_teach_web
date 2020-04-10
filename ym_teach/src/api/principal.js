import request from '@/utils/request'
import qs from "qs"
export function principalList(data,current,size) {
  return request({
    url: `/teacher/Principal/searchPaging?current=${current}&size=${size}`,
    method: 'post',
    data
  })
}
export function orderList(data) {
  return request({
    url: "/teaching/order/selectOrderList",
    method: 'post',
    data:data
  })
}