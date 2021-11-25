<template>
  <v-container
    fluid
    width="100%"
    v-bind:style="'overflow-x: scroll'"
  >
    <v-card
      width="100%"
      class="dw-preview-grid"
      height="30"
      :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-4'"
      flat
      tile
    >
      <v-container
        v-for="(el, idx) in this.ctrls.header"
        :key="idx"
      >
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-card
              class="py-1 dw-preview-col text-no-wrap bg-text"
              outlined
              v-bind:style="'left: '+el.x+'px; width: '+el.width+'px;'"
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
    
    <v-card
      width="100%"
      class="dw-preview-grid"
      height="30"
      :color="$vuetify.theme.dark ? 'grey darken-3' : 'grey lighten-4'"
      flat
      tile
    >
      <v-container
        v-for="(el, idx) in this.ctrls.detail"
        :key="idx"
      >
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-card
              class="py-1 dw-preview-col text-no-wrap bg-column"
              outlined
              v-bind:style="'left: '+el.x+'px; width: '+el.width+'px; overflow: hidden'"
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
    </v-card>
  </v-container>
</template>


<script>
  export default {
    props: ['ctrls'],
  }
</script>