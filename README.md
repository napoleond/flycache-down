# flycache-down

An implementation of [leveldown](https://github.com/Level/leveldown) using the cache mechanism in Fly Edge Apps (see https://fly.io)

Forked from https://github.com/No9/localstorage-down

Also note that for the time being, I manually edited `node_modules/uuid/lib/rng-browser.js` to include the following change:

```js
// getRandomValues needs to be invoked in a context where "this" is a Crypto implementation.
var getRandomValues = null;
//(typeof(crypto) != 'undefined' && crypto.getRandomValues.bind(crypto)) ||
//                      (typeof(msCrypto) != 'undefined' && msCrypto.getRandomValues.bind(msCrypto));
```

I'm sure there is a better way of doing that within webpack config, but haven't bothered with that yet.
