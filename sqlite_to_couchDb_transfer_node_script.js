//in order for this nodejs script to work, install pouchdb and pouchdb-adapter-node-websql:
//npm install pouchdb --save
//npm install pouchdb-adapter-node-websql --save
//also see https://pouchdb.com/2016/04/28/prebuilt-databases-with-pouchdb.html
//
//to execute this script:
//node sqlite_to_couchDb_transfer_node_script.js


// load PouchDB with the optional node-websql adapter
var PouchDB = require('pouchdb').plugin(require('pouchdb-adapter-node-websql'));
var visualizationDatabase = new PouchDB('http://localhost:5984/visualization');

var sqlite3 = require('sqlite3');
var inputDatabase = new sqlite3.Database('demo_input.sqlite', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

inputDatabase.serialize(function() {

	inputDatabase.each("SELECT * FROM visualization", function(err, row) {
		
		if(row){
			console.log(row);
		    visualizationDatabase.put(row);	
		}
	    	

	}, function(err, count) {

		console.log(err);
		inputDatabase.close();

	});
});

