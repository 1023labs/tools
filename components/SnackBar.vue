<template>
  <div class="text-center">
    <!-- <v-btn
      dark
      color="orange darken-2"
      @click="snackbar = true"
    >
      Open Snackbar
    </v-btn> -->

    <v-snackbar
      color="orange lighten-2"
      v-model="snackbar"
      :timeout="timeout"
    >
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="red darken-4"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
  export default {
    // props: ['sbText', 'sbShow'],
    data: () => ({
      multiLine: true,
      snackbar: false, //this.sbShow,
      text: 'My timeout is set to 2000.',
      timeout: 2000,
    }),
  }
</script>

