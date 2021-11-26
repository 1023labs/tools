<template>
  <div id='freeform' class='detail_box ver2'>
    <div
      v-for="(row, idx) in this.fInfo.rows"
      :class="'detail_row'"
      :key="'row-'+idx"
    >
      <template
        v-for="(cell, ic) in row"
      >
        <label 
          v-if="cell.label!='none'"
          :class="'detail_label w'+label_width"
          v-bind:key="'in-'+ic"
        >{{ (cell.required ? "*" : "") + cell.label }}</label>
        <div 
          v-if="cell.tags=='input'"
          :class="'detail_input_bg w'+cell.width"
          v-bind:key="'div-'+ic"
        >
          <input v-bind:id="cell.colname" type='text'>
        </div>
        <div 
          v-if="cell.tags=='select'"
          :class="'detail_input_bg w'+cell.width"
          v-bind:key="'sel-'+ic"
        >
          <select v-bind:id="cell.colname" ></select>
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