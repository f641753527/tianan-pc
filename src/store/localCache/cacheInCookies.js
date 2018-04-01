import VueCookies from 'vue-cookies';

const DAY = 60 * 60 * 24;

const cacheInCookies = {
  set(key, value) {
    VueCookies.set(key, JSON.stringify(value), 7 * DAY);
  },
  get(key) {
    return JSON.parse(VueCookies.get(key)) || '';
  },
  remove(key) {
    VueCookies.remove(key);
  },
};

export default cacheInCookies;
