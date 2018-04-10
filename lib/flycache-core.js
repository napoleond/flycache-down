'use strict';

//
// Class that should contain everything necessary to interact
// with localStorage as a generic key-value store.
// The idea is that authors who want to create an AbstractKeyValueDOWN
// module (e.g. on lawnchair, S3, whatever) will only have to
// reimplement this file.
//

// see http://stackoverflow.com/a/15349865/680742
var nextTick = setTimeout; //global.setImmediate || process.nextTick;

async function callbackify(callback, fun) {
  var val;
  var err;
  try {
    val = await fun();
  } catch (e) {
    err = e;
  }
  nextTick(function () {
    callback(err, val);
  });
}

function createPrefix(dbname) {
  return dbname.replace(/!/g, '!!') + '!'; // escape bangs in dbname;
}

function FlyCacheCore(dbname) {
  this._prefix = createPrefix(dbname);
  this._savePrefix();
}

FlyCacheCore.prototype._savePrefix = async () => {
  var prefixes = JSON.parse(await fly.cache.getString('__GLOBAL_PREFIXES') || '[]');
  if (prefixes.indexOf(this._prefix) === -1) {
    prefixes.push(this._prefix);
    await fly.cache.set('__GLOBAL_PREFIXES', JSON.stringify(prefixes));
  }
};

FlyCacheCore.prototype.getKeys = function (callback) {
  var self = this;
  callbackify(callback, async () => {
    var tableKeys = JSON.parse(await fly.cache.getString('__GLOBAL_KEYS_'+self._prefix) || '[]');
    tableKeys.sort().map(k => k.replace(self._prefix,''));
    return tableKeys;
  });
};

FlyCacheCore.prototype.setKeys = function (keys, callback) {
  var self = this;
  callbackify(callback, async () => {
    keys = JSON.stringify(keys);
    return await fly.cache.set('__GLOBAL_KEYS_'+self._prefix,keys);
  });
};

FlyCacheCore.prototype.put = function (key, value, callback) {
console.log("P");
  var self = this;
  var cacheKey = self._prefix + key;
  self.getKeys((err, keys) => {
    if (err) return callback(err);

    if (keys.indexOf(cacheKey) === -1) {
console.log("Q");
      keys.push(cacheKey);
      self.setKeys(keys, (err, success) => {
console.log("T");
        if (err) return callback(err);
        if (!success) return callback(new Error("Failed to update key registry"));
        fly.cache.set(cacheKey, value).then((s) => {
console.log("S");
          return callback(null, s);
        }).catch(callback);
      });
    } else {
console.log("R");
      return fly.cache.set(cacheKey, value).then((s) => {
        return callback(null, s);
      }).catch(callback);
    }
  });
};

FlyCacheCore.prototype.get = function (key, callback) {
  var self = this;
  callbackify(callback, async () => {
    return await fly.cache.getString(self._prefix + key);
  });
};

FlyCacheCore.prototype.remove = function (key, callback) {
  var self = this;
  var cacheKey = self._prefix + key;
  self.getKeys((err, keys) => {
    if (err) return callback(err);

    keys = keys.filter(k => k !== cacheKey);

    self.setKeys(keys, (err, success) => {
      if (err) return callback(err);
      if (!success) return callback(new Error("Failed to update key registry"));
      fly.cache.expire(cacheKey, 0).then((s) => {
        return callback(null, s);
      }).catch(callback);
    });
  });
};

FlyCacheCore.destroy = function (dbname, callback) {
  callbackify(callback, async () => {
    var prefix = createPrefix(dbname);
    var tableKeys = JSON.parse(await fly.cache.getString('__GLOBAL_KEYS_'+prefix) || '[]');
    var success = tableKeys.map(async k => await fly.cache.expire(k,0))
                         .filter(s => s);
    return !!success.length;
  });
};

FlyCacheCore.clear = function (callback) {
  callbackify(callback, async () => {
    var prefixes = JSON.parse(await fly.cache.getString('__GLOBAL_PREFIXES') || '[]');
    var keys = prefixes.reduce(async (keys, prefix) => {
      var tableKeys =  JSON.parse(await fly.cache.getString('__GLOBAL_KEYS_'+p) || '[]');
      keys = keys.concat(tableKeys);
      return keys;
    }, []);
    var success = keys.map(async k => await fly.cache.expire(k,0))
                    .filter(s => s);
    return !!success.length;
  });
};

module.exports = FlyCacheCore;
