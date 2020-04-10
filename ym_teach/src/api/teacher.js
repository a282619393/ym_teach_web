import axios from '@/utils/request'
export function gainCourse() {
  return axios({
    url: '/teacher/teacherManager/courseList',
    method: 'post'
  })
}

