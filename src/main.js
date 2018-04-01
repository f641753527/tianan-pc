// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui';
import Es6Promise from 'es6-promise';
import router from './router'
import Store from './store/index';
import axios from 'axios';
import VueLazyLoad from 'vue-lazyload'
import { priceFilter, sexFilter, jsTimestampFilter } from '@/utils/filters';
import apiUrl from '@/static/backstageUrl';
import { getMD5 } from '@/utils/md5';

import App from './App';

// import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/element-#D0011B/index.css'
import './assets/reset.css';
import './assets/site.css';
import './assets/font/iconfont.css';
import SubmitSuccess from '@/components/SubmitSuccess';
import MaskLogin from '@/components/MaskLogin';
import CustomForm from '@/components/CustomForm';

Es6Promise.polyfill();
Vue.prototype.$http = axios;
axios.defaults.headers['clientType'] = '1';
axios.defaults.headers['version'] = '1.0';
// axios.defaults.headers['token'] = Store.state.token;
axios.defaults.headers['auth'] = '4f7087695bc9025846ccfdb39495f109';  

console.log(apiUrl);
Vue.prototype.URL_PREFIX = '';
if (process.env.NODE_ENV !== 'development') {
  Vue.prototype.URL_PREFIX = apiUrl.apiUrl;
}

Vue.filter('SexState', sexFilter);
Vue.filter('PriceFilter', priceFilter);
Vue.filter('DateFilter', jsTimestampFilter);

Vue.prototype.MD5 = function MD5(value) {
  return getMD5(value);
};

Vue.use(ElementUI);
Vue.use(VueLazyLoad,{
  preLoad: 1.3,
  error:'../static/loading.gif',
  loading:'../static/loading.gif',
  attempt: 1
})

Vue.component('SubmitSuccess', SubmitSuccess);
Vue.component('MaskLogin', MaskLogin);
Vue.component('CustomForm', CustomForm);

Vue.config.productionTip = false;

/* eslint-disable no-new */
const root = new Vue({
  el: '#app',
  router,
  store: Store,
  render: h => h(App),
  data: {
    eventHub: new Vue(),
  },
});

axios.interceptors.response.use(function (response) {  
  // token过期错误码
  if (response.data.resCode === '10004'){
    if (response.config.url === '/app/get/qiniu/bucket/token') {
      root.$root.eventHub.$emit('clearToken', 'qiniu');
    } else {
      root.$root.eventHub.$emit('clearToken', '');
    }
  }
  return response  
}, function (error) {  
  // Do something with response error  
  return Promise.reject(error)  
})
