import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import mutations from './mutations';

Vue.use(Vuex);

const initState = {
  age: 11,
};


const moduleA = {
  namespaced: true,
  getters,
  mutations,
  state: initState,
}

export default moduleA;
