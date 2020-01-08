<template>
  <div>
    <h1>Prototipo</h1>
    <p>
      Listar eventos por investigador que hagan parte de alguno de estos "proyectos":<br />
      <select v-model="topic">
        <option value='ALL'>TODOS</option>
        <option value='ANH'>ANH</option>
        <option value='ANLA'>ANLA</option>
      </select>
    </p>
    <ul>
      <li v-for="cal in this.$store.state.calendars" v-bind:key="cal.id">
        {{cal.summary}} <button v-on:click="listEvents(cal.id); selected = cal.id">Load</button>
      </li>
    </ul>
    <div v-if="selected">
      <h3>Eventos de {{selected}}</h3>
      <ul>
        <li v-for="event in events" v-bind:key="event.id">
          <p>
            <b>Titulo:</b> {{event.summary}}<br/>
            <b>Inicio:</b> {{new Date(event.start).toLocaleString('es-CO')}}<br />
            <b>Finalización:</b> {{new Date(event.end).toLocaleString('es-CO')}}
          </p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  data: () => ({
    selected: null,
    events: [],
    topic: 'ALL',
  }),
  methods: {
    listEvents (calId) {
      this.$gapi.getGapiClient()
        .then(gapi => {
          const today = new Date()
          const aMonthAgo = new Date(today.setMonth(today.getMonth() - 1));
          const aMonthLater = new Date(today.setMonth(today.getMonth() + 2));
          return gapi.client.calendar.events.list({
            calendarId: calId,
            timeMin: aMonthAgo.toISOString(),
            timeMax: aMonthLater.toISOString(),
            orderBy: 'startTime',
            singleEvents: true,
            maxResults: 25
          })
        })
        .then(info => {
          if (this.topic !== 'ALL') {
            console.log(info)
            return info.result.items.filter(e => e.summary.includes(this.topic))
          }
          return info.result.items;
        })
        .then(results => {
          this.events = results.map(e => ({
            id: e.id,
            summary: e.summary,
            start: e.start.dateTime || e.start.date,
            end: e.end.dateTime || e.end.date,
          }))
        })
        .catch(e => {
          // TODO: log error
        });
    }
  },
}
</script>
