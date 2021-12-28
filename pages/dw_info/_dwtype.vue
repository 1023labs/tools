<template>
  <v-container fluid fill-height class="pa-0">
    
    <v-app-bar
      app
      flat
      height="70px"
    > 
      <v-toolbar
        dense
        color="grey lighten-4"
      >
        <v-toolbar-title
          class="mr-15"
        >
          <span 
            class="text-h4 font-weight-black text-capitalize teal--text"
          >
            {{ this.dwType }}
          </span> 
          - DataWindow 분석
        </v-toolbar-title>

        <v-btn
          v-if="this.dwType=='grid'"
          color="light-blue lighten-2"
          small
          dark
          outlined
          to="/dw_info/freeform"
          class="mr-5"
        >
          Freeform 분석으로 가기
          <v-icon class="ml-1">mdi-transfer-right</v-icon>
        </v-btn>

        <v-btn
          v-if="this.dwType=='freeform'"
          color="light-blue lighten-2"
          small
          dark
          outlined
          to="/dw_info/grid"
          class="mr-5"
        >
          Grid 분석으로 가기
          <v-icon class="ml-1">mdi-transfer-right</v-icon>
        </v-btn>

        <v-dialog
          v-model="dialog_help"
          width="700"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="red lighten-2"
              dark
              small
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
      <!-- search-dw :datawindow.sync="selDw" :sys_id="'em'" / -->
    </v-app-bar>

    <v-main class="grey lighten-3 fill-height px-3 pb-1 pt-20 ">
      <v-row dense class="fill-height">
        <v-col cols="12" >
          <v-card class="pa-4 fill-height">
            <v-tabs
              v-model="tabSrc"
              height="30"
            >
              <v-tab :key="0">
                Dw Source
              </v-tab>
              <v-tab :key="1">
                Result
              </v-tab>
              <v-tab :key="2" v-if="dwType=='freeform'">
                Modify Freeform
              </v-tab>
              <v-tab :key="3">
                SQL
              </v-tab>
              <v-tab :key="4">
                Group1
              </v-tab>
              <v-tab :key="5">
                Source (Line)
              </v-tab>
              
            </v-tabs>
            
            <v-tabs-items v-model="tabSrc">
              <v-tab-item :key="0">
                <v-card flat>
                  <v-card-text>
                    <template>
                      <prism-editor class="my-editor" v-model="source_srd" :highlight="highlighter" line-numbers></prism-editor>
                    </template>
                  </v-card-text>
                </v-card>
              </v-tab-item>

              <v-tab-item :key="1">
                <v-container fluid>
                  <preview-grid v-if="dwType=='grid'" :ctrls="this.ctrls" />
                  <v-row v-if="dwType=='grid'" >
                    <v-col cols="1">
                      <v-text-field
                        label="PGM_CODE"
                         v-model="chk_sqls.pgm_code"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="1">
                      <v-text-field label="Grid ID" v-model="chk_sqls.dg_id"></v-text-field>
                    </v-col>
                    <v-col cols="1">
                      <v-text-field label="Add width" v-model="chk_sqls.add_width"></v-text-field>
                    </v-col>
                    <v-col cols="auto">
                      <v-checkbox
                        v-model="chk_sqls.sort"
                        label="Sort"
                        hide-details
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="auto">
                      <v-checkbox
                        v-model="chk_sqls.title"
                        label="Title"
                        hide-details
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="auto">
                      <v-checkbox
                        v-model="chk_sqls.width"
                        label="Width"
                        hide-details
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="auto">
                      <v-checkbox
                        v-model="chk_sqls.show"
                        label="Show"
                        hide-details
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="auto">
                      <v-checkbox
                        v-model="chk_sqls.style"
                        label="Style"
                        hide-details
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="auto">
                      <v-checkbox
                        v-model="chk_sqls.editor"
                        label="Editor"
                        hide-details
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="auto">
                      <v-checkbox
                        v-model="chk_sqls.lookup"
                        label="Lookupdisplay"
                        hide-details
                      ></v-checkbox>
                    </v-col>
                    <v-col cols="auto">
                      <v-checkbox
                        v-model="chk_sqls.compute"
                        label="Computed Field"
                        hide-details
                      ></v-checkbox>
                    </v-col>
                    
                    <!-- width, text, radio 추가 -->
                  </v-row>
                  <prism-editor v-if="dwType=='grid'" class="my-editor style-grid" v-model="ctrls_upd_sql" :highlight="highlighter" line-numbers></prism-editor>
                  
                  <v-row v-if="dwType=='freeform'" >
                    <v-col col="6">
                      <preview-freeform v-if="dwType=='freeform'" :ctrls="this.ctrls" :hshift="this.chk_freeform.header_shift" />
                    </v-col>
                    <v-col col="6">
                      <v-row v-if="dwType=='freeform'" >
                        <v-col cols="2">
                          <v-text-field
                            label="Header Shift"
                            v-model="chk_freeform.header_shift"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="auto">
                          <v-btn
                            class="mt-5 px-1"
                            outlined
                            x-small
                            color="red"
                            @click="chk_freeform.header_shift += 1"
                          >
                            <v-icon>mdi-menu-up</v-icon>
                          </v-btn>
                          <v-btn
                            class="mt-5 px-1"
                            outlined
                            x-small
                            color="primary"
                            @click="chk_freeform.header_shift -= 1"
                          >
                            <v-icon>mdi-menu-down</v-icon>
                          </v-btn>
                        </v-col>
                        <v-col cols="2">
                          <v-text-field
                            label="Label Width"
                            v-model="chk_freeform.label_width"
                          ></v-text-field>
                        </v-col>
                        <!-- v-col cols="auto">
                          <v-checkbox
                            v-model="chk_freeform.btn_find"
                            label="Add Find Btn"
                            hide-details
                          ></v-checkbox>
                        </v-col -->
                        <v-col cols="auto">
                          <v-checkbox
                            v-model="chk_freeform.row_closing"
                            label="Horizontal 100%"
                            hide-details
                          ></v-checkbox>
                        </v-col>
                        <!-- width, text, radio 추가 -->
                      </v-row>
                      <v-container>
                        <prism-editor v-if="dwType=='freeform'" class="my-editor style-freeform" v-model="freeform_html" :highlight="highlighter" line-numbers></prism-editor>
                      </v-container>
                      <v-btn v-if="dwType=='freeform'" color="primary" class="ml-10" @click="modify_freeform()">
                        Modify Freeform
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>

                <v-card flat>
                  <v-card-text>
                    <template
                      v-for="(items, key) in ctrls"
                    >
                      <v-container fluid
                        v-bind:key="key"
                        v-if="(key!='maxx' && key!='maxy')"
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

              <v-tab-item :key="2" v-if="dwType=='freeform'">
                <v-container fluid>
                  <v-row
                    class="fill-height"
                  >
                    <v-col
                      :style="'max-width: calc(100% - '+width_ff+'px)'"
                    >
                      <prism-editor class="my-editor style-freeform-html" v-model="modify_ff" :highlight="highlighter" line-numbers></prism-editor>
                    </v-col>
                    <v-col 
                      :style="'max-width: '+width_ff+'px'"
                    >
                      <v-container>
                        <v-text-field
                          label="FreeForm Width"
                          v-model="width_ff"
                        ></v-text-field>
                      </v-container>
                      <v-card
                        class="px-2"
                        height="100%"
                      >
                        <iframe :srcdoc="previewFreeformHtml" style="border: 0; width: 100%; height: 100%;"></iframe>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-container>
              </v-tab-item>

              <v-tab-item :key="3">
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
              
              <v-tab-item :key="4">
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

              <v-tab-item :key="5">
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

    <div class="text-center">

      <v-snackbar
        :color="`${errCol} lighten-2`"
        v-model="errShow"
        :vertical="true"
        :multi-line="true"
        :timeout="errTimeout"
      >
        {{ errMsg }}

        <template v-slot:action="{ attrs }">
          <v-btn
            v-if="errCol=='green'"
            color="teal darken-2"
            v-bind="attrs"
            @click.prevent="show_result()"
            class="mr-5"
            outlined
          >
            Go Result
          </v-btn>
          <v-btn
            color="grey darken-2"
            v-bind="attrs"
            text
            @click="errShow = false"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
    
  </v-container>
