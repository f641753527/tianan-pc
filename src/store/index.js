import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import mutations from './mutations';
import cacheInLocalStorage from './localCache/cacheInLocalStorage';
import cacheInSession from './localCache/cacheInSession';
import cacheInCookies from './localCache/cacheInCookies';
import moduleA from './modules/a';
import moduleB from './modules/b';

Vue.use(Vuex);

const initState = {
  token: cacheInLocalStorage.get('token') || '',
  user: cacheInLocalStorage.get('user') || {},
  userTab: cacheInSession.get('userTab') || '1',
  parkIdList: cacheInSession.get('parkIdList') || [1000],
  parkInfo: cacheInSession.get('parkInfo') || {
    parkName: '天安智慧园',
    logoIcon: '../../static/logo2.png'
  },
  shoppingCart: cacheInLocalStorage.get('shoppingCart') || [],   // 保存购物车
};


export default new Vuex.Store({
  getters,
  mutations,
  state: initState,
  modules: {
    a: moduleA,
    b: moduleB,
  }
});
