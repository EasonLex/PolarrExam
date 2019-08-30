//
//  citiesocial mobile app
//
//  Created by Eason Lin on 2018/08/13.
//  Copyright © 2016年 citiesocial. All rights reserved.
//

import 'react-native';
import React from 'react';
import {
  fetchDynamicParameters,
  fetchFlashDeals,
  fetchFlashDealsWithPrimaryGroup,
  fetchNavigationMenu,
  fetchCollection,
  fetchProductsInCollectionByHandle,
  fetchProductsWithSpecificBrand,
  fetchRecommendationProductsWithSpecificProduct,
  fetchProductMetafiled,
  fetchHotSearchingKeywords,
} from '../CSApiV1Fetch';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
import "isomorphic-fetch"

test('get product metafields', () => {
	expect.assertions(1);
	return fetchProductMetafiled('dc-4').then(response => {
    let resource_data = (response.resource_data)?true:false;
    expect(resource_data).toBe(true);
	});
});

test('get flash deals', () => {
	expect.assertions(1);
	return fetchFlashDeals().then(response => {
    let page_data = (response.page_data)?true:false;
    expect(page_data).toBe(true);
	});
});

test('get flash deals in primary group', () => {
	expect.assertions(1);
	return fetchFlashDealsWithPrimaryGroup(15).then(response => {
    let page_data = (response.page_data)?true:false;
    expect(page_data).toBe(true);
	});
});

test('get navigation menu', () => {
	expect.assertions(1);
	return fetchNavigationMenu().then(response => {
    // console.log(response);
    let navigation_menu = (response.navigation_menu)?true:false;
    expect(navigation_menu).toBe(true);
	});
});

test('get collection', () => {
	expect.assertions(1);
	return fetchCollection('haier-2018-8-23').then(response => {
    let page_data = (response.page_data)?true:false;
    expect(page_data).toBe(true);
	});
});

test('get products in collection', () => {
	expect.assertions(1);
	return fetchProductsInCollectionByHandle('haier-2018-8-23', 1).then(response => {
    let page_data = (response.page_data)?true:false;
    expect(page_data).toBe(true);
	});
});

test('get products with specific brand', () => {
	expect.assertions(1);
	return fetchProductsWithSpecificBrand('sleep master', 1).then(response => {
    let page_data = (response.page_data)?true:false;
    expect(page_data).toBe(true);
	});
});

test('get recommendation products with specific product', () => {
	expect.assertions(1);
	return fetchRecommendationProductsWithSpecificProduct('1390522335345').then(response => {
    let page_data = (response.page_data)?true:false;
    expect(page_data).toBe(true);
	});
});

test('get dynamic parameters', () => {
	expect.assertions(1);
	return fetchDynamicParameters().then(response => {
    let appData = (response.app)?true:false;
    expect(appData).toBe(true);
	});
});

test('get hot searching keywords', () => {
	expect.assertions(1);
	return fetchHotSearchingKeywords().then(response => {
    let page_data = (response.page_data)?true:false;
    expect(page_data).toBe(true);
	});
});
