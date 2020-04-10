import request from '@/utils/request';

export function studentList(name,campuName,userName,pageNum,pageSize) { //学生列表
  return request({
    url: '/teaching/students',
    method: 'post',
    data: {name,campuName,userName,pageNum,pageSize}
  });
}

export function courseList(studentId) {                                  //课程
  return request({
    url: '/teaching/getRecordCourse',
    method: 'get',
    params:{studentId}
  });
}

export function knowledgeList(studentId,courseId) {                     //知识点
  return request({
    url: '/teaching/getRecordKnowledge',
    method: 'get',
    params:{studentId,courseId}
  });
}

export function getReport(courseId,knowledgeId,studentId) {            //学习报告
  return request({
    url: '/teaching/report',
    method: 'get',
    params:{courseId,knowledgeId,studentId}
  });
}

export function getRecord(knowledgeId,studentId,right) {            //学习记录
  return request({
    url: '/teaching/records',
    method: 'get',
    params:{knowledgeId,right,studentId}
  });
}


//获取视频地址
export function videoPlay(videoId) {
  return request({
    url: `/video/play?videoId=${videoId}`,
    method: 'get', 
  })
}

export function getEvaluateRecord(courseId,studentId,right) {            //测评答题记录
  return request({
    url: '/evaluate/records',
    method: 'get',
    params:{courseId,studentId,right}
  });
}

export function getEvaluateReport(courseId,studentId) {            //测评报告
  return request({
    url: '/evaluate/report',
    method: 'get',
    params:{courseId,studentId}
  });
}

