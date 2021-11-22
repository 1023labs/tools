<template>
  <v-toolbar
    dense
    color="grey lighten-4"
  >
    <v-autocomplete
      v-model="selDw"
      :loading="loading"
      :items="items"
      :search-input.sync="search"
      cache-items
      class="mx-4"
      flat
      hide-no-data
      hide-details
      label="DataWindow Name"
      @change="$emit('update:datawindow', $event)"
    ></v-autocomplete>
    <!-- v-btn icon>
      <v-icon>mdi-dots-vertical</v-icon>
    </v-btn -->
  </v-toolbar>
</template>


<script>
  import axios from "axios";

  export default {
    props: ['datawindow', 'sys_id'],
    data () {
      return {
        loading: false,
        items: [],
        search: null,
        selDw: this.datawindow,
        // datawindow: null,
        dws: [
        ],
      }
    },
    async mounted() {
      const res = await axios.get(`/dw_src/dw_list.csv`, { responseType: 'blob',}); 
      const csvData = res.data;
      
      csvData.text().then((csvStr) => {
        const csvArr = csvStr.split(/\r?\n/);
        this.dws = csvArr;
        // console.log( lineArray )
      })
    },
    watch: {
      search (val) {
        val && val !== this.datawindow && this.querySelections(val)
      },
      // datawindow (val) {
      //   //
      //   console.log(val)
      // }
    },
    methods: {
      querySelections (v) {
        this.loading = true
        // Simulated ajax query
        setTimeout(() => {
          this.items = this.dws.filter(e => {
            return (e || '').toLowerCase().indexOf((v || '').toLowerCase()) > -1
          })
          this.loading = false
        }, 500)
      },
    },
  }
</script>