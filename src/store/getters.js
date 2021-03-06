const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  eid: state => state.user.eid,
  notification: state => state.notification.msg,
  permission_routes: state => state.permission.routes,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  manage_roles: state => ['pm_manager', 'configurer', 'pm', 'epg_leader', 'qa_manager']
}
export default getters
