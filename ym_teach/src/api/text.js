import request from '@/utils/request';

export function test1(form) {
  return request({
    url: '/course/getCourseByStuId',
    method: 'get',
    params:{form}
  });
}

export function test2(form) { 
  return request({
    url: '/area',
    method: 'post',
    data: form
  });
}

export function test3() {
  return request({
    url: '/example/00',
    method: 'get',
  });
}
