const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  // token: state => state.user.token,
  // avatar: state => state.user.avatar,
  // name: state => state.user.name,
  initialDatas: state => state.initialDatas,
  currentUser: state => state.initialDatas.currentUser
}
export default getters
