//resources/js/plugins/mixin.js
import Vue from 'vue';
    
Vue.mixin({
  methods: {
    capitalizeFirstLetter: str => str.charAt(0).toUpperCase() + str.slice(1),
    sampleFunction() {
      alert('Global Functions');
    },
    pbu2pixel(aPbu) {
      return aPbu / 100
    }
  }
});
