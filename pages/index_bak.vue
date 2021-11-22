<template>
  <v-container fluid fill-height class="pa-0">
    <v-app-bar
      app
      color="white"
      flat
      height="38px"
    >
      <v-btn-toggle
        v-model="icon"
        borderless
        mandatory
        v-on:change="change_tab"
      >
        <v-btn value="srd" small>
          <span class="hidden-sm-and-down">SRD</span>

          <v-icon right>
            mdi-code-json
          </v-icon>
        </v-btn>

        <v-btn value="view" small>
          <span class="hidden-sm-and-down">View</span>

          <v-icon right>
            mdi-view-quilt-outline
          </v-icon>
        </v-btn>

        <v-btn value="right" small>
          <span class="hidden-sm-and-down">Right</span>

          <v-icon right>
            mdi-format-align-right
          </v-icon>
        </v-btn>

        <v-btn value="justify" small>
          <span class="hidden-sm-and-down">Justify</span>

          <v-icon right>
            mdi-format-align-justify
          </v-icon>
        </v-btn>
      </v-btn-toggle>
    </v-app-bar>

    <v-main class="grey lighten-3 fill-height px-3 pb-3 pt-13 ">
      <v-card class="pa-4 fill-height" v-if="icon=='srd'">
        <v-textarea
          v-model="srdSource"
          outlined
          name="srd-source"
          label="(*.srd) Source"
          value=""
        ></v-textarea>
      </v-card>

      <v-row dense class="fill-height" v-if="icon=='view'">
        <v-col cols="8" >
          <v-card class="pa-4 fill-height">
            view
          </v-card>
        </v-col>
        <v-col cols="4">
          <v-card class="pa-4 fill-height">
            view
          </v-card>
        </v-col>
      </v-row>

    
    </v-main>
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