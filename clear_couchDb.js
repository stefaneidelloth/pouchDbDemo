//in order for this nodejs script to work, install pouchdb and pouchdb-adapter-node-websql:
//npm install pouchdb --save
//npm install pouchdb-adapter-node-websql --save
//also see https://pouchdb.com/2016/04/28/prebuilt-databases-with-pouchdb.html
//
//to execute this script:
//node couchDb_to_sqLite_transfer_node_script.js


// load PouchDB with the optional node-websql adapter
var PouchDB = require('pouchdb').plugin(require('pouchdb-adapter-node-websql'));

// set up our databases - make sure the URL is correct!
var database = new PouchDB('http://localhost:5984/german_data');

database.allDocs({include_docs: true}).then(allDocs => {
  return allDocs.rows.map(row => {
    return {_id: row.id, _rev: row.doc._rev, _deleted: true};
  });
}).then(deleteDocs => {
  return database.bulkDocs(deleteDocs);
});