</template>

<script>
  import Vue from "vue";
  import axios from "axios";
  import SearchDw from '~/components/SearchDw.vue';
  import PreviewGrid from '~/components/PreviewGrid.vue';
  import PreviewFreeform from '~/components/PreviewFreeform.vue';
  import FreeForm from '~/components/FreeForm.vue';
  // import SnackBar from '~/components/SnackBar.vue';
  import common from '~/plugins/common.js';
  
  // import Prism Editor
  import { PrismEditor } from 'vue-prism-editor';
  import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles somewhere

  // import highlighting library (you can use any library you want just return html string)
  import { highlight, languages } from 'prismjs/components/prism-core';
  import 'prismjs/components/prism-clike';
  import 'prismjs/components/prism-javascript';
  import 'prismjs/themes/prism-tomorrow.css'; // import syntax highlighting styles
  const jsBeautify = require('js-beautify').html;

  export default {
    props: ['dw_type'],
    components: { SearchDw, PreviewGrid, PreviewFreeform, PrismEditor }, // , SnackBar
    asyncData({params}) { 
      return { 
        dwType: params.dwtype ?? "grid", 
      }; 
    },
    data: (params) => ({
      selDw: "",
      tabSrc: 'src',
      // dwType: params.dwtype,
      dwInfo: {},
      ctrls: {
        header: [],
        detail: [],
        background: [],
        foreground: [],
        maxx: 0,
        maxy: 0,
      },
      ctrls_ini: {},
      ctrls_upd_sql: '',
      sql_code: '',
      source_srd: '',
      chk_sqls: {
        dg_id: 'dg_1',
        pgm_code: 'EM',
        add_width: 20,
        sort: true,
        width: true,
        title: true,
        show: true,
        style: true,
        editor: true,
        lookup: true,
        compute: false,
      },
      chk_freeform: {
        header_shift: 0,
        label_width: 100,
        row_closing: false,
        // btn_find: true,
      },
      freeform_html: `<div id='freeform' class='detail_box ver2'>
  <div class='detail_row'>
  </div>
</div>`,
      args: [],
      dbcols: {},
      details: [
        {
          name: 'Frozen Yogurt',
          text: 'example',
        }
      ],
      group1: {
      },
      modify_ff: "<h1>test</h1>",
      width_ff: 500,
      errCol: "orange",
      errMsg: "",
      errShow: false,
      errMulti: true,
      errTimeout: 10000,
      dialog_help: false,
    }),
    watch: {
      async selDw (val) {
        // console.log(val)
        const path = val.replace(/\s\>\s/gi, "/");
        // console.log(path)
        const response = await axios.get(`/dw_src/${path}.srd`, { responseType: 'blob' }); 
        const CSV = response.data;

        CSV.text().then((csvStr) => {
          this.analysis_datawindow(csvStr);
        })
      },
      tabSrc (val) {
        if(val==1) window.scrollTo(0,0);
      },
      chk_sqls: {
        deep: true,

        handler (val) {
          this.ctrls_upd_sql = common.make_upd_sql(this.ctrls, val, this.dbcols);
        }
      },
      chk_freeform: {
        deep: true,

        handler (val) {
          this.draw_freeform(val);
        }
      },
      source_srd (val) {
        this.analysis_datawindow(val);
      }
    },
    computed: {
      // computed getter
      previewFreeformHtml() {
        // 여기서의 `this` 는 vm 인스턴스이다.
        return `<html>
  <head>
    <link rel="stylesheet" href="/mighty/css/mighty-2.0.3.css">
  </head>  
  <body>
    ${this.modify_ff}
  </body>
</html>`;
      }
    },
    methods: {
      highlighter(code) {
        return highlight(code, languages.js); // languages.<insert language> to return html with markup
      },
      show_result(){
          // this.$refs.result.click()
          this.tabSrc=1;
          this.errShow=false;
      },
      analysis_datawindow(srcTxt) {
        const is_dev = false; // true; //
        let is_err = false;
        // console.log('analysis datawindow')
        try{
          // set Source
          const lineArray = common.parsing_line( srcTxt ) 
          this.details = lineArray ;
          if(is_dev) console.log('split line', lineArray )

          // Grouping
          this.group1 = common.parsing_dwtxt(lineArray);

          // Sql  
          if("table" in this.group1) {
            const rSql = common.parsing_sql(this.group1["table"]);
            this.sql_code = rSql.sql_src;
            this.args = rSql.arguments;
            this.dbcols = rSql.columns;
          }
          if(is_dev) console.log('grouping', this.group1)

          // Datawindow
          if("datawindow" in this.group1) {
            this.dwInfo = common.parsing_dw_info(this.group1);
            if(is_dev) console.log('parsing_datawindow', this.dwInfo.units, this.dwInfo)
          }

          // Controls
          if(("text" in this.group1)||("compute" in this.group1)||("column" in this.group1)) {
            this.ctrls_ini = common.parsing_controls(this.group1, this.dwInfo.units);
            this.ctrls = this.ctrls_ini;
            if(is_dev) console.log('parsing_controls', this.ctrls)
          }
        } catch(err1) {
          console.log(`${err1}`);
          is_err = true;
          this.show_error(err1, "orange");
        }        

        try {
          // Preview
          // this.dwType = "grid"; // common.check_grid_type(this.group1["bands"]);

          // Grid Title Update Sql
          if(this.dwType=='grid') {
            this.ctrls_upd_sql = common.make_upd_sql(this.ctrls, this.chk_sqls, this.dbcols);
          } else {
            this.draw_freeform(this.chk_freeform);
          }
        } catch(err2) {
          console.log(`${err2}`);
          is_err = true;
          this.show_error(err2, "orange");
        }

        if(!is_err) this.show_error("finished", "green");
      },
      draw_freeform(cff) {
        // make - controls object 
        const fRows = common.make_freeform(this.ctrls, cff, this.dbcols);

        // console.log(fRows);
        // console.log('draw_freeform 1')
        const fObj = {
          row_closing: cff.row_closing,
          label_width: cff.label_width,
          btn_find: cff.btn_find,
          rows: fRows,
        }
        // console.log('draw_freeform 2')
        const ffHtml = new Vue({
          ...FreeForm,
          parent: this,
          propsData: { fInfo: fObj }
        }).$mount();
        // console.log('draw_freeform 3')
        const options = {
          "indent_size": 2,
          "extra_liners": ["input", "label", "div", "button", "select"],
        };
        // console.log('draw_freeform 4')
        const styledHtml = jsBeautify(ffHtml.$el.outerHTML, options);
        // console.log('draw_freeform 5')
        this.freeform_html = styledHtml.replace(/\<\!\-\-\-\-\>/g, '').replace(/\n\s*\n/g, '\n');
      },
      modify_freeform() {
        this.modify_ff = this.freeform_html;
        this.tabSrc  = 2;
      },
      show_error(eMsg, eCol) {
        this.errShow = true;
        this.errMsg = eMsg;
        this.errCol = eCol;
        if(eCol!="green") {
          this.errTimeout = 6000;
        }
      }
    }
  }
</script>