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
      <v-icon>mdi-help-box</v-icon>
    </v-btn -->
    <v-dialog
      v-model="dialog_help"
      width="700"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="red lighten-2"
          dark
          outlined
          v-bind="attrs"
          v-on="on"
        >
          도움말
          <v-icon class="ml-1">mdi-help-box</v-icon>
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          도움말
        </v-card-title>

        <v-card-text>
          <div
            class="text-h6 mt-5"
          >
            가. [Datawindow Name 검색]
          </div>
          <v-text>
            1) DataWindow Name 에서 데이터윈도우 이름으로 검색 
            <br />
            ex) dl_cm_esti_master 
            <br />
            2) 검색된 목록을 선택후, "PREVIEW"탭에서 결과 확인
          </v-text>
          <div
            class="text-h6 mt-5"
          >
            나. [Datawindow Source 입력]
          </div>
          <v-text>
            1) "FROM SOURCE" 탭에 export 된 Datawindow 소스를 입력
            <br />
            2) "PREVIEW" 탭에서 결과 확인
          </v-text>

          <v-divider class="my-5"></v-divider>

          <div
            class="text-h6 mt-5"
          >
            [탭 설명]
          </div>
          <v-text>
            <span class="font-weight-black">PREVIEW :</span>
            (결과) 데이터윈도우 소스 결과 표시
            <br />
            <span class="font-weight-black">FROM SOURCE :</span>
            (입력) 데이터윈도우 export 소스를 입력해서 분석 (Datawindow가 검색되지 않을때)
            <br />
            <span class="font-weight-black">SQL :</span>
            (결과) 데이터윈도우 소스를 분석해서 SQL 표시. "PREVIEW"의 분석결과가 이상할때 확인용
            <br />
            <span class="font-weight-black">GROUP1 :</span>
            (결과) 데이터윈도우 Controls 를 type 별로 Grouping. "PREVIEW"의 분석결과가 이상할때 확인용
            <br />
            <span class="font-weight-black">SOURCE(Line) :</span>
            (결과) 데이터윈도우 소스를 라인별로 표시. "PREVIEW"의 분석결과가 이상할때 확인용
          </v-text>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="dialog_help = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-toolbar>
</template>


<script>
  import axios from "axios";

  export default {
    props: ['datawindow', 'sys_id'],
    data () {
      return {
        dialog_help: false,
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