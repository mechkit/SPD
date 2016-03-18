f.mk_sheet_num['W-003'] = function(settings){
  var state = settings.state;

  var f = settings.f;

  d = Drawing(settings);

  var size = settings.drawing_settings.size;
  var loc = settings.drawing_settings.loc;

  var w;
  var h;
  var x;
  var y;

  /*
  x = size.sheet.w * 1/2;
  y = 50;

  d.text(
    [x,y],
    'General Instructions:',
    'text',
    'title1'
  );

  y += 25;
  x -= 200;





  var electical_notes = [
    '1:   ALL ASPECTS OF THE ELECTRICAL WORK REQUIRED TO COMPLETE THE',
    '      PROJECT REPRESENTED IN THIS DOCUMENT SHALL COMPLY WITH THE.',
    '2:   MANUFACTURER'S RECOMMENDATIONS/SPECIFICATIONS AND ALL CODES,',
    '      STATUTES, AND STANDARDS ADOPTED BY THE settings AND THE.',
    '3:   LOCAL AUTHORITY HAVING JURISDICTION.',
    '4:   THE INFORMATION PROVIDED IN THESE DOCUMENTS IS NOT EXHAUSTIVE,',
    '      IT REMAINS THE CONTRACTORS RESPONSIBILITY TO ACHIEVE THE.',
    '5:   PROPOSED INSTALLATION IN FULL EXERCISE OF AND COMPLIANCE',
    '      WITH THE ITEMS IDENTIFIED IN GENERAL ELECTRICAL NOTE 1.',
    '6:   AN AC DICONNECT, AT THE ELECTRICAL SERVICE ENTRANCE,',
    '      IS EXEMPT FROM REQUIRE MENT BY LAW, FOR TIER 1 RENEWABLE ENERGY.',
    '7:   SYSTEMS, PER FLORIDA ADMINISTRATION CODE 25-6.065(6)(A).',
    '      AUXILLIARY DISCONNECTS ARE A UTILIT Y CO. OPTION. IF REQUIRED BY THE.',
    '8:   UTILITY CO., THE UTILITY CO. SHALL BEAR THE ADDITIONAL EXPENCE INCURRED,',
    '      AS STIPULATED BY THE FLORIDA ADMINISTRATION CODE.',
    '9:   ALL CONDUCTORS ARE TO BE CU.',
    '10:  ALL UNIDENTIFIED CONDUCTORS UNDER MODULES ARE UL LISTED AND',
    '      MANUFACTURER PROVIDED CABLES, CONNECTORS AND ASSEMBLIES.',
    '11:  ALL ELECTRICAL COMPONENTS, (RACEWAYS, JUNCTION BOXES,',
    '      DISCONNECTS, PANEL BOARDS, ETC.), SHALL BE INSTALLED PLUMB, LEVEL,.',
    '12:  AND IN COMPLIANCE WITH ALL APPLICABLE SECTIONS OF NEC ARTICLE 110.',
    '13:  ALL RACEWAYS SHALL BE SUPPORTED ON INTERVALS AND BY METHODS AS',
    '      APPROVED/REQUIRED BY THE CURRENTLY ADOPTED NEC ED.',
    '14:  ALL RACEWAYS, CABLES AND J-BOXES SHALL BE LOCATED OUT OF DIRECT SUNLIGHT.',
    '15:  SOLAR PANELS TO BE BONDED TO RACKING, UTILIZING WEEB OR',
    '     SELF BONDING CLAMPING COMPONENTS.',
    '16:  RACKING SYSTEM TO HAVE CONTINUOUS BONDING, WITH #6 GND.',
    '17:  CONTRACTOR SHALL VERIFY THE INSTALLATION OF A',
    '      BIDIRECTIONAL UTILITY SERVICE METER.',
    '18:  HOUSE PANEL CIRCUIT BREAKERS TO BE BACK FED SHALL BE LISTED AS',
    '      BACK FEED CIRCUIT BREAKERS.',
    '19:  THE CONTRACTOR SHALL SEAL ALL PENETRATIONS RESULTING FROM THIS SCOPE OF WORK.',
    '20:  ALL SIGNAGE SHALL BE PROVIDED, AS REQUIRED BY THE CURRENTLY ADOPTED NEC ED.',
  ]
  d.text( [x,y], electical_notes, 'table', 'table_left' );

  w = 390;
  h = 405;
  d.rect( [ x+w/2-5 ,y+h/2-10 ], [w,h], 'table' );


  var labels_x = 120;
  var labels_y = 60;

  x = labels_x;
  y = labels_y;
  w = 200;
  h = 100;


  d.text( [x,y-30], 'PHENOLIC PLACARDS:', 'table', 'title_sign' );

  d.text( [x,y], 'APPLY TO BACK FEED BREAKER:', 'table', 'table' );
  d.text( [x,y+25], 'WARNING', 'table', 'title_sign' );
  d.text( [x,y+45], [
    'INVERTER OUTPUT CONNECTION',
    'DO NOT RELOCATE THIS OVERCURRENT DEVICE ',
  ], 'table', 'table' );
  d.rect( [ x ,y+10+h/2 ], [w,h], 'table' );

  x += 230;
  d.text( [x,y], 'APPLY TO RACEWAYS & JUNCTION BOX:', 'table', 'table' );
  d.text( [x,y+25], 'WARNING', 'table', 'title_sign' );
  d.text( [x,y+45], [
    'PHOTOVOLTAIC POWER SOURCE',
  ], 'table', 'table' );
  d.rect( [ x ,y+10+h/2 ], [w,h], 'table' );

  x += 230;
  d.text( [x,y], 'APPLY TO DC DISCONNECT:', 'table', 'table' );
  d.text( [x,y+25], 'WARNING', 'table', 'title_sign' );
  d.text( [x,y+45], [
    'ELECTRIC SHOCK HAZARD.',
    'THE DC CONDUCTORS OF THIS',
    'PHOTOVOLTAIC SYSTEM',
    'ARE UNGROUNDED AND MAY BE',
    'ENERGIZED ELECTRIC SHOCK HAZARD',
  ], 'table', 'table' );
  d.rect( [ x ,y+10+h/2 ], [w,h], 'table' );

  x += 230;
  d.text( [x,y], 'APPLY TO MAIN DISTRIBUTION PANEL & AC DISCONNECT:', 'table', 'table' );
  d.text( [x,y+25], 'WARNING', 'table', 'title_sign' );
  d.text( [x,y+45], [
    'ELECTRIC SHOCK HAZARD.',
    'DO NOT TOUCH TERMINALS.',
    'TERMINALS ON BOTH THE LINE',
    'AND LOAD SIDE',
    'MAY BE ENERGIZED IN THE OPEN POSITION',
  ], 'table', 'table' );
  d.rect( [ x ,y+10+h/2 ], [w,h], 'table' );

  //*/
  d.text( [
    size.sheet.w * 1/10,
    100
  ], [
    'ALL LABELS TO COMPLY WITH [2011 NEC 110.21] OR',
    '[2014 NEC 110.21(B)]; LABELS SHALL BE OF SUFFICIENT',
    'DURABILITY TO WITHSTAND THE ENVIRONMENT INVOLVED.',
    ' ',
    ' ',
    'AT EACH DC JUNCTION BOX:',
    '[690.35(F)] LABEL',
    'WARNING: ELECTRIC SHOCK HAZARD',
    'THE DC CONDUCTORS OF THIS PHOTOVOLTAIC SYSTEM ARE',
    'UNGROUNDED AND MAY BE ENERGIZED',
    ' ',
    'ALONG INDOOR DC WIRING AT (MAX.) 10\' INTERVALS:',
    '[690.31(E)]',
    'PHOTOVOLTAIC POWER SOURCE',
    'AT DC DISCONNECT:',
    '[690.14(C)(2)] DC DISCONNECT LABEL',
    'DC DISCONNECT',
    '[690.53] PV POWER SOURCE DC RATING',
    'RATED CURRENT AT MAXIMUM POWER: 17.1A',
    'RATED VOLTAGE AT MAXIMUM POWER: 161V',
    'MAXIMUM SYSTEM VOLTAGE: 545V',
    'MAXIMUM SYSTEM CURRENT: 23.2A',
    '** CONTRACTOR TO MODIFY TO MEET FIELD CONDITIONS',
    ' ',
    'AT AC DISCONNECTS:',
    '[690.15]',
    'AC DISCONNECT',
    'AT PV INTERCONNECTION POINTS:',
    '[690.54] PV POWER SOURCE AC RATING (QTY: 2)',
    'RATED CURRENT: 21A',
    'RATED VOLTAGE: 240/120V',
    '[690.54]',
    'PV POWER SOURCE AC RATING (QTY: 1)',
    'RATED CURRENT: 42A',
    'RATED VOLTAGE: 240/120V'
  ], 'table', 'system_label_left' );

  d.text( [
    size.sheet.w * 1/2,
    100
  ], [
    'AT NEW PV COMBINING PANELBOARD AT SERVICE ENTRANCE:',
    'SOLAR PV COMBINING PANELBOARD ONLY. NO LOAD CIRCUIT',
    'BREAKERS MAY BE ADDED.',
    ' ',
    'AT MOST ACCESSIBLE PV SYSTEM AC DISCONNECT, AND AT',
    'UTILITY SERVICE DISCONNECT:',
    '[705.10] DISCONNECT LOCATIONS',
    'SYSTEM SPECIFIC. COULD INCLUDE EITHER CLEAR TEXT',
    'DESCRIPTION OR A MAP OF SITE DESCRIBING LOCATIONS OF',
    'BOTH DISCONNECTS: 1) UTILITY SERVICE DISCONNECT AND',
    '2) PV SYSTEM DISCONNECT',
    '(TWO PLACARDS REQUIRED IF DISCONNECTS ARE NOT',
    'CO-LOCATED)',
    ' ',
    '(IF APPLICABLE) AT BACKFED BREAKER IN CUSTOMER EQUIPMENT:',
    '[705.12(D)(4)]: SIMILAR LABEL TO',
    'DUAL POWER SOURCES: BUILDING SERVED BY UTILITY SERVICE',
    'AND PHOTOVOLTAIC SYSTEM',
    'AT EACH PANELBOARD UPSTREAM OF PV INVERTER BREAKER.',
    ' ',
    '[705.12(D)(7)]: IN A PANELBOARD, WHEN THE SUM OF ITS UTILITY',
    'SUPPLY BREAKER AND ITS PV INVERTER BREAKER EXCEED ITS',
    'RATING, BREAKERS SHALL BE LOCATED AT OPPOSITE ENDS OF',
    'THE BUS WITH THIS LABEL NEAR THE PV INVERTER BREAKER',
    '(EQUIVALENT WORDING ACCEPTABLE):',
    'WARNING',
    'INVERTER OUTPUT CONNECTION',
    'DO NOT RELOCATE THIS OVERCURRENT DEVICE',
    ' ',
    'COLOR CODING:',
    'DC+: BLACK',
    'DC-: BLACK (OPTION: ORANGE)',
    'GROUND: GREEN OR BARE',
    'AC L1: BLACK; L2: RED; N: WHITE OR GREY'
  ], 'table', 'system_label_left' );

  return d;
};
