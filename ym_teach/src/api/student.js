import request from '@/utils/request'

export function getProvinceList() {         //省
  return request({
    url: '/teaching/Region/getProvinceList',
    method: 'get'
  })
}

export function getCityList(code) {          //市
    return request({
      url: '/teaching/Region/getCityByProvinceId/'+code,
      method: 'get',
    })
  }
  
export function getAreaList(code) {         //区
    return request({
      url: '/teaching/Region/getAreaByCityId/'+code,
      method: 'get',
    })
  }

  export function studentList(name,phone,campusName,classStatus,addressCode,grade,curriculumName,pageNum,pageSize,course) {   //学生列表
    return request({
      url: '/student/queryStudentList',
      method: 'post',
      data: {name,phone,campusName,classStatus,addressCode,grade,curriculumName,pageNum,pageSize,course}
    });
  }
  
  export function course(userId) {             //展开课程，学生有的课程
    return request({
      url: '/student/queryClassList',
      method: 'post',
      params: {userId,pageNum:1,pageSize:1000}
    });
  }

  export function resetPassword(userId,userName,password) {   //重置密码
    return request({
      url: '/student/rechargePassword',
      method: 'post',
      data: {userId,userName,password}
    });
  }