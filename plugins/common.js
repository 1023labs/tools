exports.test = () => {
  console.log('test');
  const str = `datawindow(units=1 chk=""timer_interval=0 chk2="string"color=1073741824 processing=1 HTMLDW=no print.printername="" print.documentname="" print.orientation = 0 print.margin.left = 24 print.margin.right = 24 print.margin.top = 24 print.margin.bottom = 24 print.paper.source = 0 print.paper.size = 0 print.canusedefaultprinter=yes print.prompt=no print.buttons=no print.preview.buttons=no print.cliptext=no print.overrideprintjob=no print.collate=yes hidegrayline=no grid.lines=0 grid.columnmove=no selected.mouse=no )`
  
  const re = /datawindow\((.*?)\)/i;
  const found = str.match(re);


  const re2 = /\s\=\s/g;
  const found2 = found[1].replace(re2, "=");

  const re3 = /([^\=])\"([^\s])/g; // /(^\=)\"(\w+)/gi;
  const found3 = found2.replace(re3, '$1" $2');

  
  console.log(1, found);
  console.log(2, found2);
  console.log(3, found3);
}

// step1 - line text => Grouping 
exports.parsing_dwtxt = (arrDw) => {
  let ctrls = {
    // datawindow: [], header: [], summary: [], footer: [], detail: [], table: [], text: [], compute: [], column: [], etc: [],
  }
  
  let is_table = false;
  arrDw.forEach((el, idx) => {
    // console.log()
    if(el.indexOf('table')===0) {
      is_table = true;
    }

    if(is_table) {
      ctrls = add_controls(ctrls, "table", "", el);
    } else {
      ctrls = add_controls(ctrls, "datawindow", "datawindow", el);
      ctrls = add_controls(ctrls, "bands", "header", el);
      ctrls = add_controls(ctrls, "bands", "summary", el);
      ctrls = add_controls(ctrls, "bands", "footer", el);
      ctrls = add_controls(ctrls, "bands", "detail", el);
      ctrls = add_controls(ctrls, "text", "text", el);
      ctrls = add_controls(ctrls, "compute", "compute", el);
      ctrls = add_controls(ctrls, "column", "column", el);
    }
    
    if(el.indexOf('arguments=')>=0) {
      is_table = false;
    }  
  });
  
  return ctrls;
}

