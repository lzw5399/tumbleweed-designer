
const state = {
  users: [{
    id: '1',
    name: '张三'
  }, {
    id: '2',
    name: '李四'
  }, {
    id: '3',
    name: '马六'
  }, {
    id: '4',
    name: '赵七'
  }],
  roles: [{
    id: '1',
    name: '管理员'
  }, {
    id: '2',
    name: '财务'
  }]
}

const initialUser = getInitialUser()
state.currentUser = initialUser

const mutations = {
  CHANGE_USER: (state, user) => {
    state.currentUser = user
  }
}

const actions = {
  changeUser({ commit }, user) {
    commit('CHANGE_USER', user)
    localStorage.setItem('currentUser', JSON.stringify(user))
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

function getInitialUser() {
  const u = localStorage.getItem('currentUser')
  if (!u) {
    localStorage.setItem('currentUser', JSON.stringify(state.users[0]))
    return state.users[0]
  }
  return JSON.parse(u)
}
