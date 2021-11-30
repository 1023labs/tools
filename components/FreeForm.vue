<template>
  <div id='freeform' class='detail_box ver2'>
    <div
      v-for="(row, idx) in rows"
      :class="'detail_row'"
      :key="'row-'+idx"
    >
      <template
        v-for="(el, ic) in row"
      >
        <label 
          v-if="el.type=='label'"
          :class="'detail_label w'+label_width"
          v-bind:key="'in-'+ic"
        >{{ (el.required ? "*" : "") + el.text }}</label>
        
        <div 
          v-else-if="el.type='column'&&el.tags=='input'"
          :class="'detail_input_bg w'+el.width"
          v-bind:key="'div-'+ic"
        >
          <input v-bind:id="el.colname" type='text'>
        </div>

        <div 
          v-else-if="el.type='column'&&el.tags=='select'"
          :class="'detail_input_bg w'+el.width"
          v-bind:key="'sel-'+ic"
        >
          <select v-bind:id="el.colname" ></select>
        </div>
      </template>
    </div>
  </div>
</template>


<script>
  export default {
    props: ['fInfo'],
    data () {
      return {
        label_width: this.fInfo.label_width,
        controls: this.fInfo.controls,
        rows: this.fInfo.rows,
        // cols: this.fInfo,
        // loading: false,
        // items: [],
        // search: null,
        // selDw: this.datawindow,
        // // datawindow: null,
        // dws: [
        // ],
      }
    },
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