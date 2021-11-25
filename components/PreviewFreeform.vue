<template>
  <v-container
    fluid
    width="100%"
    v-bind:style="'overflow-x: scroll'"
  >
    <v-card
      width="100%"
      v-bind:style="'height: '+(this.ctrls.maxy)+'px;'"
      class="dw-preview-ff"
      :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-4'"
      flat
      tile
    >
      <v-container
        v-for="(el, idx) in this.ctrls.header"
        :key="'col-'+idx"
      >
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-card
              class="dw-preview-col text-no-wrap"
              outlined
              v-bind:style="'top: '+el.y+'; left: '+el.x+'px; width: '+el.width+'px; height: '+el.height+'px;'"
              tile
              v-bind="attrs"
              v-on="on"
            >
              {{ el.text }}
            </v-card>
          </template>
          <span>{{ el.text }}</span>
        </v-tooltip>
      </v-container>

      <v-container
        v-for="(el, idx) in this.ctrls.detail"
        :key="'dt-'+idx"
      >
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-card
              class="dw-preview-col text-no-wrap bd-column"
              outlined
              v-bind:style="'top: '+el.y+'px; left: '+el.x+'px; width: '+el.width+'px; height: '+(parseInt(el.height) + 8)+'px;'"
              tile
              v-bind="attrs"
              v-on="on"
            >
              {{ el.name }}
            </v-card>
          </template>
          <span>{{ el.name }}</span>
        </v-tooltip>
      </v-container>

      <v-container
        v-for="(el, idx) in this.ctrls.background"
        :key="'bg-'+idx"
      >
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-card
              class="dw-preview-col text-no-wrap bd-text"
              outlined
              v-bind:style="'top: '+(parseInt(el.y) - 15)+'px; left: '+el.x+'px; width: '+el.width+'px; height: '+(parseInt(el.height) + 8)+'px;'"
              tile
              v-bind="attrs"
              v-on="on"
            >
              {{ el.text }}
            </v-card>
          </template>
          <span>{{ el.text }}</span>
        </v-tooltip>
      </v-container>
      
    </v-card>    
  </v-container>
</template>



<script>
  export default {
    props: ['ctrls'],
    // data () {
    //   return {
    //     // loading: false,
    //     // items: [],
    //     // search: null,
    //     // selDw: this.datawindow,
    //     // // datawindow: null,
    //     // dws: [
    //     // ],
    //   }
    // },
    // async mounted() {
    //   const res = await axios.get(`/dw_src/dw_list.csv`, { responseType: 'blob',}); 
    //   const csvData = res.data;
      
    //   csvData.text().then((csvStr) => {
    //     const csvArr = csvStr.split(/\r?\n/);
    //     this.dws = csvArr;
    //     // console.log( lineArray )
    //   })
    // },
    // watch: {
    //   search (val) {
    //     val && val !== this.datawindow && this.querySelections(val)
    //   },
    //   // datawindow (val) {
    //   //   //
    //   //   console.log(val)
    //   // }
    // },
    // methods: {
    //   querySelections (v) {
    //     this.loading = true
    //     // Simulated ajax query
    //     setTimeout(() => {
    //       this.items = this.dws.filter(e => {
    //         return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1
    //       })
    //       this.loading = false
    //     }, 500)
    //   },
    // },
  }
</script>