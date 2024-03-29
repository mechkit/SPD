f.mk_sheet_num['G-001'] = function(settings){
  var state = settings.state;

  var d = Drawing(settings);

  var size = settings.drawing_settings.size;
  var loc = settings.drawing_settings.loc;

  var x, y, h, w;
  d.layer('text');

  var x = size.sheet.w*1/2;
  var y = 50;

  d.text(
    [x,y],
    [
      'PV System Design',
    ],
    null,
    'project title'
  );

  y += 30;
  d.text(
    [x,y],
    [
      'Created on: ' + moment().format('YYYY-MM-DD'),
      'Based on ' + settings.info.building_code,
    ],
    'text',
    'title2'
  );

  x = size.sheet.w*1/4;
  y = 160;
  //console.log( '|_ location', state.status.active_system, section_defined(state.status.active_system, 'location') );
  if( section_defined(state.status.active_system, 'location')  ){
    d.text(
      [x,y],
      [
        state.system.contractor.contractor_name + ' (licence #:' + state.system.contractor.contractor_license + ')',
      ],
      null,
      'title2'
    );

    x -= 100;
    y += 30;
    d.text(
      [x,y],
      [
        'Site address:',
        state.system.location.address,
        state.system.location.city + ', ' + state.system.location.county + ', FL, ' + state.system.location.zip_code,
      ],
      null,
      'notes'
    );

    y += 60;
    d.text(
      [x,y],
      [
        'System:',
        parseFloat(state.system.array.pmp).toFixed(0) + ' Pmp DC',
        state.system.inverter.inverter_make + ' ' + state.system.inverter.inverter_model,
        state.system.array.module_make + ' ' + state.system.array.module_model,
      ],
      null,
      'notes'
    );

  }





  //////
  // table of contents
  x = size.sheet.frame_padding*6;
  y = size.sheet.h - size.sheet.frame_padding - size.sheet.titlebox.bottom.h;

  var n_rows = settings.drawing_settings.sheets.length;
  var n_cols = 2;
  var col_widths = [80,350];
  w = 0;
  col_widths.forEach(function(x){w+=x});
  h = n_rows*20;

  y += -20 * n_rows;
  y += -40; // the last number is the gap to the title box

  d.text( [x+w/2, y-20], 'Contents', null, 'table_large' );

  var t = d.table(n_rows,n_cols).loc(x,y);
  t.row_size('all', 20).col_size(1, col_widths[1-1]).col_size(2, col_widths[2-1]);

  settings.drawing_settings.sheets.forEach(function(sheet,i){
    t.cell(i+1,1).text(sheet.num);
    t.cell(i+1,2).text(sheet.desc);

  });

  t.all_cells().forEach(function(cell){
    cell.font('table_large_left').border('all');
  });

  t.mk();

  ////////


  // general notes
  d.section("general notes");

  x = loc.system_spec_box.x;
  y = loc.system_spec_box.y;
  w = size.system_spec_box.w;
  h = size.system_spec_box.h;

  d.layer('table');
  d.rect( [x,y], [w,h] );

  y -= h/2;
  y += 10;

  d.text( [x,y], 'System description', 'text', 'table');

  if( section_defined(state.status.active_system, 'inverter') && section_defined(state.status.active_system, 'array') ){
    y += 20;
    d.text(
      [x,y],
      [
        "System size: " + Math.round(state.system.array.pmp/1000, 1) + "kW",
        state.system.inverter.inverter_make + ", " + state.system.inverter.inverter_model,
        state.system.array.module_make + ", " + state.system.array.module_model,
      ],
      'text',
      'table'
    );
  }

  d.section();



  ///////////
  // Site layout
  if( section_defined(state.status.active_system, 'location') && section_defined(state.status.active_system, 'roof') ){

    x = settings.drawing_settings.size.sheet.w * 3/4 - 50;
    y = settings.drawing_settings.size.sheet.h * 1/2 - 50;

    var rotations = {
      'S' :0,
      'SW':45,
      'W' :90,
      'NW':135,
      'N' :180,
      'NE':-135,
      'E' :-90,
      'SE':-45,
    };

    var road_offset = 100;
    var road_location = {
      'S' :{x:x,                  y:y+road_offset},
      'SW':{x:x-road_offset*0.7,  y:y+road_offset*0.7},
      'W' :{x:x-road_offset,      y:y},
      'NW':{x:x-road_offset*0.7,  y:y-road_offset*0.7},
      'N' :{x:x,                  y:y-road_offset},
      'NE':{x:x+road_offset*0.7,  y:y-road_offset*0.7},
      'E' :{x:x+road_offset,      y:y},
      'SE':{x:x+road_offset*0.7,  y:y+road_offset*0.7},
    };

    d.block('simple_house', {x:x, y:y} )
      .rotate(rotations[state.system.roof.side_of_building]);

    d.block('road', road_location[state.system.location.direction_to_road] )
      .rotate(rotations[state.system.location.direction_to_road]);

    d.block( 'north arrow_up', {x:x+250, y:y} );

  }





  return d;
};
