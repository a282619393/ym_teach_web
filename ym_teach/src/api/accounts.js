import request from '@/utils/request';



//根据条件查询账号列表
export function getAccountList(status,
                               startTime,
                               endTime,
                               accountName,
                               campusName,
                               updatePersonName,

                               pageSize,pageNum) {
  return request({
    url: '/account/number/getAccountByCondition',
    method: 'post',
    data: {
      status,
      startTime,
      endTime,
      accountName,
      campusName,
      updatePersonName,
      pageSize,
      pageNum
    }
  });
}

//获取极光 teachid208808
export function messageAuth() {
  return request({
    url: '/jmessage/auth',
    method: 'get',

  });
}

//监课tabs
export function monitorTabs() {
  return request({
    url: '/monitorClass/tabs',
    method: 'get',

  });
}

//监课列表
export function monitorClassList(gradeId,courseId) {
  return request({
    url: `/monitorClass/list?gradeId=${gradeId}&courseId=${courseId}`,
    method: 'get',

  });
}


//监课详情
export function monitorClassDetail(studentId,knowledgeId,right) {
  return request({
    url: `/monitorClass/detail?studentId=${studentId}&knowledgeId=${knowledgeId}&right=${right}`,
    method: 'get',

  });
}
//呼叫列表
export function monitorCallList(gradeId,courseId,pageSize,pageNo) {
  return request({
    url: `/monitorClass/callList?gradeId=${gradeId}&courseId=${courseId}&pageNo=${pageNo}&pageSize=${pageSize}`,
    method: 'get',

  });
}
//呼叫详情
export function monitorcallDateil(callId) {
  return request({
    url: `/monitorClass/callDateil?callId=${callId}`,
    method: 'get',

  });
}
///monitorClass/updateCall 处理呼叫 参数callId
export function monitorUpdateCall(callId) {
  return request({
    url: `/monitorClass/updateCall?callId=${callId}`,
    method: 'get',

  });
}
//购买帐号
export function createOrder(amount,currRegionCode) {
  return request({
    url: '/teaching/order/createOrder',
    method: 'post',
    data: {amount,currRegionCode}
  });
}

//获取视频地址
export function videoPlay(videoId) {
  return request({
    url: `/video/play?videoId=${videoId}`,
    method: 'get',
  })
}

















