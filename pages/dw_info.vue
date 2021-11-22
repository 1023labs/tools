<template>
  <v-container fluid fill-height class="pa-0">
    
    <v-app-bar
      app
      flat
      height="70px"
    >
      <search-dw :datawindow.sync="selDw" :sys_id="'em'" />
    </v-app-bar>

    <v-main class="grey lighten-3 fill-height px-3 pb-1 pt-20 ">
      <v-row dense class="fill-height">
        <v-col cols="12" >
          <v-card class="pa-4 fill-height">
            <v-tabs
              v-model="tabSrc"
              height="30"
            >
              <v-tab :key="'conotrols'">
                Controls
              </v-tab>
              <v-tab :key="'sql'">
                SQL
              </v-tab>
              <v-tab :key="'group1'">
                Group1
              </v-tab>
              <v-tab :key="'src'">
                Source
              </v-tab>
            </v-tabs>
 
           
            
            <v-tabs-items v-model="tabSrc">
              <v-tab-item :key="'controls'">
                <v-container fluid>
                  <preview-grid v-if="dwType=='grid'" :ctrls="this.ctrls" />
                  <v-row>
                    <v-col col="3">
                      <v-text-field
                        label="PGM_CODE"
                         v-model="pgm_code"
                      ></v-text-field>
                    </v-col>
                    <v-col col="3">
                      <v-text-field label="Grid ID" v-model="dg_id"></v-text-field>
                    </v-col>
                  </v-row>
                  <prism-editor v-if="dwType=='grid'" class="my-editor" v-model="ctrls_upd_sql" :highlight="highlighter" line-numbers></prism-editor>
                  <preview-freeform v-if="dwType=='freeform'" />
                </v-container>

                <v-card flat>
                  <v-card-text>
                    <template
                      v-for="(items, key) in ctrls"
                    >
                      <v-container fluid
                        v-bind:key="key"
                      >
                        <h5>[ {{ key }} ]</h5>
                        <v-simple-table
                          fixed-header
                          dense
                        >
                          <template v-slot:default>
                            <thead>
                              <tr>
                                <th class="text-left">
                                  No
                                </th>
                                <th class="text-left">
                                  Name
                                </th>
                                <th class="text-left" v-if="key=='header'">
                                  Text
                                </th>
                                <th class="text-left">
                                  Visible
                                </th>
                                <th class="text-left">
                                  Position
                                </th>
                                <th class="text-left">
                                  Details
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr 
                                v-for="(el, idx) in items"
                                :key="idx"
                              >
                                <td width="2%">{{ idx + 1 }}</td>
                                <td width="5%" class="text-no-wrap">{{ el.name }}</td>
                                <td width="5%" class="text-no-wrap" v-if="key=='header'">{{ el.text }}</td>
                                <td>
                                  <v-chip
                                    color="green"
                                    label
                                    outlined
                                    x-small
                                  >Visible</v-chip>
                                </td>
                                <td width="10%">
                                  <div>x: {{ el.x }}, y: {{ el.y }}</div>
                                  <div>w: {{ el.width }}, h: {{ el.height }}</div>
                                </td>
                                <td>{{ el }}</td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-container>
                    </template>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              
              <v-tab-item :key="'sql'">
                <v-card flat>
                  <v-card-text>
                    <prism-editor class="my-editor" v-model="sql_code" :highlight="highlighter" line-numbers></prism-editor>

                    <h5>[Arguments]</h5>
                    <v-simple-table
                      fixed-header
                      dense
                    >
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left">
                              Name
                            </th>
                            <!-- th class="text-left">
                              Type
                            </th -->
                            <th class="text-left">
                              Type
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr 
                            v-for="(el, idx) in args"
                            :key="idx"
                          >
                            <td width="5%">{{ el.name }}</td>
                            <!-- td>{{ item.type }}</td -->
                            <td >{{el.type}}</td>
                          </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              
              <v-tab-item :key="'group1'">
                <v-card flat>
                  <v-card-text>
                    <template
                      v-for="(items, key) in group1"
                    >
                      <v-container
                        fluid
                        v-bind:key="key"
                      >
                        <h5>[ {{ key }} ]</h5>
                        <v-simple-table
                          fixed-header
                          dense
                        >
                          <template v-slot:default>
                            <thead>
                              <tr>
                                <th class="text-left">
                                  Type
                                </th>
                                <!-- th class="text-left">
                                  Type
                                </th -->
                                <th class="text-left">
                                  Controls
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr 
                                v-for="(el, idx) in items"
                                :key="idx"
                              >
                                <td>{{el}}</td>
                                <!-- td>{{ item.type }}</td -->
                                <td></td>
                              </tr>
                            </tbody>
                          </template>
                        </v-simple-table>
                      </v-container>
                    </template>
                  </v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item :key="'src'">
                <v-card flat>
                  <v-card-text>
                    <template>
                      <v-simple-table
                        fixed-header
                        dense
                      >
                        <template v-slot:default>
                          <thead>
                            <tr>
                              <th class="text-left">
                                No
                              </th>
                              <th class="text-left">
                                Line
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(item, idx) in details"
                              :key="idx"
                            >
                              <td>{{ idx }}</td>
                              <td>{{ item }}</td>
                            </tr>
                          </tbody>
                        </template>
                      </v-simple-table>
                    </template>
                  </v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs-items>


          </v-card>
        </v-col>
      </v-row>

    
    </v-main>
  </v-container>
