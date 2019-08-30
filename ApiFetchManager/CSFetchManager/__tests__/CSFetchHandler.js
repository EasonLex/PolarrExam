//
//  citiesocial mobile app
//
//  Created by Eason Lin on 2018/08/13.
//  Copyright © 2016年 citiesocial. All rights reserved.
//

import 'react-native';
import React from 'react';
import fetctApi from '../CSFetchHandler';

// Note: test renderer must be required after react-native.

import renderer from 'react-test-renderer';
import "isomorphic-fetch"


test('empty request', () => {
	expect.assertions(1);
	return fetctApi().then(response => {
	  let emptyResponse = {'result':'failed', 'response': 'Empty request/url'};
	  expect(response).toEqual(emptyResponse);
	});
});

test('empty url', () => {
	expect.assertions(1);
	return fetctApi({'method':'GET'}).then(response => {
	  let emptyResponse = {'result':'failed', 'response': 'Empty request/url'};
	  expect(response).toEqual(emptyResponse);
	});
});

test('fetch api test: GET', () => {
	expect.assertions(1);

  	let tmpRequest = { 'method':   'GET',
                       'url':      'https://www.citiesocial.com/collections/kuvrd-2019-7-8.json'};
  	return fetctApi(tmpRequest).then(response => {
		let gotData = response.collection ? true:false
    	expect(gotData).toBe(true)
	});
});

test('get for Content-Type -> x-www-form-urlencoded', () => {
	expect.assertions(1);

	var cData = { 'customer_email': 'eason@citiesocial.com',
				  'with_history': true,
				  'with_referral_code': true };

	let tmpRequest = { 'method':   'GET',
					   'url':      'https://app.swellrewards.com/api/v2/customers',
					   'headers':  {'Conteyt-type': 'application/x-www-form-urlencoded',
									'x-merchant-id':'52052',
									'x-api-key': '92kxbi7wB23YFGe2yw6JwAtt'},
					   'data':	   cData};
	return fetctApi(tmpRequest).then(response => {
		let gotData = (!!response.result && response.result === 'failed') ? true:false
		expect(gotData).toBe(true)
		});
});
