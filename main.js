'use strict';

// ┌────────────────────────────────────────────────────────────────────┐
// | Filename: main.js
// └────────────────────────────────────────────────────────────────────┘

// ┌────────────────────────────────────────────────────────────────────┐
// | Require modules
// └────────────────────────────────────────────────────────────────────┘
var browserify = require('browserify-middleware');
var stringify = require('stringify');
var figlet = require('figlet');
var express = require("express");
var stylus = require('stylus');
var nib = require('nib');
var fs = require('fs');
var pckg = require('./package.json');
var pug = require('pug');
var request = require('request');
var bodyParser = require('body-parser');

// ┌────────────────────────────────────────────────────────────────────┐
// | Initialize vars + constants
// └────────────────────────────────────────────────────────────────────┘
var app = express();
var port = Number( process.env.PORT || 5000 );

// ┌────────────────────────────────────────────────────────────────────┐
// | App setup
// └────────────────────────────────────────────────────────────────────┘

// browserify.settings( { transform: [ stringify( [ '.glsl', '.fnt', '.json', '.vs', '.fs', '.pug' ] ) ] } );

app.disable('etag');
app.set('views', __dirname + '/app/views');
app.use('/js', browserify('./app/js', { transform: [ stringify( [ '.glsl', '.fnt', '.vs', '.fs', '.svg' ] ), 'pugify'] }));

app.set('view engine', 'pug');
app.use('/*.css', function(req, res){
	var reqUrl = req.originalUrl.split('/');
	var file = reqUrl[reqUrl.length-1].slice(0, -4);
	res.set('Content-Type', 'text/css').send( stylus.render( fs.readFileSync(__dirname + '/app/css/' + file + '.styl', 'utf-8') )); 
});

var jsonParser = bodyParser.json()

app.use(express.static(__dirname + '/app'));

// ┌────────────────────────────────────────────────────────────────────┐
// | Routes
// └────────────────────────────────────────────────────────────────────┘

app.get('/', function(req, res){
	res.render( 'main' );
});

// ┌────────────────────────────────────────────────────────────────────┐
// | Init!!
// └────────────────────────────────────────────────────────────────────┘

app.listen(port);

figlet.fonts(function(err, fonts) {
	var font = fonts[Math.floor(Math.random() * fonts.length)];
	figlet(pckg.name, { font : font},function(err, data) {
		console.log(data);
		console.log('└─────> ' + pckg.description);
		console.log('└─────> v ' + pckg.version);
		console.log('└─────> Listening on port: ' + port);
		for( var i = 0 ; i < process.argv.length ; i++ ) if( process.argv[i] == 'midi' ) console.log('└─────> Using midi ');
	});
});