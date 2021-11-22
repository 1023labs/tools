<template>
  <div>
    <v-card
      class="d-flex flex-row mb-6"
      :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-4'"
      flat
      tile
    >
      <v-card
        v-for="n in 1"
        :key="n"
        class="pa-2"
        outlined
        tile
      >
        Flex item {{ n }}
      </v-card>
    </v-card>
  </div>
</template>