// step2 - table line array => Sql text
exports.parsing_sql = (arrTb) => {
  let sql_txt = [];
  let sql_mode = false;

  arrTb.forEach((el, idx) => {
    if(el.indexOf('retrieve="')>=0) {
      sql_mode = true;
    }

    if(sql_mode) {
      sql_txt.push( el.replace('retrieve="', '') );
    }

    if(el.indexOf('arguments=(')>=0) {
      sql_mode = false;
    }
  })

  let sql_src = sql_txt.join('\n');
  const lastpos = sql_src.indexOf('"', 15);
  // console.log(lastpos);
  const remain_str = sql_src.substr(lastpos + 1, 99999);
  sql_src = sql_src.substring(0, lastpos);
  // console.log("remain_str", remain_str)
  const args_str = remain_str.substr(remain_str.indexOf(" arguments=") + 1, 99999)
  
  // console.log(args_str)
  // update="EM_IWITEM_TEMP" updatewhere=0 updatekeyinplace=no arguments=(("AS_PGM_CODE", string)) )
  const re = /\(\"(\w+)\",\s(\w+)\)/g; // /(^\=)\"(\w+)/gi;
  const args1 = args_str.match(re);
  let args = [];
  // console.log('end' + args1)
  args1.forEach((el, idx) => {
    const str_arg = el.replace(/[\(|\|\"|\s)]/g, '');
    const arr_arg = str_arg.split(',');
    const arg = {name: arr_arg[0], type: arr_arg[1]}
    args.push(arg)
  })

  // console.log(args);
  // const args
  
  return { sql_src, arguments: args }
}

// step3 - Grouping => Controls
exports.parsing_controls = (arrGrp) => {
  let hds = [];
  let dtls = [];

  if("text" in arrGrp) {
    arrGrp["text"].forEach((ag, idx) => {
      const aT = parsing_props(ag);
      if(aT.band=='header') {
        hds.push(aT);
      } else if(aT.band=='detail') {
        dtls.push(aT);
      }
    })
  }

  // text(band=header alignment="2" text="작성자" border="0" color="33554432" x="31" y="2" height="14" width="81" html.valueishtml="0" name=user_id_t visible="1" font.face="굴림" font.height="-9" font.weight="400" font.family="1" font.pitch="2" font.charset="129" background.mode="1" background.color="553648127" )
  if("compute" in arrGrp) {
    arrGrp["compute"].forEach((ag, idx) => {
      const aCom = parsing_props(ag)
      if(aCom.band=='header') {
        hds.push(aCom);
      } else if(aCom.band=='detail') {
        dtls.push(aCom);
      }
    })
  }

  // column(band=detail id=2 alignment="0" tabsequence=32766 border="0" color="33554432" x="31" y="2" height="14" width="81" format="[general]" html.valueishtml="0" name=user_id visible="1" edit.limit=0 edit.case=any edit.focusrectangle=no edit.autoselect=no edit.imemode=0 font.face="굴림" font.height="-9" font.weight="400" font.family="2" font.pitch="2" font.charset="129" background.mode="1" background.color="553648127" )
  if("column" in arrGrp) {
    arrGrp["column"].forEach((ag, idx) => {
      const aCol = parsing_props(ag)
      if(aCol.band=='header') {
        hds.push(aCol);
      } else if(aCol.band=='detail') {
        dtls.push(aCol);
      }
    })
  }

  hds.sort(function(a,b) {
    return parseFloat(a.x) - parseFloat(b.x);
  });
  dtls.sort(function(a,b) {
    return parseFloat(a.x) - parseFloat(b.x);
  });

  let ctrls = {
    header: hds,
    detail: dtls,
  }

  return ctrls;
}

// step4 - Check Grid Type
// header, detail 이 둘다 30보다 작으면 Grid 
exports.check_grid_type = (arrGrp) => {
  let dw_type = 'grid';
  arrGrp.forEach((el, idx) => {
    const aCol = parsing_props(el);
    // console.log(aCol)
    if(aCol.ctrl_type=='header'||aCol.ctrl_type=='detail') {
      // console.log(aCol.height, aCol.height > 30)
      if(aCol.height > 30) {
        dw_type = 'freeform';
        // console.log( dw_type )
      }
    }
  })

  return dw_type;
}

// step5 - Make Grid Header Text Update Sql
exports.make_upd_sql = (arrCtrl, pcode, dgid) => {
  // "UPDATE SM_DEV_GRID_COLS SET HEADER_TEXT = '', VISIBLE = 'Y' WHERE PGM_CODE = 'EM01010' AND GRID_ID = 'db_1' AND FIELDNAME = 'PHONE_NO'; ";
  let sqls = [];
  arrCtrl.header.forEach((el, idx) => {
    let matchCol = arrCtrl.detail.filter(col => Math.abs(col.x - el.x) <= 3 );
    if(matchCol.length>0) {
      sqls.push(`UPDATE SM_DEV_GRID_COLS SET HEADER_TEXT = '${el.text}', VISIBLE = 'Y' WHERE PGM_CODE = '${pcode}' AND GRID_ID = '${dgid}' AND FIELDNAME = '${matchCol[0].name}'; `);
    }
  });
  // console.log(sqls)
  return sqls.join('\n');
}

const add_controls = (robj, rkey, needle, rel) => {
  if(rel.indexOf(needle)===0||needle=="") {
    if(!(rkey in robj)) {
      robj[rkey] = []  
    }
    robj[rkey].push(rel)
  }

  return robj;
}

const parsing_props = (propStr) => {
  // console.log('test');
  // const str = `datawindow(units=1 chk=""timer_interval=0 chk2="string"color=1073741824 processing=1 HTMLDW=no print.printername="" print.documentname="" print.orientation = 0 print.margin.left = 24 print.margin.right = 24 print.margin.top = 24 print.margin.bottom = 24 print.paper.source = 0 print.paper.size = 0 print.canusedefaultprinter=yes print.prompt=no print.buttons=no print.preview.buttons=no print.cliptext=no print.overrideprintjob=no print.collate=yes hidegrayline=no grid.lines=0 grid.columnmove=no selected.mouse=no )`
  const str = propStr;
  
  // const re = /(datawindow|text|compute|column)\((.*?)\)/i;
  const re = /(datawindow|text|compute|column|line|header|summary|footer|detail)\((.*)\)/i;
  const found = str.match(re);
  
  const category = found[1];

  const re2 = /\s\=\s/g;
  const found2 = found[2].replace(re2, "=");

  const re3 = /([^\=])\"([^\s])/g; // /(^\=)\"(\w+)/gi;
  const found3 = ` ${found2.replace(re3, '$1" $2')} `;

  // const re4 = /(?<=\s)([.|\w|\d|_]+)\=(\"([.\w\d'()\s\n\r]+)\"|([.|\w|\d|']+))(?=\s)/g; // /(^\=)\"(\w+)/gi;
  const re4 = /(?<=\s)([.|\w|\d|_]+)\=([.,=-\w\d\'\[\]\(\)\n\r가-힣]+)(?=\s)|(?<=\s)([.|\w|\d|_]+)\=\"([.,=-\w\d\'\[\]\(\)\s\n\r가-힣]+)\"(?=\s)/g; // /(^\=)\"(\w+)/gi;
  const found4 = found3.match(re4);
  
  let pp = {ctrl_type: category};
  found4.forEach((el, idx) => {
    const epos = el.indexOf("=");
    const key = el.substring(0, epos);
    const val = el.substr(epos + 1, 999999);
    
    pp[`${key}`] = `${val.replace(/^\"|\"$/g, '')}`;
  })

  // console.log(category, found[2]);
  // console.log(category, found2);
  // console.log(category, found3);
  // console.log(category, found4);
  
  return pp;
}
