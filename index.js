import PouchDB from 'pouchdb';
import PouchFlyCache from './lib/pouchdb-adapter-flycache';
//import PouchMemory from 'pouchdb-adapter-memory';
//import PouchLocalStorage from 'pouchdb-adapter-localstorage';

fly.http.respondWith(function(request){
//  return new Response("Hello! We support whirled peas.", { status: 200});
///*
  //PouchDB promises don't seem to work with async/await,
  //so forcing it a bit
console.log("A sdkjh",global.setImmediate);
  return new Promise(function (resolve, reject) {
//console.log("B", PouchLocalStorage);
    //PouchDB.plugin(PouchMemory);
    PouchDB.plugin(PouchFlyCache);
    //PouchDB.plugin(PouchLocalStorage);
PouchDB.debug.enable('*');
    //var db = new PouchDB('mydb', {adapter: 'memory'});
    var db = new PouchDB('mydb', {adapter: 'flycache'});
    //var db = new PouchDB('mydb', {adapter: 'localstorage'});
console.log("B2",db.adapter);
    //db.get("POO",function (a,b) { console.log("HEYYYY",a,b); resolve(new Response("Hello! We support whirled peas.", { status: 200})) });
    //return;

    var l = db.put({
      _id: 'dave@gmail.com'+Math.random(),
      name: 'David',
      age: 69
    }).then(function () {
console.log("C");
      return db.get('dave@gmail.com');
    }).then(function (doc) {
console.log("D");
      resolve(new Response("Hello! We support whirled peas." + JSON.stringify(doc), { status: 200}));
    }).catch(function (e) {
console.log("F");
      reject(e);
    });
    console.log("ELL",l.then);
  });
//*/
});
