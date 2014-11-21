'use strict';
var $ = require('jquery');
var k$ = require('../lib/k/k_DOM');
var k = require('../lib/k/k');
var kontainer = require('../lib/k/kontainer');

var f = {};

f.object_defined = function(object){
    var output = true;
    for( var key in object ){
        output &= object.hasOwnProperty(key);
        //console.log( key, object.hasOwnProperty(key) );
    }
    return output;
};

f.nullToObject = function(object){
    for( var key in object ){
        if( object.hasOwnProperty(key) ){
            if( object[key] === null ){
                object[key] = {};
            } else if( typeof object[key] === 'object' ) {
                object[key] = f.nullToObject(object[key]);
            }
        }
    }
    return object;
};

f.blank_copy = function(object){
    var newObject = {};
    for( var key in object ){
        if( object.hasOwnProperty(key) ){
            if( typeof object[key] === 'object' ) {
                newObject[key] = {};
                for( var key2 in object[key] ){
                    if( object[key].hasOwnProperty(key2) ){
                        newObject[key][key2] = null;
                    }
                }
            } else {
                newObject[key] = null;
            }
        }
    }
    return newObject;
};

f.merge_objects = function(object1, object2){
    for( var key in object1 ){
        if( object1.hasOwnProperty(key) ){
            if( typeof object1[key] === 'object' ) {
                if( object2[key] === undefined ) object2[key] = {};
            } else {
                if( object2[key] === undefined ) object2[key] = null;
            }
        }
    }
};

f.lowercase_names = function(object){
    var new_object = {};
    for( var key in object ){
        if( object.hasOwnProperty(key) ){
            new_object[key.toLowerCase()] = object[key];
        }
    }
    return new_object;
};

f.titlecase_names = function(object){
    var new_object = {};
    for( var key in object ){
        if( object.hasOwnProperty(key) ){
            var new_key = key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
            new_object[new_key] = object[key];
        }
    }
    return new_object;
};




f.kelem_setup = function(kelem, settings){
    if( !settings) console.log(settings);
    if( kelem.type === 'selector' ){
        kelem.setRefObj(settings);
        kelem.setUpdate(settings.update);
        settings.select_registry.push(kelem);
        kelem.update();
    } else if( kelem.type === 'value' ){
        kelem.setRefObj(settings);
        //kelem.setUpdate(update_system);
        settings.value_registry.push(kelem);
    }
    return kelem;
};







f.add_selectors = function(settings, parent_container){
    for( var section_name in settings.input_options ){
        var selection_container = $('<div>').attr('class', 'input_section').attr('id', section_name ).appendTo(parent_container);
        //selection_container.get(0).style.display = display_type;
        var system_div = $('<div>').attr('class', 'title_bar')
            .appendTo(selection_container)
            /* jshint -W083 */
            .click(function(){
                $(this).parent().children('.drawer').children('.drawer_content').slideToggle('fast');
            });
        var system_title = $('<a>')
            .attr('class', 'title_bar_text')
            .attr('href', '#')
            .text(section_name)
            .appendTo(system_div);
        $(this).trigger('click');
        var drawer = $('<div>').attr('class', 'drawer').appendTo(selection_container);
        var drawer_content = $('<div>').attr('class', 'drawer_content').appendTo(drawer);
        for( var input_name in settings.input_options[section_name] ){
            $('<span>').html(input_name + ': ').appendTo(drawer_content);
            /*
            var selector = k$('selector')
                .setOptionsRef( 'input_options.' + section_name + '.' + input_name )
                .setRef( 'system.' + section_name + '.' + input_name )
                .appendTo(drawer_content);
            f.kelem_setup(selector, settings);
            //*/
            var set_kontainer = Object.create(kontainer)
                .obj(settings)
                .ref('system.' + section_name + '.' + input_name);
            var list_kontainer = Object.create(kontainer)
                .obj(settings)
                .ref('input_options.' + section_name + '.' + input_name);
            var $elem = $('<select>')
                .attr('class', 'selector')
                .appendTo(drawer_content);
            settings.select_registry.push({
                elem: $elem.get()[0],
                set_ref: set_kontainer,
                list_ref: list_kontainer
            });
            $('</br>').appendTo(drawer_content);

        }
    }
};



f.update_selectors = function(settings){
    settings.select_registry.forEach(function(select){
        console.log( select );
        console.log( select.elem.options );
        console.log( select.elem.selectedIndex );
        if( select.elem.selectedIndex >= 0 ) {
            select.value = select.elem.options[select.elem.selectedIndex].value;
        }

        $('<option>').attr('selected',true).attr('disabled',true).attr('hidden',true).appendTo(select.elem);

        var list = select.list_ref.get();
        console.log( Object.prototype.toString.call( list ) );
        //if( Object.prototype.toString.call( list ) === '[object Array]' ){
        if( list instanceof Array ){
            list.forEach(function(opt_name){
                console.log(opt_name);
                var o = document.createElement('option');
                o.value = opt_name;
                if( select.value ){
                    if( opt_name.toString() === select.elem.value.toString() ) {
                        //console.log('found it:', value);
                        o.selected = "selected";
                    } else {
                        //console.log('does not match: ', value, this.value)
                    }
                    //o.setAttribute('class', 'selector_option');
                } else {
                    //console.log('no current value')
                }
                o.innerHTML = opt_name;
                select.elem.appendChild(o);
            });
        }
    });
};

f.add_options = function(select, array){
    array.forEach( function(option){
        $('<option>').attr( 'value', option ).text(option).appendTo(select);
    });
};




