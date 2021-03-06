import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard 控制台', icon: 'dashboard' }
    }]
  },

  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/defect',
    component: Layout,
    redirect: '/defect/list',
    alwaysShow: 'true',
    name: 'defect',
    meta: { title: '我的缺陷', icon: 'bug' },
    children: [
      {
        path: 'list',
        name: 'defect-list',
        component: () => import('@/views/defect/index'),
        meta: { title: '我的缺陷', icon: 'table' }
      },
      {
        path: 'new',
        name: 'defect-new',
        component: () => import('@/views/defect/new/index'),
        meta: { title: '新建缺陷', icon: 'edit' }
      },
      {
        path: 'edit/:did(\\d+)',
        component: () => import('@/views/defect/new/index'),
        name: 'edit-defect',
        meta: { title: '编辑缺陷' },
        hidden: true
      }
    ]
  },
  {
    path: '/manhour',
    component: Layout,
    redirect: '/manhour/list',
    name: 'manhour',
    meta: { title: '我的工时', icon: 'example' },
    children: [
      {
        path: 'list',
        name: 'manhour-list',
        component: () => import('@/views/manhour/index'),
        meta: { title: '我的工时', icon: 'table' }
      },
      {
        path: 'new',
        name: 'manhour-new',
        component: () => import('@/views/manhour/new/index'),
        meta: { title: '上报工时', icon: 'edit' }
      },
      {
        path: 'edit/:mid(\\d+)',
        name: 'edit-manhour',
        component: () => import('@/views/manhour/new/index'),
        meta: { title: '编辑工时' },
        hidden: true
      },
      {
        path: 'approval',
        component: () => import('@/views/manhour/approval/index'),
        name: 'approval-manhour',
        meta: { title: '审批工时', icon: 'eye-open' }
      }
    ]
  },
  {
    path: '/property',
    component: Layout,
    redirect: '/property/list',
    name: 'property',
    meta: { title: '我的设备', icon: 'Tool' },
    children: [
      {
        path: 'list',
        name: 'property-list',
        component: () => import('@/views/property/index'),
        meta: { title: '我的设备', icon: 'table' }
      },
      {
        path: 'new',
        name: 'property-new',
        component: () => import('@/views/property/new/index'),
        meta: { title: '租借设备', icon: 'shopping' }
      },
      {
        path: 'edit/:poid(\\d+)',
        name: 'property-edit',
        component: () => import('@/views/property/new/index'),
        meta: { title: '更新租借信息' },
        hidden: true
      }
    ]
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/workflow',
    component: Layout,
    redirect: '/workflow/list',
    name: 'workflow-manage',
    meta: {
      title: '我的 WorkFlow',
      icon: 'message',
      roles: ['pm_manager', 'configurer', 'pm', 'epg_leader', 'qa_manager']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/workflow/index'),
        name: 'workflow-list',
        meta: { title: '我的 WorkFlow', icon: 'message' }
      }
    ]
  },

  {
    path: '/project',
    component: Layout,
    redirect: '/project/list',
    name: 'project',
    meta: { title: '我的项目', icon: 'component' },
    children: [
      {
        path: 'list',
        name: 'project-list',
        component: () => import('@/views/project/index'),
        meta: { title: '我的项目', icon: 'table' }
      },
      {
        path: 'new',
        name: 'project-new',
        component: () => import('@/views/project/new/index'),
        meta: {
          title: '新建项目',
          icon: 'edit',
          roles: ['pm']
        }
      },
      {
        path: 'manage/:pid',
        name: 'project-manage',
        component: () => import('@/views/project/manage/index'),
        meta: {
          title: '项目管理',
          // roles: ['pm_manager', 'configurer', 'pm', 'epg_leader', 'qa_manager']
        },
        hidden: true,
        children: [
          {
            path: 'overview',
            name: 'project-manage-overview',
            component: () => import('@/views/project/manage/overview/index'),
            meta: { title: '项目基本信息', icon: 'tree-table' }
          }
        ]
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
