import CoreLevelPouch from 'pouchdb-adapter-leveldb-core';


import flycachedown from './index';

function FlyCachePouch(opts, callback) {
  var _opts = Object.assign({
    db: flycachedown
  }, opts);

  CoreLevelPouch.call(this, _opts, callback);
}

FlyCachePouch.valid = function () {
  return typeof fly !== 'undefined';
}
FlyCachePouch.use_prefix = true;

export default function (PouchDB) {
  PouchDB.adapter('flycache', FlyCachePouch, true);
}
