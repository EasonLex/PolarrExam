//
//  citiesocial mobile app
//
//  Created by Eason Lin on 2018/08/13.
//  Copyright © 2016年 citiesocial. All rights reserved.
//

'use strict'

import React, { Component } from 'react';
import {
  searchPhotoCollections,
  fetchPhotosByCollectionId,
  fetchPhotoById
} from '../ApiFetchManager/CSApiV1Handler/CSApiV1Fetch'

import { SQLite } from 'expo-sqlite';
const db = SQLite.openDatabase('ImgDB55', 1);
const sortKeyDB = SQLite.openDatabase('SortKey', 1);

function getPhotoList(collection) {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "create table if not exists items (id text primary key not null, downloads int, imgUrl text, largeImgUrl text, height int, width int, username text, userid text, cameramake text, cameramodel text, views int, description text, info text, locationtitle text, latitude text, longitude text);"
      );
      tx.executeSql("select * from items", [], (_, { rows: { _array } }) => {
        // console.log(_array)
          resolve(_array)
      });
        
    });
  })
}

function sortPhotoList(sortConditionList) {
  // console.log(sortConditionList)
  let cameraConditionList = sortConditionList[0];
  let sqliteCondition = '';
  for (let i = 0; i < cameraConditionList.length; i++) {
    if (i === 0) {
      sqliteCondition += 'where '
    }
    let condition = cameraConditionList[i];
    sqliteCondition += ('(' + condition + ')')
    if (i < (cameraConditionList.length -1)) {
      sqliteCondition += ' OR '
    }
  }

  let orderConditionList = sortConditionList[1];
  let orderCondition = ''
  // console.log(orderConditionList)
  for (let i = 0; i < orderConditionList.length; i++) {
    let condition = orderConditionList[i];
    let orderStringList = condition.split("_");
    // console.log(orderStringList)
    let orderFrom = orderStringList[0];
    let orderRule = orderStringList[1];
    orderCondition = ' order by ' + orderFrom.toLowerCase() + ((orderRule === 'Ascending')? ' ASC':' DESC')
  }

  let completeSQL = "select * from items " + sqliteCondition + orderCondition
  // console.log('completeSQL')
  // console.log(completeSQL)

  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "create table if not exists items (id text primary key not null, downloads int, imgUrl text, largeImgUrl text, height int, width int, username text, userid text, cameramake text, cameramodel text, views int, description text, info text, locationtitle text, latitude text, longitude text);"
      );
      tx.executeSql(completeSQL, [], (_, { rows: { _array } }) => {
          resolve(_array)
      });
        
    });
  })
}

function searchWithUserPhotoList(inputString) {
  let completeSQL = "select * from items where username like '%" + inputString + "%'";
  // console.log(completeSQL)
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        "create table if not exists items (id text primary key not null, downloads int, imgUrl text, largeImgUrl text, height int, width int, username text, userid text, cameramake text, cameramodel text, views int, description text, info text, locationtitle text, latitude text, longitude text);"
      );
      tx.executeSql(completeSQL, [], (_, { rows: { _array } }) => {
        // console.log(_array)
          resolve(_array)
      });
        
    });
  })
}

function getCameraList() {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql("select DISTINCT(cameramake), cameramodel from items", [], (_, { rows: { _array } }) => {
          resolve(_array)
      });
        
    });
  })
}

async function fetPhotoList() {
  let collectionResults = await searchPhotoCollections('mobile-only-📱');
  let collectionList = collectionResults.results;
  let collection = collectionList[0];
  let page = 1;
  let photoList = []
  let tmpList = await fetchPhotosByCollectionId(collection.id, page);
  Array.prototype.push.apply(photoList, tmpList);

  while (tmpList.length > 0) {
    page++;
    tmpList = await fetchPhotosByCollectionId(collection.id, page);
    Array.prototype.push.apply(photoList, tmpList);
  }
  // console.log(photoList)
  await insertPhotoList(photoList);

}

async function insertPhotoList(photoList) {
  // return new Promise((resolve, reject) => {
    for (let i = 0; i < photoList.length; i++) {
      const photoObj = photoList[i];
      await insertPhoto(photoObj)
    }
    // resolve('insertPhoto(photoObj)')
  // })
}

async function insertPhoto(photoObj) {
  return new Promise((resolve, reject) => {
    db.transaction(
      tx => {
        // tx.executeSql("select * from items", [], (_, { rows }) => resolve(rows), reject);
        tx.executeSql("insert into items (id, imgUrl, largeImgUrl, height, width, description, username, userid) values (?, ?, ?, ?, ?, ?, ?, ?)", [photoObj.id, photoObj.urls.small, photoObj.urls.regular, photoObj.height, photoObj.width, photoObj.description, photoObj.user.name, photoObj.user.id], (_, { rows }) => {
          // console.log('insert done');
          resolve(JSON.stringify(rows))
        });
      }
    );
  })

}

async function insertPhotoDetails(photoDetails) {
  return new Promise((resolve, reject) => {
    // console.log(photoDetails)
    db.transaction(
      tx => {
        // tx.executeSql("select * from items", [], (_, { rows }) => resolve(rows), reject);
        tx.executeSql("update items set downloads = ?, views = ?, cameramake = ?, cameramodel = ?, info = ?, locationtitle = ?, latitude = ?, longitude = ?  where id = ?", [photoDetails.downloads, photoDetails.views, ((photoDetails.exif)?photoDetails.exif.make:''), (photoDetails.exif)?photoDetails.exif.model:'', photoDetails.alt_description, ((!!photoDetails.location) ? photoDetails.location.title: ''), ((!!photoDetails.location && !!photoDetails.location.position) ? photoDetails.location.position.latitude: ''), ((!!photoDetails.location && !!photoDetails.location.position) ? photoDetails.location.position.longitude: ''), photoDetails.id], (_, { rows }) => {
          // console.log('update done');
          resolve(JSON.stringify(rows))
        });
      }
    );
  })

}

async function fetPhotoDetails(photoList) {
  for (let i = 0; i < photoList.length; i++) {
    const photo = photoList[i];
    
    let photoDetails = await fetchPhotoById(photo.id);
    console.log(photoDetails)
    
    if (i % 10 === 0) {
      let random = (Math.floor(Math.random()*3)+1) * 100;
      await delay(random);
    }

    await insertPhotoDetails(photoDetails);
  }
}

const delay = (interval) => {
  return new Promise((resolve) => {
      setTimeout(resolve, interval);
  });
};

async function insertSortKey(photoDetails) {
  return new Promise((resolve, reject) => {
    // console.log(photoDetails)
    db.transaction(
      tx => {
        // tx.executeSql("select * from items", [], (_, { rows }) => resolve(rows), reject);
        tx.executeSql("update items set downloads = ?, views = ?, cameramake = ?, cameramodel = ?, info = ? where id = ?", [photoDetails.downloads, photoDetails.views, photoDetails.exif.make, photoDetails.exif.model, photoDetails.id], (_, { rows }) => {
          // console.log('update done');
          resolve(JSON.stringify(rows))
        });
      }
    );
  })

}

module.exports = {
  getPhotoList,
  fetPhotoList,
  fetPhotoDetails,
  getCameraList,
  sortPhotoList,
  searchWithUserPhotoList,
};
