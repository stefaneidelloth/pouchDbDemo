//in order for this nodejs script to work, install pouchdb and pouchdb-adapter-node-websql:
//npm install pouchdb --save
//npm install pouchdb-adapter-node-websql --save
//also see https://pouchdb.com/2016/04/28/prebuilt-databases-with-pouchdb.html
//
//to execute this script:
//node sqlite_to_couchDb_transfer_node_script.js


var databaseName = 'german_data';
var PouchDB = require('pouchdb').plugin(require('pouchdb-adapter-node-websql'));
var pouchDatabase = new PouchDB('http://localhost:5984/' + databaseName);

var sqlite3 = require('sqlite3');

var _id=1;
var limit = 10;
var offset = 0;
var maxRows = 10e6;
	
processNextChunkOfRows();	

function processNextChunkOfRows(){
	var sqLiteDatabase = new sqlite3.Database(databaseName + '.sqlite', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);
	
	sqLiteDatabase.serialize(function() {
		sqLiteDatabase.each('SELECT * FROM ' + databaseName + ' LIMIT ' + limit + ' OFFSET ' + offset , function(err, row) {
			
			if(row){
				row._id = '' +_id;
				console.log(row);
				pouchDatabase.put(row)
				.catch(error=>{
					console.error(error);
					finished=true;
				});
				_id++;			
			}	    	

		}, function(err, count) {
			
			sqLiteDatabase.close();	
			if(err){
				console.error(err);				
			} else {
				offset+=limit;
				if(offset < maxRows){
					
					processNextChunkOfRows();
				} else {
					console.log('reached max row limit of ' + maxRows);
				}	
			}						

		});		
		
	});
}

	


