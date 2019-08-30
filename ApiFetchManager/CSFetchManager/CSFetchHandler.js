/**
 * Copyright 2019 citiesocial, Inc.
 * Created by Eason Lin on 2019/07/01
 * 
 * @constant CSFetchHandler
 * @flow
 */

const axios = require('axios');
const qs = require('qs');

/**
 * 
 * @param {Object} mainRequest 
 * @async
 */
async function fetchApi(mainRequest) {
  //
  // Return if this is a empty request or empty url.
  //
  if (!mainRequest || !mainRequest.url) { return {'result':'failed', 'response': 'Empty request/url'} };

  let request = createHandleRequests(mainRequest);
  
  return axios(request)
         .then((response) => {
           return response.data
         })
         .catch ((error) => {
           console.log(error)
           console.log(request)
          return {'result':'failed', 'response': 'Got error response'}
         })
}

/**
 * Create request object
 * @param {Object} mainRequest 
 */
function createHandleRequests(mainRequest) {
  let requestObj = {};
  const defaultHeaders = {'Accept':       'application/json',
                          'Content-Type': 'application/json'}

  requestObj['url'] =       mainRequest.url
  requestObj['timeout'] = 100000
  requestObj['timeout'] =   (!!mainRequest.timeout)? mainRequest.timeout:2000
  requestObj['method'] =    (!!mainRequest.method)? mainRequest.method:'GET'
  requestObj['headers'] =   (!!mainRequest.headers)? mainRequest.headers: defaultHeaders
  if (!!mainRequest.body) { requestObj['body'] = mainRequest.body }

  if(!!mainRequest['data']) {
    //
    // Transfer data format from json to string
    //
    if(requestObj.headers['Conteyt-type'] === 'application/x-www-form-urlencoded') {
      requestObj['data'] = qs.stringify(mainRequest.data)
    }
  }

  return requestObj;
}

module.exports = {fetchApi};
