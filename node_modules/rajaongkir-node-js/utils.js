const querystring = require('querystring')
const curry = (f, arr = []) => (...args) =>
(a => a.length === f.length ?
  f(...a) :
  curry(f, a)
)([...arr, ...args]);

const map = curry((fn, F) => F.map(fn))

const i = x => {
  return x
}

const compose = (f1, f2) => x => f1(f2(x))
const Id = val => ({
  map: fn => Id(fn(val)),
  join: f => f(val),
  val: () => val
});
// new functions
const exists = x => (x.val() !== void 0 && x.val() !== null);

const without = x => ({
  map: fn => exists(x) ? x : x.map(fn)
});
const contentLength = (data) => ({
  "content-length": Buffer.byteLength(querystring.stringify(data))
})
// dependencies functions
const call = curry((fn, sep, str) => fn.call(str, sep))
const reverse = arr => Array.prototype.reverse.call(arr)
const split = String.prototype.split
const splitBySlash = call(split, '/')
const splitBySlashThenReverse = compose(reverse, splitBySlash)

const createPath = curry((type, [query,...rest]) => {
  if(query === void 0 || rest === void 0) {
    return new Error(`you're not supplying a correct url path`)
  }
  if(typeof query !== 'string') {
    return new Error(`expected a string not a ${typeof query}`)
  }
  switch (type) {
    case 'pro':
      return `/api/${(restUrl => restUrl.length > 2 ? `${restUrl[0]}/${query}` :`${query}`)(rest)}`
      break;
    case 'starter':
      return `/starter/${(restUrl => restUrl.length > 2 ? `${restUrl[0]}/${query}` :`${query}`)(rest)}`
      break;
    case 'basic':
      return `/basic/${(restUrl => restUrl.length > 2 ? `${restUrl[0]}/${query}` :`${query}`)(rest)}`
      break;
    default:
    return `/starter/${(restUrl => restUrl.length > 2 ? `${restUrl[0]}/${query}` :`${query}`)(rest)}`
  }
})

const preparePath = type => compose(createPath(type), splitBySlashThenReverse)
const assignPath = f =>({path:f})

// ::S -> F -> Obj
const assignHostName = type => {
  if(typeof type !== 'string') {
    return new Error(`expected a string, you suplied a ${typeof type} look at your init function `)
  }
  if(type === 'pro' || type === 'basic' || type === 'starter') {
      return {
      "hostname": type==='pro' ? 'pro.rajaongkir.com' : 'api.rajaongkir.com'
    }
  }

  return {
    "hostname": 'api.rajaongkir.com'
  }

}

const mapkey = apiKey => post => post ? ({
    "headers": {"key":apiKey,
    "content-type": "application/x-www-form-urlencoded",
    "content-length": post
}}) : ({
  "headers": {"key":apiKey}
})

const assign = (...args) => f => Object.assign({}, f, ...args)

module.exports = {
  map,
  curry,
  Id: Id,
  compose,
  i,
  exists,
  mapkey,
  assignHostName,
  createPath,
  splitBySlashThenReverse,
  splitBySlash,
  split,
  reverse,
  call,
  curry,
  assignPath,
  preparePath,
  assign,
  without,
  contentLength
}
