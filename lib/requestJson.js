const request = require('request');

const requestJson = url => new Promise((resolve, reject) =>
  request(url, { json: true }, (err, response, data) => {
    if (err) {
      throw err;
    }
    if (response.statusCode >= 400) return reject(response);
    return resolve(data);
  }));

module.exports.requestJson = requestJson;
