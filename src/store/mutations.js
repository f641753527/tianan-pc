import cacheInLocalStorage from './localCache/cacheInLocalStorage';
import cacheInSession from './localCache/cacheInSession';
import cacheInCookies from './localCache/cacheInCookies';

const mutations = {
  change_token(state, token) {  // 修改登录状态
    state.token = token;
    if (token) {
      cacheInLocalStorage.set('token', token);   // 登录成功，记录响应的token
    } else {
      cacheInLocalStorage.remove('token');   // 主动退出, 清除登陆状态
    }
  },
  change_user(state, user) {
    state.user = user;
    if (user) {
      cacheInLocalStorage.set('user', user);  // 登陆成功，记录user信息
    } else {
      cacheInLocalStorage.remove('user');   // 退出登陆，删除该user信息
    }
  },
  change_userTab(state, newTab) {
    state.userTab = newTab;
    cacheInSession.set('userTab', newTab);
  },
  change_cart(state, shoppingCart) {  // 修改购物车
    state.shoppingCart = shoppingCart;
    if (shoppingCart) {
      cacheInLocalStorage.set('shoppingCart', shoppingCart);   // 覆盖购物车
    } else {
      cacheInLocalStorage.remove('shoppingCart');   // 清空购物车
    }
  },
  change_parkInfo(state, parkInfo) {  // 修改park信息
    state.parkInfo = parkInfo;
    if (parkInfo) {
      cacheInSession.set('parkInfo', parkInfo);
    }
  },
  change_parkIdList(state, parkId) {  // 修改park列表
    // state.parkIdList = state.parkIdList.unshift(parkId);
    state.parkIdList.unshift(parkId)
    cacheInSession.set('parkIdList', state.parkIdList);
  },
};

export default mutations;
