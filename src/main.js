import Vue from 'vue'
import Vuex from 'vuex'
import VueGAPI from "vue-gapi";

import App from './App.vue'

const gApiOpts = {
  clientId: process.env.VUE_APP_GAPI_CLIENTID,
  apiKey: process.env.VUE_APP_GAPI_APIKEY,
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  scope: 'https://www.googleapis.com/auth/calendar.readonly',
};

Vue.use(VueGAPI, gApiOpts);
Vue.use(Vuex)
Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    calendars: []
  },
  mutations: {
    setCalendars (state, calendars) {
      state.calendars = calendars;
    }
  }
})

new Vue({
  render: h => h(App),
  store,
  mounted () {
    this.$isSignedIn()
      .then(authenticated => {
        if (authenticated) return Promise.resolve();
        return this.$login;
      })
      .then(() => {
        this.$gapi.getGapiClient()
          .then(gapi => gapi.client.calendar.calendarList.list())
          .then(cals => {
            const calendars = cals.result.items.filter(c => c.id.includes(process.env.VUE_APP_DOMAIN))
              .map(c => ({ id: c.id, summary: c.summary}));
            store.commit('setCalendars', calendars)
          })
          .catch(e => {
            console.log(e)
          })
        })
      .catch(e => {
        //TODO: log error
      });
  },
}).$mount('#app')
