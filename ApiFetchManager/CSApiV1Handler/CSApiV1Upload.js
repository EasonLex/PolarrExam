//
//  citiesocial mobile app
//
//  Created by Eason Lin on 2018/08/121
//  Copyright © 2016年 citiesocial. All rights reserved.
//

'use strict'

import React, { Component } from 'react';

import {
  fetchApiWithRequest
} from '../CSFetchHandler'

import {
  CSApiV1,
  CSApiV1Url,
  CSApiV1Path
} from './CSApiV1Parameters'

let CryptoJS = require('crypto-js');

async function uploadDeviceToken(tokenInfo) {
  let requestObj = {};
  requestObj['method']    = 'POST';
  requestObj['url']       = CSApiV1Url.baseUrl +
  					                CSApiV1Url.apiVersion +
  					                CSApiV1Path.deviceTokenPath +
                            CSApiV1Path.createPath;
  requestObj['headers']   = {'Content-Type': 'multipart/form-data',};
  requestObj['body']      = [ {name: 'device_id', data: tokenInfo.device_id.toString()},
                              {name: 'device_token', data: tokenInfo.device_token},
                              {name: 'device_info', data: tokenInfo.device_info},
                              {name: 'customer_id', data: tokenInfo.customer_id.toString()},
                              {name: 'notification_frequency', data: tokenInfo.notification_frequency.toString()}, ];
  return fetchApiWithRequest(requestObj);
}

async function uploadEmailToGetMultipassToken(email) {
  let requestObj = {};

  const CryptoHmacs       = CryptoJS.HmacSHA256(email, CSApiV1.CSSHASecret);
  const hashString        = CryptoHmacs.toString(CryptoJS.enc.Hex);

  let bodyObj             = { 'user_email'    : email,
                              'api_key'       : CSApiV1.CSSHAKey,
                              'api_signature' : hashString,
                              'channel_name'  : 'vienna_1', };

  // console.log(bodyObj);
  let bodyJsonString      = JSON.stringify(bodyObj);

  requestObj['method']    = 'POST';
  requestObj['url']       = CSApiV1Url.baseUrl +
  					                CSApiV1Url.apiVersion +
  					                CSApiV1Path.multipassPath;
  requestObj['headers']   = {'Accept': 'application/json',
                             'CITIESOCIALSLOGAN': 'zhaohaodongxi'};
  requestObj['body']      = bodyJsonString;

  return fetchApiWithRequest(requestObj);
}

async function uploadUserInfoToCreateAccount(userInfo) {

  let requestObj          = {};

  let dataObj             = { 'email': userInfo.email,
                              'password': userInfo.password,
                              'password_confirmation': userInfo.password,
                              'verified_email': true,
                              'first_name': userInfo.firstName,
                              'last_name': userInfo.lastName,};

  let dataString          = JSON.stringify(dataObj);

  requestObj['method']    = 'POST';
  requestObj['url']       = CSApiV1Url.baseUrl +
  					                CSApiV1Url.apiVersion +
  					                CSApiV1Path.createShopifyAccountPath;
  requestObj['headers']   = {'Accept':        'application/json',
                             'Content-Type':  'multipart/form-data',
                             'Authorization':  CSApiV1.encodedAuth};
  requestObj['body']      = [ {name: 'customer_data', data: dataString} ];
  return fetchApiWithRequest(requestObj);
}

module.exports = {
  uploadDeviceToken,
  uploadEmailToGetMultipassToken,
  uploadUserInfoToCreateAccount,
};