</template>

<script>
  import axios from "axios";
  import SearchDw from '~/components/SearchDw.vue';
  import PreviewGrid from '~/components/PreviewGrid.vue';
  import PreviewFreeform from '~/components/PreviewFreeform.vue';
  import common from '~/plugins/common.js';
  
  // import Prism Editor
  import { PrismEditor } from 'vue-prism-editor';
  import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles somewhere

  // import highlighting library (you can use any library you want just return html string)
  import { highlight, languages } from 'prismjs/components/prism-core';
  import 'prismjs/components/prism-clike';
  import 'prismjs/components/prism-javascript';
  import 'prismjs/themes/prism-tomorrow.css'; // import syntax highlighting styles

  export default {
    components: { SearchDw, PreviewGrid, PreviewFreeform, PrismEditor },
    data: () => ({
      selDw: "",
      tabSrc: null,
      dwType: 'grid',
      ctrls: {
        header: [],
        detail: []
      },
      ctrls_upd_sql: '',
      dg_id: 'dg_1',
      pgm_code: 'EM',
      sql_code: '',
      args: [],
      details: [
        {
          name: 'Frozen Yogurt',
          text: 'example',
        }
      ],
      group1: {
      },
    }),
    watch: {
      async selDw (val) {
        // console.log(val)
        const path = val.replace(/\s\>\s/gi, "/");
        // console.log(path)
        const response = await axios.get(`/dw_src/${path}.srd`, { responseType: 'blob' }); 
        const CSV = response.data;

        CSV.text().then((csvStr) => {
          // set Source
          const lineArray = csvStr.split(/\r?\n/)
          this.details = lineArray ;
          // console.log( lineArray )

          // Grouping
          this.group1 = common.parsing_dwtxt(lineArray);

          // Sql  
          if("table" in this.group1) {
            const rSql = common.parsing_sql(this.group1["table"]);
            this.sql_code = rSql.sql_src;
            this.args = rSql.arguments;
          }

          // Controls
          if(("text" in this.group1)||("compute" in this.group1)||("column" in this.group1)) {
            this.ctrls = common.parsing_controls(this.group1);
          }

          // Preview
          this.dwType = common.check_grid_type(this.group1["bands"]);

          // Grid Title Update Sql
          if(this.dwType=='grid') {
            this.ctrls_upd_sql = common.make_upd_sql(this.ctrls, this.pgm_code, this.dg_id);
          } else {
            this.ctrls_upd_sql = '';
          }
        })
      },
      pgm_code (val) {
        this.ctrls_upd_sql = common.make_upd_sql(this.ctrls, val, this.dg_id);
      },
      dg_id (val) {
        this.ctrls_upd_sql = common.make_upd_sql(this.ctrls, this.pgm_code, val);
      }
    },
    methods: {
      highlighter(code) {
        return highlight(code, languages.js); // languages.<insert language> to return html with markup
      },
    }
  }
</script>