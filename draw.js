// PV Systems drawing generator



var appendElement = function(parentElement,name,attrs,text){
  var doc = parentElement.ownerDocument
  var svg = parentElement
  while (svg.tagName!='svg') svg = svg.parentNode
  var el = doc.createElementNS(svg.namespaceURI,name)
  for (var a in attrs){
    if (!attrs.hasOwnProperty(a)) continue
    var p = a.split(':')
    if (p[1]) el.setAttributeNS(svg.getAttribute('xmlns:'+p[0]),p[1],attrs[a])
    else el.setAttribute(a,attrs[a])
  }
  if (text) el.appendChild(doc.createTextNode(text))
  return parentElement.appendChild(el)
}


///////////////////
// misc functions

function get_JSON(URL, name) {
    $.getJSON( URL, function( json ) {
        build_comps(json)
    }).fail(function(jqxhr, textStatus, error) {
        console.log( "error", textStatus, error  )
    })
}

function format_floats( elem, index, array ) {
    array[index] = parseFloat(elem).toFixed(2)
}

function format_float( str ) {
    return parseFloat(str).toFixed(2)
}

var clear = function(div_id){
    document.getElementById(div_id).innerHTML = ''
}

/*
 *  normRand: returns normally distributed random numbers
 *  http://memory.psych.mun.ca/tech/snippets/random_normal/
 */
function normRand(mu, sigma) {
    var x1, x2, rad

    do {
        x1 = 2 * Math.random() - 1
        x2 = 2 * Math.random() - 1
        rad = x1 * x1 + x2 * x2
    } while(rad >= 1 || rad === 0)

    var c = Math.sqrt(-2 * Math.log(rad) / rad)
    var n = x1 * c
    return (n * mu) + sigma
}









/////////////////////////////////////////////
// DRAWING



//////////////
// Model


////////////
// layers

var l_attr = {}

l_attr.base = {
    'fill': 'none',
    'stroke':'#000000',
    'stroke-width':'1px',
    'stroke-linecap':'butt',
    'stroke-linejoin':'miter',
    'stroke-opacity':1,

}
l_attr.DC_pos = Object.create(l_attr.base)
l_attr.DC_pos.stroke = '#ff0000'
l_attr.DC_neg = Object.create(l_attr.base)
l_attr.DC_neg.stroke = '#000000'
l_attr.DC_ground = Object.create(l_attr.base)
l_attr.DC_ground.stroke = '#006600'
l_attr.module = Object.create(l_attr.base)
l_attr.box = Object.create(l_attr.base)
l_attr.text = Object.create(l_attr.base)
l_attr.text.stroke = '#0000ff'
l_attr.terminal = Object.create(l_attr.base)

fonts = {}
fonts.signs = {
    family:   'Helvetica',
    size:     5,
    anchor:   'middle',
    leading:  '1.5em',
}
fonts.label = {
    family:   'Helvetica',
    size:     2,
    anchor:   'middle',
    leading:  '1.5em',
}


///////
// setup drawing container

var layers = {}
for( l in l_attr) {
    layers[l] = []
}

var blocks = []

var clear_drawing = function() {
    blocks.length = 0
    for( var l in l_attr) {
        layers[l] = []
    }

}

//////
// build protoype objects

var Blk = {
    object: 'Blk',
}
Blk.move = function(x, y){
    for( var i in this.array ){
        this.array[i].move(x,y)
    }
    return this
}
Blk.add = function(){
    if( typeof this.array == 'undefined'){ this.array = []}
    for( var i in arguments){
        this.array.push(arguments[i])
    }
    return this
}

var SvgElem = {
    object: 'SvgElem'
}
SvgElem.move = function(x, y){
    if( typeof this.points != 'undefined' ) {
        for( var i in this.points ) {
            this.points[i][0] += x
            this.points[i][1] += y
        }
    }
    return this
}

///////
// functions for adding elements