f.add_params = function(settings, parent_container){
    for( var section_name in settings.system ){
        if( true || f.object_defined(settings.system[section_name]) ){
            var selection_container = $('<div>').attr('class', 'param_section').attr('id', section_name ).appendTo(parent_container);
            //selection_container.get(0).style.display = display_type;
            var system_div = $('<div>')
                .attr('class', 'title_line')
                .appendTo(selection_container)
                /* jshint -W083 */
                .click(function(){
                    $(this).parent().children('.drawer').children('.drawer_content').slideToggle('fast');
                });
            var system_title = $('<a>')
                .attr('class', 'title_line_text')
                .attr('href', '#')
                .text(section_name)
                .appendTo(system_div);
            $(this).trigger('click');
            var drawer = $('<div>').attr('class', '').appendTo(selection_container);
            var drawer_content = $('<div>').attr('class', 'param_section_content').appendTo(drawer);
            for( var input_name in settings.system[section_name] ){
                $('<span>').html(input_name + ': ').appendTo(drawer_content);
                /*
                var selector = k$('value')
                    //.setOptionsRef( 'input_options.' + section_name + '.' + input_name )
                    .setRef( 'system.' + section_name + '.' + input_name )
                    .appendTo(drawer_content);
                f.kelem_setup(selector, settings);
                //*/
                var value_kontainer = Object.create(kontainer)
                    .obj(settings)
                    .ref('system.' + section_name + '.' + input_name);
                var $elem = $('<span>')
                    .attr('class', '')
                    .appendTo(drawer_content)
                    .text(value_kontainer.get());
                settings.value_registry.push({
                    elem: $elem.get()[0],
                    value_ref: value_kontainer
                });
                $('</br>').appendTo(drawer_content);
            }
        }
    }
};

f.update_values = function(settings){
    settings.value_registry.forEach(function(value_item){
        //console.log( value_item );
        //console.log( value_item.elem.options );
        //console.log( value_item.elem.selectedIndex );
        if(value_item.elem.selectedIndex){
            value_item.value = value_item.elem.options[value_item.elem.selectedIndex].value;
            value_item.kontainer.set(value_item.value);
        }
    });
};
















f.show_hide_params = function(page_sections, settings){
    for( var list_name in page_sections ){
        var id = '#'+list_name;
        var section_name = list_name.split('_')[0];
        var section = k$(id);
        if( settings.status.sections[section_name].set ) section.show();
        else section.hide();
    }
};

f.show_hide_selections = function(settings, active_section_name){
    $('#sectionSelector').val(active_section_name);
    for( var list_name in settings.input ){
        var id = '#'+list_name;
        var section_name = list_name.split('_')[0];
        var section = k$(id);
        if( section_name === active_section_name ) section.show();
        else section.hide();
    }
};

//f.setDownloadLink(settings){
//
//    if( settings.PDF && settings.PDF.url ){
//        var link = $('a').attr('href', settings.PDF.url ).attr('download', 'PV_drawing.pdf').html('Download Drawing');
//        $('#download').html('').append(link);
//    }
//}


f.loadTables = function(string){
    var tables = {};
    var l = string.split('\n');
    var title;
    var fields;
    var need_title = true;
    var need_fields = true;
    l.forEach( function(string, i){
        var line = string.trim();
        if( line.length === 0 ){
            need_title = true;
            need_fields = true;
        } else if( need_title ) {
            title = line;
            tables[title] = [];
            need_title = false;
        } else if( need_fields ) {
            fields = line.split(',');
            tables[title+"_fields"] = fields;
            need_fields = false;
        //} else {
        //    var entry = {};
        //    var line_array = line.split(',');
        //    fields.forEach( function(field, id){
        //        entry[field.trim()] = line_array[id].trim();
        //    });
        //    tables[title].push( entry );
        //}
        } else {
            var line_array = line.split(',');
            tables[title][line_array[0].trim()] = line_array[1].trim();
        }
    });

    return tables;
};



f.loadComponents = function(string){
    var db = k.parseCSV(string);
    var object = {};
    for( var i in db ){
        var component = db[i];
        if( object[component.Make] === undefined ){
            object[component.Make] = {};
        }
        if( object[component.Make][component.Model] === undefined ){
            object[component.Make][component.Model] = {};
        }

        var fields = k.objIdArray(component);
        fields.forEach( function( field ){
            var param = component[field];
            if( !( field in ['Make', 'Model'] ) && !( isNaN(parseFloat(param)) ) ){
                component[field] = parseFloat(param);
            }
        })
        object[component.Make][component.Model] = component;
    }
    return object;
};




f.load_database = function(FSEC_database_JSON, settings){
    settings.components.inverters = {};
    FSEC_database_JSON.inverters.forEach(function(component){
        if( settings.components.inverters[component.MAKE] === undefined ) settings.components.inverters[component.MAKE] = {};
        settings.components.inverters[component.MAKE][component.MODEL] = f.titlecase_names(component);
    });
    settings.components.modules = {};
    FSEC_database_JSON.modules.forEach(function(component){
        if( settings.components.modules[component.MAKE] === undefined ) settings.components.modules[component.MAKE] = {};
        settings.components.modules[component.MAKE][component.MODEL] = f.titlecase_names(component);
    });
};


f.get_ref = function(string, object){
    var ref_array = string.split('.');
    var level = object;
    ref_array.forEach(function(level_name,i){
        if( typeof level[level_name] === 'undefined' ) {
            return false;
        }
        level = level[level_name];
    });
    return level;
};
f.set_ref = function( object, ref_string, value ){
    var ref_array = ref_string.split('.');
    var level = object;
    ref_array.forEach(function(level_name,i){
        if( typeof level[level_name] === 'undefined' ) {
            return false;
        }
        level = level[level_name];
    });

    return level;
};

module.exports = f;