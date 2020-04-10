const getters = {
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  WriteTime: state => state.user.WriteTime,
  call_count: state => state.monitor.call_count,
}
export default getters
