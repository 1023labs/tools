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

exports.parsing_line = (dwTxt) => {
  // 우선 엔터로 나눔 
  let pLine = dwTxt.split(/\r?\n/);
  const lineArr = [];

  // 루프 돌면서, 나눠진 문장 붙이기 
  // lineMode: meta sql controls footer 
  let lineMode = 'meta';
  let preLine = '';
  const re = /(text|compute|column|line|bitmap|rectangle)\((.*)\)/i;
  pLine.forEach((el, idx) => {
    // console.log()
    if(el.indexOf('table')===0) {
      lineMode = 'sql';
    }

    if(lineMode=='sql') {
      lineArr.push(el)
    } else if(lineMode=='controls') {
      const found = el.match(re);
      if(found&&found.length>0) {
        if(preLine!='') lineArr.push(preLine);
        preLine = `${el}`;
      } else {
        preLine = `${preLine} ${el}`;
      }
    } else {
      lineArr.push(el)
    }
    
    if(lineMode=='sql' && el.indexOf('arguments=')>=0) {
      lineMode = 'controls';
    } 
  })  

  // srcTxt.split(/\r?\n/)
  return lineArr;
}

// step1 - line text => Grouping 
exports.parsing_dwtxt = (arrDw) => {
  let ctrls = {
    // datawindow: [], header: [], summary: [], footer: [], detail: [], table: [], text: [], compute: [], column: [], etc: [], line: []
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
      ctrls = add_controls(ctrls, "line", "line", el);
      // ctrls = add_controls(ctrls, "bands", "background", el);
      // ctrls = add_controls(ctrls, "bands", "foreround", el);
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
  let cols = {};
  let sql_mode = false;

  arrTb.forEach((el, idx) => {
    if(el.indexOf('retrieve="')>=0) {
      sql_mode = true;
    }

    if(sql_mode) {
      sql_txt.push( el.replace('retrieve="', '') );
    } else {
      if(el.indexOf('column=')>=0) {
        const cText = el.replace('table(column=(', '')
                        .replace('column=(', '')
                        .replace(/\)$/, '') 
        const cProps = parsing_cols(cText)
        // console.log(cProps)
        cols[cProps.name] = cProps;
      }
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
  if(args1&&args1.length>0) {
    args1.forEach((el, idx) => {
      const str_arg = el.replace(/[\(|\|\"|\s)]/g, '');
      const arr_arg = str_arg.split(',');
      const arg = {name: arr_arg[0], type: arr_arg[1]}
      args.push(arg)
    })
  }
  

  // console.log(args);
  // const args
  
  return { sql_src, arguments: args, columns: cols }
}

// step3 - Grouping => Controls
exports.parsing_controls = (arrGrp) => {
  // console.log('parsing_controls')
  let controls = {
    header: [],
    detail: [],
    background: [],
    foreground: [],
    etc: [],
    maxx: 0,
    maxy: 0,
  }

  if("text" in arrGrp) {
    arrGrp["text"].forEach((ag, idx) => {
      const aT = parsing_props(ag);
      if((aT.band in controls)) {
        controls[aT.band].push(aT)
      } else {
        controls['etc'].push(aT)
      }

      if((parseInt(aT.x) + parseInt(aT.width))>controls.maxx) controls.maxx = (parseInt(aT.x) + parseInt(aT.width));
      if((parseInt(aT.y) + parseInt(aT.height))>controls.maxy) controls.maxy = (parseInt(aT.y) + parseInt(aT.height));
    })
  }
  // console.log('text finished')

  // text(band=header alignment="2" text="작성자" border="0" color="33554432" x="31" y="2" height="14" width="81" html.valueishtml="0" name=user_id_t visible="1" font.face="굴림" font.height="-9" font.weight="400" font.family="1" font.pitch="2" font.charset="129" background.mode="1" background.color="553648127" )
  if("compute" in arrGrp) {
    arrGrp["compute"].forEach((ag, idx) => {
      const aCom = parsing_props(ag)
      if((aCom.band in controls)) {
        controls[aCom.band].push(aCom)
      } else {
        controls['etc'].push(aCom)
      }
      
      if((parseInt(aCom.x) + parseInt(aCom.width))>controls.maxx) controls.maxx = (parseInt(aCom.x) + parseInt(aCom.width));
      if((parseInt(aCom.y) + parseInt(aCom.height))>controls.maxy) controls.maxy = (parseInt(aCom.y) + parseInt(aCom.height));
    })
  }
  // console.log('compute finished')

  // column(band=detail id=2 alignment="0" tabsequence=32766 border="0" color="33554432" x="31" y="2" height="14" width="81" format="[general]" html.valueishtml="0" name=user_id visible="1" edit.limit=0 edit.case=any edit.focusrectangle=no edit.autoselect=no edit.imemode=0 font.face="굴림" font.height="-9" font.weight="400" font.family="2" font.pitch="2" font.charset="129" background.mode="1" background.color="553648127" )
  if("column" in arrGrp) {
    arrGrp["column"].forEach((ag, idx) => {
      const aCol = parsing_props(ag)
      if((aCol.band in controls)) {
        controls[aCol.band].push(aCol)
      } else {
        controls['etc'].push(aCol)
      }
      
      if((parseInt(aCol.x) + parseInt(aCol.width))>controls.maxx) controls.maxx = (parseInt(aCol.x) + parseInt(aCol.width));
      if((parseInt(aCol.y) + parseInt(aCol.height))>controls.maxy) controls.maxy = (parseInt(aCol.y) + parseInt(aCol.height));
    })
  }
  // console.log('column finished')

  // 정렬은 그리기 전에 다시 
  // controls.header.sort(function(a,b) {
  //   return parseFloat(a.x) - parseFloat(b.x);
  // });
  // controls.detail.sort(function(a,b) {
  //   return parseFloat(a.x) - parseFloat(b.x);
  // });
  // controls.background.sort(function(a,b) {
  //   return parseFloat(a.x) - parseFloat(b.x);
  // });
  // controls.foreground.sort(function(a,b) {
  //   return parseFloat(a.x) - parseFloat(b.x);
  // });

  return controls;
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
      if(aCol.height > 40) {
        dw_type = 'freeform';
        // console.log( dw_type )
      }
    }
  })

  return dw_type;
}

// step5 - Make Grid Header Text Update Sql pcode, dgid, 
exports.make_upd_sql = (arrCtrl, csql, cols) => {
  // "UPDATE SM_DEV_GRID_COLS SET HEADER_TEXT = '', VISIBLE = 'Y' WHERE PGM_CODE = 'EM01010' AND GRID_ID = 'db_1' AND FIELDNAME = 'PHONE_NO'; ";
  // csql.text , csql.width , csql.show
  let arrHd = arrCtrl.header;
  arrHd.sort(function(a,b) {
    return parseFloat(a.x) - parseFloat(b.x);
  });
  
  let sqls = [];
  const iSqls = [];
  if(csql.sort) iSqls.push(`FIELD_SEQ = FIELD_SEQ + 9000`)
  if(csql.show) iSqls.push(`VISIBLE = 'N'`)

  if(iSqls.length>0) sqls.push(`UPDATE SM_DEV_GRID_COLS SET ${iSqls.join(', ')} WHERE PGM_CODE = '${csql.pgm_code}' AND GRID_ID = '${csql.dg_id}' ; `);

  arrHd.forEach((el, idx) => {
    let matchCol = arrCtrl.detail.filter(col => Math.abs(col.x - el.x) <= 3 );
    if(matchCol.length>0) {
      let tWidth = 100;
      try {
        tWidth = Math.floor((parseInt(el.width) + parseInt(csql.add_width)) / 10) * 10 ;
      } catch(err) {
        console.log(`error width calc ${matchCol[0].name.toUpperCase()}`)
      }
      // MUST_INPUT, READONLY, EDITOBLE, STYLES, EDITOR, UPDATABLE ('Y')
      // console.log(csql);
      let colInfo = {};
      if(cols && (matchCol[0].name in cols)) {
        colInfo = cols[matchCol[0].name];
      } 

      const uSql = [];
      if(csql.compute || matchCol[0].ctrl_type!="compute") {
        let tAlign = '';

        if(matchCol[0].alignment=='2') tAlign = 'c';

        if(csql.sort) uSql.push(`FIELD_SEQ = ${(idx + 1) * 10}`);
        if(csql.title) uSql.push(`HEADER_TEXT = '${el.text}'`);
        if(csql.width) uSql.push(`WIDTH = '${tWidth}'`);
        if(csql.show) uSql.push(`VISIBLE = 'Y'`);
        if(csql.style) {
          if(('type' in colInfo) && (colInfo.type.indexOf('decimal')>=0 || colInfo.type.indexOf('number')>=0||colInfo.type.indexOf('integer')>=0||colInfo.type.indexOf('float')>=0)) {
            uSql.push(`STYLE = '_Styles_number${tAlign}'`);
          } else if(matchCol[0].name.indexOf('_date')>=0) {
            uSql.push(`STYLE = '_Styles_date'`);
          } else {
            uSql.push(`STYLE = '_Styles_text${tAlign}'`);
          }
        }
        if(csql.editor) {
          if(('dddw.name' in matchCol[0])) {
            uSql.push(`EDITOR = '_Editor_dropdown'`);
          } else if(('checkbox.text' in matchCol[0])) {
            uSql.push(`EDITOR = '_Editor_checkbox'`);
          } else if(matchCol[0].name.indexOf('_date')>=0) {
            uSql.push(`EDITOR = '_Editor_date'`);
          } else {
            uSql.push(`EDITOR = '_Editor_text'`);
          }
        }
      } else {
        if(csql.compute) {
          if(csql.sort) uSql.push(`FIELD_SEQ = ${(idx + 1) * 10}`);
        }
      }

      if(uSql.length > 0) sqls.push(`UPDATE SM_DEV_GRID_COLS SET  ${uSql.join(', ') ?? ''}   WHERE PGM_CODE = '${csql.pgm_code}' AND GRID_ID = '${csql.dg_id}' AND FIELDNAME = '${matchCol[0].name.toUpperCase()}'; `);
    }
  });
  // console.log(sqls)
  return sqls.join('\n');
}

// step5 - Make Grid Header Text Update Sql
exports.make_freeform = (arrCtrl, cff, cols) => {
  let aCols = arrCtrl.detail;
  aCols.sort(function(a,b) {
    return parseFloat(a.y) - parseFloat(b.y);
  });

  // console.log(aCols)

  let tRows = [];
  let cRow = [];
  let preY = 0;
  let preYto = 0;

  // column 먼저 Row 구분해서 넣고, 
  // Row 변경될 때, 해당 Row 에 맞는 label 추가 
  aCols.forEach((el, i) => {
    const shiftY = parseInt(el.y); //  + cff.header_shift;  parsing 단계에서 추가 
    // new Row
    // if(preY===0||(preY+20<parseInt(el.y))) { // 기존 로직은 칼럼을 20으로 봐서 문제 
    if(preY===0||(preY+20<shiftY)) {
      if(cRow.length>0) {
        // row 칼럼 정렬 & 헤더 넣기 
        tRows.push(proc_ff_row(cRow, arrCtrl, cff.header_shift));
      }
      // new Row
      cRow = [];
    }

    // ( "checkbox.text" in el) ? "checkbox" { 
    const cTag = (("dddw.name" in el)||("ddlb.case" in el)) ? "select" : ( ("checkbox.text" in el) ? "checkbox" : "input" ) ;

    const cInfo = {
      left: el.x,
      top: shiftY,
      type: "column",
      tags: cTag,
      width: "100",
      colname: el.name.toUpperCase(),
      coltype: "text"
    };
    cRow.push(cInfo);

    preY = parseInt(el.y);
  })

  tRows.push(proc_ff_row(cRow, arrCtrl, cff.header_shift));
  
  return tRows;
}

const proc_ff_row = (rRow, rCtrls, rShift) => {
  const bgShift = parseInt(rShift); // background 와 detail y 값 보정  powerbuilder 9 : 15
  let newRow;

  if (rRow.length>0) {
    const minY = rRow[0].top - 2;
    const maxY = minY + 22;
    let matchLabels = [];

    rCtrls.background.forEach((col, idx) => {
      const tY = parseInt(col.y) + bgShift;
      if((col.ctrl_type=='text') && (minY<=tY&&tY<=maxY)) {
        matchLabels.push({
          left: col.x,
          top: tY,
          type: "label",
          text: col.text,
          required: false,
        })
      }
    });

    newRow = [
      ...rRow,
      ...matchLabels,
    ];
    // console.log( matchLabels )
    newRow.sort(function(a,b) {
      return parseFloat(a.left) - parseFloat(b.left);
    });
  }

  
  
  return newRow;
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
  // console.log('category', category, str);
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

const parsing_cols = (colsStr) => {
  // console.log('test');
  // type=char(3) update=yes updatewhereclause=yes name=company_code dbname="cm_esti_master.company_code" 
  const str = ` ${colsStr} `;
  
  const re4 = /(?<=\s)([.|\w|\d|_]+)\=([.,=-\w\d\'\[\]\(\)\n\r가-힣]+)(?=\s)|(?<=\s)([.|\w|\d|_]+)\=\"([.,=-\w\d\'\[\]\(\)\s\n\r가-힣]+)\"(?=\s)/g; // /(^\=)\"(\w+)/gi;
  const found4 = str.match(re4);
  
  let pp = {};
  found4.forEach((el, idx) => {
    const epos = el.indexOf("=");
    const key = el.substring(0, epos);
    const val = el.substr(epos + 1, 999999);
    
    pp[`${key}`] = `${val.replace(/^\"|\"$/g, '')}`;
  })
  // console.log(pp)
  // // console.log(category, found[2]);
  // // console.log(category, found2);
  // // console.log(category, found3);
  // // console.log(category, found4);
  
  return pp;
}
