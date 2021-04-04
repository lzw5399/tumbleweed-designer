import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import initialDatas from './modules/initialDatas'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    settings,
    initialDatas
  },
  getters
})

export default store
