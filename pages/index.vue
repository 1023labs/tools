<template>
  <v-container fluid class="pa-0 fill-height">
    <v-row 
      class="justify-center"
    >
      <v-col 
        cols="auto"
        align-self="center" 
        class="pa-5"
      >
        <v-btn
          x-large
          color="light-green darken-4"
          to="/dw_info/grid"
          dark
        >
          Grid DW 헤더수정 Sql 생성
        </v-btn>

        <v-btn
          x-large
          color="light-green darken-3"
          to="/dw_info/freeform"
          dark
        >
          FreeForm DW Html 생성
        </v-btn>
      </v-col>
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