var add = function(type, points, layer) {
    if( typeof layer == 'undefined' || ! (layer in layers) ) {
        layer =  'base'
    }
    if( typeof points == 'string') {
        var points = points.split(' ')
        for( i in points ) {
            points[i] = points[i].split(',')
            for( var c in points[i] ) {
                points[i][c] = Number(points[i][c])
            }
        }
    }

    var elem = Object.create(SvgElem)
    elem.type = type
    elem.points = points

    layers[layer].push(elem)

    return elem
}

var line = function(points, layer){
    //return add('line', points, layer)
    var line =  add('line', points, layer)
    return line
}

var rect = function(loc, size, layer){
    var rec = add('rect', [loc], layer)
    rec.w = size[0]
    rec.h = size[1]
    return rec
}

var circ = function(loc, diameter, layer){
    //log('circle', loc, diameter, layer)
    var cir = add('circ', [loc], layer)
    cir.d = diameter
    return cir
}

var text = function(loc, string, font, layer){
    var txt = add('text', [loc], layer)
    txt.string = string
    txt.font = font
    return txt
}

/////////////////////////////////


log('layers', layers)
//k.obj_log(layers, 'layers', 3)
//log('groups', groups)
//k.obj_log(groups, 'groups', 9)
log('blocks', blocks)

var mk_SVG = function(){
    for( layer_name in layers ){
        var attr = l_attr[layer_name]
    }

}

///////////////
//#system parameters

var system = {}
system.DC = {}
system.DC.string_num = 6



//////////////
//#drawing parameters

var size = {}

size.module_frame = {}
size.module_frame.w = 10
size.module_frame.h = 30
size.module_lead = size.module_frame.w*2/3
size.module_h = size.module_frame.h + size.module_lead*2
size.module_w = size.module_frame.w

size.wire_offset_base = 5
size.wire_offset_gap = size.module_w
size.wire_offset_max = system.DC.string_num * size.wire_offset_base
size.wire_offset_ground = size.wire_offset_max + size.wire_offset_base*2

size.string_gap = size.module_frame.w/42
size.string_gap_missing = size.string_gap + size.module_frame.w
size.string_h = (size.module_h * 4) + (size.string_gap * 2) + size.string_gap_missing
size.string_w = size.module_frame.w * 2.5

size.jb_box_h = 100
size.jb_box_w = 50

size.terminal_diam = 5

var loc = {}

loc.array = { x:200, y:600 }
loc.DC = loc.array
loc.inverter = { x:loc.array+300, y:loc.array-350 }
loc.inverter.bottom = loc.inverter.y + size.inverter_h


///////////////
// build drawing

//#start drawing
var mk_drawing = function(){
    log('making drawing')

    // PV array
    var coor = { x:200, y:600 }
    blocks.push( mk_array(loc.array) )
    blocks.push( mk_DC(loc.DC))
    //blocks.push( mk_inverter(loc.inverter) )
}

//#inverter
var mk_inverter = function(coor){
    log('makeing inverter')

    var coor = { x:coor.x, y:coor.y }
    var blk = Object.create(Blk)
    blk.type = 'Inverter'

    inverter_w = 200
    inverter_h = 150

    blk.add(
        rect(
            [coor.x,coor.y],
            [inverter_w, inverter_h],
            'box'
        ),
        circ(
            [coor.x,coor.y],
            5,
            'DC_neg'
        
        ),
        text()
    
    
    )
    return blk
}

//#AC


