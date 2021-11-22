<template>
  <v-container fluid class="pa-0">
    <v-row>
      <v-col class="pa-5">^^;</v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      icon: 'srd',
      srdSource: '',
      links: [
        'Dashboard',
        'Messages',
        'Profile',
        'Updates',
      ],
    }),
    methods: {
      change_tab: function() {
        console.log(this.icon)
        if(this.icon=="view") {
          const rows = this.srdSource.split(/\r?\n/);
          rows.forEach(el => {
            console.log(el) // $PBExportHeader
          });
        }
      }
    }
  }
</script>