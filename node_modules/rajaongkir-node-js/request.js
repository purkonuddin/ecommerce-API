const http = require("http");
const qs = require('querystring');

const _request = function(method, headers, forminput) {
  return new Promise((resolve, reject) => {
    const req = http.request(headers, function (res) {
      const chunks = [];
      res.on("data", function (chunk) {
        chunks.push(chunk);
      });
      res.on("end", function () {
        const body = Buffer.concat(chunks);
          resolve(body.toString());
      });
    });

    ((requestedMethod) => {requestedMethod === 'post' ? req.write(qs.stringify(forminput)) : void 0 })(method)
    req.on("error", function(error) {
      reject(error.message)
    })
    req.end();
  })
}
const requests = {_request}

module.exports = requests
