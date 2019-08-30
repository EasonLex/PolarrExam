//
//  citiesocial mobile app
//
//  Created by Eason Lin on 2018/08/13.
//  Copyright © 2016年 citiesocial. All rights reserved.
//

'use strict'

import React, { Component } from 'react';
import {
  fetchApi
} from '../CSFetchManager/CSFetchHandler'

import {
  CSApiV1Url,
  CSApiV1Path,
  ApiKey
} from './CSApiV1Parameters'

async function searchPhotoCollections(collection) {
  let requestObj          = {};
  requestObj['method']    = 'GET';
  requestObj['url']       = CSApiV1Url.baseUrl +
                            CSApiV1Path.searchPath +
                            CSApiV1Path.collectionsPath +
                            '?client_id=' + ApiKey +
                            '&query=' +  collection;
  // console.log(requestObj['url'])
  return fetchApi(requestObj);
}

async function fetchPhotosByCollectionId(collectionid, page = 1) {
  let requestObj          = {};
  
  requestObj['method']    = 'GET';
  requestObj['url']       = CSApiV1Url.baseUrl +
                            CSApiV1Path.collectionsPath +
                            collectionid + '/' +
                            CSApiV1Path.photoPath +
                            '?client_id=' + ApiKey +
                            '&per_page=10&page=' + page;
  return fetchApi(requestObj);
}

async function fetchPhotoById(photoId) {
  let requestObj          = {};
  requestObj['method']    = 'GET';
  requestObj['url']       = CSApiV1Url.baseUrl +
                            CSApiV1Path.photoPath +
                            photoId + '/' +
                            '?client_id=' + ApiKey;

  let random = (Math.floor(Math.random()*3)+1) * 100;
  await delay(random);
  return fetchApi(requestObj);
}

const delay = (interval) => {
  return new Promise((resolve) => {
      setTimeout(resolve, interval);
  });
};

module.exports = {
  searchPhotoCollections,
  fetchPhotosByCollectionId,
  fetchPhotoById,
};