//#DC
var mk_DC = function( coor ){
    var coor = { x:coor.x, y:coor.y }
    var blk = Object.create(Blk)
    blk.type = 'DV Junction Box'

    var x = coor.x
    var y = coor.y
    var jBox_w = 80
    var jBox_h = 140 + size.wire_offset_base*2 * system.DC.string_num 

    var fuse_width = size.wire_offset_gap
    var to_disconnect_x = 150
    var to_disconnect_y = -100

    var discBox_w = 80 + size.wire_offset_base*2 * system.DC.string_num 
    var discBox_h = 140

    // combiner box
    
    blk.add(rect(
        [x+jBox_w/2,y-jBox_h/10],
        [jBox_w,jBox_h],
        'box'
    ))


    for( i in _.range(system.DC.string_num)) {
        var offset = size.wire_offset_gap + ( i * size.wire_offset_base )

        blk.add([
            line([
                [ x , y-offset],
                [ x+(jBox_w-fuse_width)/2 , y-offset],
            ], 'DC_pos'),
            line([
                [ x+(jBox_w+fuse_width)/2 , y-offset],
                [ x+jBox_w+to_disconnect_x-offset , y-offset],
                [ x+jBox_w+to_disconnect_x-offset , y+to_disconnect_y-size.terminal_diam],
                [ x+jBox_w+to_disconnect_x-offset , y+to_disconnect_y-size.terminal_diam-size.terminal_diam*3],
            ], 'DC_pos'),
            mk_terminal( { x: x+jBox_w+to_disconnect_x-offset, y: y+to_disconnect_y-size.terminal_diam/2 } )
        ])

        blk.add([
            line([
                [ x , y+offset],
                [ x+(jBox_w-fuse_width)/2 , y+offset],
            ], 'DC_neg'),
            line([
                [ x+(jBox_w+fuse_width)/2 , y+offset],
                [ x+jBox_w+to_disconnect_x+offset , y+offset],
                [ x+jBox_w+to_disconnect_x+offset , y+to_disconnect_y-size.terminal_diam],
                [ x+jBox_w+to_disconnect_x+offset , y+to_disconnect_y-size.terminal_diam-size.terminal_diam*3],
            ], 'DC_neg'),
            mk_terminal( { x: x+jBox_w+to_disconnect_x+offset, y: y+to_disconnect_y-size.terminal_diam/2 } )
        ])
    }

    x += jBox_w

    x += to_disconnect_x
    y += to_disconnect_y

    // DC disconect combiner lines
    if( system.DC.string_num > 1){
        offset_min = size.wire_offset_gap
        offset_max = size.wire_offset_gap + ( (system.DC.string_num-1) * size.wire_offset_base )
        line([
            [ x-offset_min, y-size.terminal_diam-size.terminal_diam*3],
            [ x-offset_max , y-size.terminal_diam-size.terminal_diam*3],
        ], 'DC_pos')
        line([
            [ x+offset_min, y-size.terminal_diam-size.terminal_diam*3],
            [ x+offset_max, y-size.terminal_diam-size.terminal_diam*3],
        ], 'DC_neg')
    }
    
    // Inverter conection
    blk.add(
        line([
            [ x-offset_min, y-size.terminal_diam-size.terminal_diam*3],
            [ x-offset_min, y-size.terminal_diam-size.terminal_diam*3],
        ],'DC_pos')
    )



    // DC disconect
    blk.add(rect(
        [x, y-discBox_h/2],
        [discBox_w,discBox_h],
        'box'
    ))
    return blk
}

var mk_terminal = function(coor){
    var coor = { x:coor.x, y:coor.y }
    var blk = Object.create(Blk)
    blk.type = 'terminal'

    x = coor.x
    y = coor.y

    blk.add(
        circ(
            [x,y],
            size.terminal_diam,
            'term'
            )
    )
    
    return blk
}

