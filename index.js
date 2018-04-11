import PouchDB from 'pouchdb';
import PouchFlyCache from './lib/pouchdb-adapter-flycache';
//import PouchMemory from 'pouchdb-adapter-memory';

//hack for pouch logic
global.navigator = {};
global.btoa = "TEST";
global.btoa = function(str) { return Buffer.from(str, 'utf8').toString('base64'); }
global.atob = function(b64Encoded) {return Buffer.from(b64Encoded, 'base64').toString('utf8');}


var onSyncChange = function () {
  console.log("SYNC CHANGE"); //, arguments);
}
var onSyncPaused = function () {
  console.log("SYNC PAUSE"); //, arguments);
}
var onSyncError = function (err) {
  console.log("SYNC ERRORR",JSON.stringify(err),"test"); //, arguments);
}
var onSyncActive = function (err) {
  console.log("SYNC ACTIVE",err); //, arguments);
}
var onSyncDenied = function (err) {
  console.log("SYNC DENIED",err); //, arguments);
}

PouchDB.plugin(PouchFlyCache);
//PouchDB.plugin(PouchMemory);
//PouchDB.debug.enable('*');
var url = 'https://ed28c1f6-8a3d-4820-b8be-164d45b93312-bluemix.cloudant.com/fly-test';
var local = new PouchDB('localFLY', {adapter: 'flycache'});
//var local = new PouchDB('localMEM', {adapter: 'memory'});
var remote = new PouchDB(url);

fly.http.respondWith(function(request){
  //since we're mixing callbacks with promises a bit,
  //we'll just be explicit about it
  return new Promise(function (resolve, reject) {
    // do one way, one-off sync from the server until completion
    remote.replicate.to(local).on('complete', function(info) {
      local.get('test_doc').then(function (doc) {
        resolve(new Response("Hello! We support whirled peas." + JSON.stringify(doc), { status: 200}));
      }).catch(function (e) {
        reject(e);
      });
    }).on('error', onSyncError).on('change', onSyncChange).on('paused', onSyncPaused).on('active', onSyncActive).on('denied', onSyncDenied);
  });
});
