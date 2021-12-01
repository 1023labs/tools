<template>
  <div class="text-center">

    <v-snackbar
      color="orange lighten-2"
      v-model="sbar"
      :multi-line="multiLine"
      :timeout="timeout"
    >
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="red darken-4"
          text
          v-bind="attrs"
          @click="sbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
  export default {
    props: ['sbText', 'sbShow'],
    data () {
      return {
        multiLine: true,
        sbar: this.sbShow,
        text: this.sbText,
        timeout: 5000,
      }
    },
  }
</script>