//#array
var mk_array = function(coor){
    var coor = { x:coor.x, y:coor.y }
    var blk = Object.create(Blk)
    blk.type = 'array'


    var coor_array = { x:coor.x, y:coor.y }
    coor.x -= size.module_frame.h*3
    coor.y -= size.string_h/2

    pv_array = {}
    pv_array.upper = coor.y
    pv_array.lower = pv_array.upper + size.string_h
    pv_array.right = coor_array.x - size.module_frame.h*2
    pv_array.left = pv_array.right - ( size.string_w * system.DC.string_num ) - ( size.module_w * 1.25 ) 

    pv_array.center = coor_array.y

    for( i in _.range(system.DC.string_num)) {
        var offset = i * size.wire_offset_base

        blk.add(mk_pv_string(coor))
        // positive home run
        blk.add(line([
            [ coor.x , pv_array.upper ],
            [ coor.x , pv_array.upper-size.module_w-offset ],
            [ pv_array.right+offset , pv_array.upper-size.module_w-offset ],
            [ pv_array.right+offset , pv_array.center-size.module_w-offset],
            [ coor_array.x , pv_array.center-size.module_w-offset],
        ], 'DC_pos'))

        // negative home run
        blk.add(line([
            [ coor.x , pv_array.lower ],
            [ coor.x , pv_array.lower+size.module_w+offset ],
            [ pv_array.right+offset , pv_array.lower+size.module_w+offset ],
            [ pv_array.right+offset , pv_array.center+size.module_w+offset],
            [ coor_array.x , pv_array.center+size.module_w+offset],
        ], 'DC_neg'))

        coor.x -= size.string_w
    }

    blk.add(line([
        [ pv_array.left , pv_array.lower + size.module_w + size.wire_offset_ground ],
        [ pv_array.right+size.wire_offset_ground , pv_array.lower + size.module_w + size.wire_offset_ground ],
        [ pv_array.right+size.wire_offset_ground , pv_array.center + size.module_w + size.wire_offset_ground],
        [ coor_array.x , pv_array.center+size.module_w+size.wire_offset_ground],
    ], 'DC_ground'))

    return blk

}


//#string
var mk_pv_string = function(coor){
    var coor = { x:coor.x, y:coor.y }
    var blk = Object.create(Blk)
    blk.type = 'string'

    var coor_string = {}
    coor_string.x = coor.x
    coor_string.y = coor.y

    //TODO: add loop to jump over negative return wires 
    blk.add(
        line(
            [
                [coor_string.x-size.module_frame.w*3/4, coor_string.y+size.module_frame.h/2+size.module_lead],
                [coor_string.x-size.module_frame.w*3/4, pv_array.lower + size.wire_offset_ground + size.module_lead*1.5 ],
            ],
            'DC_ground'
        )
    )
    var module1 = mk_module(coor_string)
    coor_string.y += size.module_frame.h + size.module_lead*2 + size.string_gap_missing
    var module2 = mk_module(coor_string)
    coor_string.y += size.module_frame.h + size.module_lead*2 + size.string_gap
    var module3 = mk_module(coor_string)
    coor_string.y += size.module_frame.h + size.module_lead*2 + size.string_gap
    var module4 = mk_module(coor_string)
    blk.add(module1,module2,module3,module4)


    return blk
}

//#module
var mk_module = function(coor) {
    var coor = { x:coor.x, y:coor.y }
    var blk = Object.create(Blk)
    blk.type = 'module'

    x = coor.x
    y = coor.y

    lead = size.module_lead
    w = size.module_frame.w
    h = size.module_frame.h


    blk.add(
        // frame
        rect(
            [0,h/2],
            [w,h],
            'module'
        ),
        // frame triangle?
        line([
            [-w/2,0],
            [0,w/2],
        ], 'module'),
        line([
            [0,w/2],
            [w/2,0],
        ], 'module'),
        // leads
        line([
            [0, 0],
            [0, -lead]
        ], 'DC_pos' ),
        line([
            [0, h],
            [0, h+(lead)]
        ], 'DC_neg' ),
        // pos sign
        text(
             [lead/2, -lead/2],
            '+',
            'signs',
            'text'
        ),
        // neg sign
        text(
             [lead/2, h+lead/2],
            '-',
            'signs',
            'text'
        ),
        // ground
        line([
            [-w/2, h/2],
            [-w/2-w/4, h/2],
        ], 'DC_ground')
    )

    blk.move(x,y)
    blk.move(0,lead)
    return blk
}






///////////////////
// Display

