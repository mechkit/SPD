'use strict';


// Setup
    // Load and create main settings, and save them to the root global object.
    var mk_settings = require('./modules/mk_settings');
    window.g = mk_settings();

    console.log('settings', g);


    //var version_string = 'Dev';
    //var version_string = 'Alpha201401--';
    var version_string = 'Preview'+moment().format('YYYYMMDD');
    g.state.version_string = version_string;
    // Load and URL query variables
    var query = g.f.query_string();
    //console.log(query);

    var update_webpage = require('./modules/update_webpage');

    g.f.update = function(){
        var settings = g;
        var f = g.f;

        console.log('/--- begin update');
        g.f.clear_drawing();

        settings.select_registry.forEach(function(selector){
            if(selector.value()) selector.input_ref.set(selector.value());
        });

        // recalculate system settings
        g.f.process(settings);

        update_webpage();

        console.log('\\--- end update');
    };


// request external data

    var newtwork_test = false;

    g.f.request_SVG = function(){
    //*
        console.log('sending data to server');
        var url = 'http://localhost:4233/plans_machine';
        var user_input_json = JSON.stringify(g.user_input);
        var data = { user_input_json: user_input_json};
        //var data = {
        //    test:42,
        //    test2:23,
        //};
        $.ajax({
                type: 'POST',
                url: url,
                data: data,
            })
            .done(function(res){
                console.log('server responce?', res);

            })
            .fail(function() {
                console.log( 'error' );
            })
            .always(function() {
                console.log( 'complete' );
            });

    };

    //var database_json_URL = 'http://10.173.64.204:8000/temporary/';
    var database_json_URL = 'data/fsec_copy.json';
    $.getJSON( database_json_URL)
        .done(function(data){
            g.FSEC_database = data;
            //console.log('database loaded', settings.database);
            g.components = g.f.load_database(data);
            g.state.database_loaded = true;
            if( g.state.mode === 'dev'){
                g.f.settings_dev_defaults(g);
            }
            g.f.update();

            ////////
            // TEMP
            //g.f.request_SVG();
            ////////
        });


// Build webpage

    // Set dev mode if requested
    if( query['mode'] === 'dev' ) {
        g.state.mode = 'dev';
    } else {
        g.state.mode = 'release';
    }

    if( query['password'] === 'sd723sfkbgr8yr' ) {
        g.state.password = true;
    } else {
        g.state.password = false;
    }


    if( g.state.mode === 'dev' ){
        g.f.settings_dev_defaults(g);
    }

    if( g.state.password || query['mode'] === 'dev' ){
        g.f.setup_webpage();

        // Add status bar
        var boot_time = moment();
        var status_id = 'status';
        setInterval(function(){ g.f.update_status_bar(status_id, boot_time, version_string);},1000);

        g.f.update();

    } else {
        console.log('no password');
        $('<img>')
            .attr('src', 'data/PlansMachine.png')
            //.attr('class', 'title_image')
            .css('width', '300px')
            .css('padding', '30px')
            .css('display', 'block')
            .css('margin-left', 'auto')
            .css('margin-right', 'auto')
            .appendTo(document.body);
        $('<div>')
            .attr('style', 'text-align: center')
            .html('Password required for demo')
            .appendTo(document.body);
    }