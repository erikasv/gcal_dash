import Vue from 'vue'
import App from './App.vue'
import VueGAPI from "vue-gapi";

const gApiOpts = {
  clientId: process.env.VUE_APP_GAPI_CLIENTID,
  apiKey: process.env.VUE_APP_GAPI_APIKEY,
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  scope: 'https://www.googleapis.com/auth/calendar.readonly',
};

Vue.use(VueGAPI, gApiOpts);
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  data: { calendars: [] },
  mounted () {
    this.$login()
      .then(() => {
        this.$gapi.getGapiClient()
          .then(gapi => gapi.client.calendar.calendarList.list())
          .then(cals => {
            this.calendars = cals.result.items.filter(c => c.id.includes(process.env.VUE_APP_DOMAIN))
              .map(c => ({ id: c.id, summary: c.summary}));
          })
          .catch(e => {
            console.log(e)
          })
      });
  },
}).$mount('#app')