//#svg
var display_svg = function(container_id){
    log('displaying svg')
    var container = document.getElementById(container_id)
    container.innerHTML = ''
    //container.empty()

    //var svg_elem = document.getElementById('SvgjsSvg1000')
    var svg_elem = document.createElementNS("http://www.w3.org/2000/svg", 'svg')
    svg_elem.setAttribute('id','svg_drawing')
    svg_elem.setAttribute('width', 1000)
    svg_elem.setAttribute('height', 1000)
    container.appendChild(svg_elem)
    var svg = SVG(svg_elem).size(1000,1000)


    for( var layer_name in layers){
        var layer = layers[layer_name]
        for( var i in layer){
            var elem = layer[i]
            if( elem.type == 'rect') {
                svg.rect( elem.w, elem.h ).move( elem.points[0][0]-elem.w/2, elem.points[0][1]-elem.h/2 ).attr( l_attr[layer_name] )
            } else if( elem.type == 'line') {
                svg.polyline( elem.points ).attr( l_attr[layer_name] )
            } else if( elem.type == 'text') {
                var t = svg.text( elem.string ).move( elem.points[0][0], elem.points[0][1] ).attr( l_attr[layer_name] )
                t.font(fonts[elem.font])
            } else if( elem.type == 'circ') {
                var c = document.createElementNS("http://www.w3.org/2000/svg", 'ellipse')
                c.setAttribute('rx', elem.d/2)
                c.setAttribute('ry', elem.d/2)
                c.setAttribute('cx', elem.points[0][0])
                c.setAttribute('cy', elem.points[0][1])
                var attr = l_attr[layer_name]
                for( var i2 in attr ){
                    c.setAttribute(i2, attr[i2])
                }
                svg_elem.appendChild(c)
                /*
                c.attributes( l_attr[layer_name] )
                c.attributes({
                    rx: 5,
                    --------------------------
                    ry: 5,
                    cx: elem.points[0][0]-elem.d/2,
                    cy: elem.points[0][1]-elem.d/2
                })
                var c2 = svg.ellipse( elem.r, elem.r )
                c2.move( elem.points[0][0]-elem.d/2, elem.points[0][1]-elem.d/2 )
                c2.attr({rx:5, ry:5})
                c2.attr( l_attr[layer_name] )
                */
            }
        }

    }

}

//////////////////////////////////////////
// after page loads functions

//#update drawing
var update_drawing = function(){
    log('updating drawing')
    //log($('#string_select option:selected'))
    var svg_container_id = 'svg_container'
    if( document.getElementById(svg_container_id) == null ){
        var svg_container = document.createElement('div')
        svg_container.id = svg_container_id
        document.getElementById('drawing_page').appendChild(svg_container)
    } else {
        var svg_container = document.getElementById(svg_container_id)
    }
    var select_string = document.getElementById('string_select')
    system.DC.string_num = Number( select_string[select_string.selectedIndex].value )

    clear_drawing()

    mk_drawing()
    display_svg('svg_container')

}

$(document).ready( function() {
    var title = 'PV drawing test'
    var sections = {
        'drawing_page':'Drawing',
        'test':'test',
        'text_dump':'text_dump'
    }

    k.setup_body(title, sections)



    var dump = $('#text_dump')
    dump.text('this is a test')

    var string_select = $('<select>').attr('id','string_select')
    for( i in _.range(10)) {
        if( i != 0 ){
            var op = new Option()
            op.value = i
            op.text = String(i) + ' string'
            if( i === 4) { op.selected = 'selected' }
            string_select.append(op)
        }
    }
    $('#drawing_page').append(string_select)
    document.getElementById('string_select').selectedIndex = 4-1

    
    // When number of strings change, update model, display
    string_select.change(function(){
        update_drawing()
    })

    //document.getElementById('drawing_page').appendChild('<a href="#" onclick="clear(\'svg_container\')">clear</a>')

    // Start PV system drawing process
    update_drawing()



})



$(window).ready( function() {
    var boot_time = moment()
    var status_id = "#status"
    setInterval(function(){ k.update_status_page(status_id, boot_time) },1000)






})


