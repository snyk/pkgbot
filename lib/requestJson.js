const request = require('request');

const requestJson = (url, auth) => new Promise((resolve, reject) => {
  let requestOptions = { json: true };
  if (auth) requestOptions.headers = {authorization: auth};
  request(url, requestOptions, (err, response, data) => {
    if (err) {
      throw err;
    }
    if (response.statusCode >= 400) return reject(response);
    return resolve(data);
  });
});

module.exports.requestJson = requestJson;
