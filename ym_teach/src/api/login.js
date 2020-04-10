
import request from '@/utils/request'
import layout from '@/components/layout.vue'

export function login(name, password) {
  return request({
    url: '/login/LoginTeacher',
    method: 'post',
    data: {
      name,
      password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: {

    }
  })
}

export function logout(token) {
  return request({
    url: '/login/logout',
    method: 'get',
  })
}

let routes = []
//登录权限
export function addRouter(limit){
  let allRouter = [
  //登录
  {
    path: '/',
    redirect: '/login',
    hidden: false
  },
  {
    path: '/login',
    name: 'login',
    component: login,
    hidden: false

  },
  //校长管理
  {
    path: '/principal',
    component: layout,
    hidden: true,
    meta: {
      title: '校长管理',
      iconY: require("../assets/images/leftbar_ic_principal_pre.png"),
      iconN: require("../assets/images/leftbar_ic_principal_nor.png"),
      // requireAuth: true
    },
    redirect: '/principal/index',
    children: [{
        path: '/principal/index',
        component: () => import('@/views/principal/index.vue'),
        meta: {
          breadList: [{
            path: '/principal',
            name: '校长管理'
          }]
        },
      },
      {
        path: '/principal/add',
        component: () => import('@/views/principal/add.vue'),
        meta: {
          breadList: [{
            path: '/principal',
            name: '校长管理'
          }, {
            path: '/principal/add',
            name: '新增校长'
          }]
        },
      },
      {
        path: '/principal/edit',
        component: () => import('@/views/principal/edit.vue'),
        meta: {
          breadList: [{
            path: '/principal',
            name: '校长管理'
          }, {
            path: '/principal/edit',
            name: '编辑校长'
          }]
        },
      },
    ]
  },
  // 订单管理
  {
    path: '/order',
    component: layout,
    hidden: true,
    meta: {
      title: '订单管理',
      iconY: require("../assets/images/leftbar_ic_order_pre.png"),
      iconN: require("../assets/images/leftbar_ic_order_nor.png"),
    },
    redirect: '/order/index',
    children: [{
      path: '/order/index',
      component: () => import('@/views/order/index.vue'),
      meta: {
        breadList: [{
          path: '/order',
          name: '订单管理'
        }]
      },
    }]
  },
  //老师管理
  {
    path: '/teacher',
    component: layout,
    hidden: true,
    meta: {
      title: '老师管理',
      iconY: require("../assets/images/leftbar_ic_teacher_pre.png"),
      iconN: require("../assets/images/leftbar_ic_teacher_nor.png"),
    },
    redirect: '/teacher/index',
    children: [{
        path: '/teacher/index',
        name:"teacherIndex",
        component: () => import('@/views/teacher/index.vue'),
        meta: {
          breadList: [{
            path: '/teacher',
            name: '老师管理'
          }]
        },
      },
      {
        path: '/teacher/add',
        component: () => import('@/views/teacher/add.vue'),
        meta: {
          breadList: [{
            path: '/teacher',
            name: '老师管理'
          }, {
            path: '/teacher/add',
            name: '新增老师'
          }]
        },
      },
      {
        path: '/teacher/edit',
        component: () => import('@/views/teacher/edit.vue'),
        meta: {
          breadList: [{
            path: '/teacher',
            name: '老师管理'
          }, {
            path: '/teacher/edit',
            name: '编辑老师'
          }]
        },
      },
    ]
  },
  //学生管理
  {
    path: '/student',
    component: layout,
    hidden: true,
    meta: {
      title: '学生管理',
      iconY: require("../assets/images/leftbar_ic_student_pre.png"),
      iconN: require("../assets/images/leftbar_ic_student_nor.png"),
    },
    redirect: '/student/index',
    children: [{
        path: '/student/index',
        name:"studentIndex",
        component: () => import('@/views/student/index.vue'),
        meta: {
          breadList: [{
            path: '/student',
            name: '学生管理'
          }]
        },
      },
      {
        path: '/student/add',
        component: () => import('@/views/student/add.vue'),
        meta: {
          breadList: [{
            path: '/student',
            name: '学生管理'
          }, {
            path: '/student/add',
            name: '新增学生'
          }]
        },
      },
      {
        path: '/student/edit',
        component: () => import('@/views/student/edit.vue'),
        meta: {
          breadList: [{
            path: '/student',
            name: '学生管理'
          }, {
            path: '/student/edit',
            name: '编辑学生'
          }]
        },
      },
      {
        path: '/student/course',
        component: () => import('@/views/student/course.vue'),
        meta: {
          breadList: [{
            path: '/student',
            name: '学生管理'
          }, {
            path: '/student/course',
            name: '课程管理'
          }]
        },
      },
    ]
  },
  //教学管理
  {
    path: '/teaching',
    component: layout,
    hidden: true,
    meta: {
      title: '教学管理',
      iconY: require("../assets/images/leftbar_ic_teaching_pre.png"),
      iconN: require("../assets/images/leftbar_ic_teaching_nor.png"),
    },
    redirect: '/teaching/index',
    children: [{
        path: '/teaching/index',
        component: () => import('@/views/teaching/index.vue'),
        meta: {
          breadList: [{
            path: '/teaching',
            name: '教学管理'
          }]
        },
      },
      {
        path: '/teaching/studyRecord',
        component: () => import('@/views/teaching/studyRecord.vue'),
        meta: {
          breadList: [{
            path: '/teaching',
            name: '教学管理'
          }, {
            path: '/teaching/studyRecord',
            name: '学习记录'
          }]
        },
      },
      {
        path: '/teaching/knowledgeList',
        component: () => import('@/views/teaching/knowledgeList.vue'),
        meta: {
          breadList: [{
            path: '/teaching',
            name: '教学管理'
          }, {
            path: '/teaching/studyRecord',
            name: '学习记录'
          }, {
            path: '/teaching/knowledgeList',
            name: '知识点列表'
          }]
        },
      },
      {
        path: '/teaching/record',
        component: () => import('@/views/teaching/record.vue'),
        meta: {
          breadList: [{
            path: '/teaching',
            name: '教学管理'
          }, {
            path: '/teaching/studyRecord',
            name: '学习记录'
          }, {
            path: '/teaching/knowledgeList',
            name: '知识点列表'
          }, {
            path: '/teaching/record',
            name: '答题记录'
          }]
        },
      },
      {
        path: '/teaching/report',
        component: () => import('@/views/teaching/report.vue'),
        meta: {
          breadList: [{
            path: '/teaching',
            name: '教学管理'
          }, {
            path: '/teaching/studyRecord',
            name: '学习记录'
          }, {
            path: '/teaching/knowledgeList',
            name: '知识点列表'
          }, {
            path: '/teaching/report',
            name: '学习报告'
          }]
        },
      },
      {
        path: '/teaching/evaluating',
        component: () => import('@/views/teaching/evaluating.vue'),
        meta: {
          breadList: [{
            path: '/teaching',
            name: '教学管理'
          }, {
            path: '/teaching/evaluating',
            name: '评测记录'
          }]
        },
      },
      {
        path: '/teaching/appraisal_report',
        component: () => import('@/views/teaching/appraisal_report.vue'),
        meta: {
          breadList: [{
            path: '/teaching',
            name: '教学管理'
          }, {
            path: '/teaching/evaluating',
            name: '评测记录'
          },{
            path: '/teaching/appraisal_report',
            name: '测评报告'
          }]
          },
        },
        {
          path: '/teaching/appraisal_record',
          component: () => import('@/views/teaching/appraisal_record.vue'),
          meta: {
          breadList: [{
            path: '/teaching',
            name: '教学管理'
          }, {
            path: '/teaching/evaluating',
            name: '评测记录'
          },{
            path: '/teaching/appraisal_record',
            name: '答题记录'
          }]
        },
      },
    ]
  },
  //账号管理
  {
    path: '/accounts',
    component: layout,
    hidden: true,
    meta: {
      title: '账号管理',
      iconY: require("../assets/images/leftbar_ic_number_pre.png"),
      iconN: require("../assets/images/leftbar_ic_number_nor.png"),
    },
    redirect: '/accounts/index',
    children: [{
        path: '/accounts/index',
        component: () => import('@/views/accounts/index.vue'),
        meta: {
          breadList: [{
            path: '/accounts',
            name: '账号管理'
          }]
        },
      },
      {
        path: '/accounts/buy',
        component: () => import('@/views/accounts/buy.vue'),
        meta: {
          breadList: [{
            path: '/accounts',
            name: '账号管理'
          }, {
            path: '/accounts/buy',
            name: '购买账号'
          }]
        },
      },
      {
        path: '/accounts/pay',
        component: () => import('@/views/accounts/pay.vue'),
        meta: {
          breadList: [{
            path: '/accounts',
            name: '账号管理'
          }, {
            path: '/accounts/pay',
            name: '支付渠道'
          }]
        },
      }
    ]
  },
  //监课
    {
      path: '/monitor',
      component: layout,
      hidden: true,
  
      meta: {
        title: '监课',
        iconY: require("../assets/images/leftbar_ic_class_pre.png"),
        iconN: require("../assets/images/leftbar_ic_class_nor.png"),
      },
      redirect: '/monitor/index',
      children: [
        //监课首页
        {
          path: '/monitor/index',
          meta: {
            requireAuth: true,
            title: '监课',
            breadList: [{
              path: '/monitor',
              name: '监课'
            }]
          },
          component: () => import('@/views/monitor/index.vue'),
          children:[
            {
              path: '/monitor/index',
              meta: {
                requireAuth: true,
                title: '监课',
                breadList: [{
                  path: '/monitor',
                  name: '监课'
                }]
              },
              component: () => import('@/views/monitor/monitor.vue'),
            },
            {
              path: '/monitor/record/:knowledgeId/:studentId',
              name:"/monitor/record",
              meta: {
                requireAuth: true,
                title: '答题记录',
                breadList: [{
                  path: '/monitor',
                  name: '监课'
                }, {
                  path: '/monitor/record',
                  name: '答题记录'
                }]
              },
              component: () => import('@/views/monitor/record.vue'),
            },
            {
              path: '/monitor/call',
              meta: {
                requireAuth: true,
                title: '呼叫申请',
                breadList: [{
                  path: '/monitor',
                  name: '监课'
                }, {
                  path: '/monitor/call',
                  name: '呼叫申请'
                }]
              },
              component: () => import('@/views/monitor/callList.vue'),
            },
            {
              path: '/monitor/AnswerDetails/:id',
              name:"/monitor/AnswerDetails",
              meta: {
                requireAuth: true,
                title: '查看详情',
                breadList: [{
                  path: '/monitor',
                  name: '监课'
                }, {
                  path: '/monitor/call',
                  name: '呼叫申请'
                }, {
                  path: '/monitor/AnswerDetails',
                  name: '查看详情'
                }]
              },
              component: () => import('@/views/monitor/AnswerDetails.vue'),
            }
          ]
        }
      ]
    },
  //404
  {
    path: '*',
    hidden: false,
    meta: {
      requireAuth: false,
    },
    component: layout,
    redirect: '/404',
    children: [{
      path: '/404',
      meta: {
        requireAuth: true,
      },
      component: () => import('@/views/error/404.vue'),
    }, ]
  }
]
  // let routes = []
    // 根据不同权限展示不同功能
    routes = allRouter.filter((item, index) => {
      let str = String(index-1)
      return limit.includes(str) ||  index === allRouter.length - 1
    });

  return routes
}


