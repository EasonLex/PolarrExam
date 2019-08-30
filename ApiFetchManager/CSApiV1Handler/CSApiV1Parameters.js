//
//  citiesocial mobile app
//
//  Created by Eason Lin on 2018/08/13.
//  Copyright © 2016年 citiesocial. All rights reserved.
//

// const base64 = require('base-64');

// const CSSHAKey       = 'F3r56n6v3E3396Uf';
// const CSSHAPassword  = 'y368s76Te3M8235W';
// const CSSHASecret    = 'pa33879F3MF67gnES3EH3JB89zytEu3Q';
// const encodedAuth    = 'Basic '+ base64.encode(CSSHAKey + ':' + CSSHAPassword);
const ApiKey = 'cab4d1b7c6ade5c0dd6d38c3a67246e27ba324e8bd949d75472598d29d061e1e';

const CSApiV1Url = {
  baseUrl:          'https://api.unsplash.com/',
};

const CSApiV1Path = {
  photoPath:                  'photos/',
  searchPath:                 'search/',
  collectionsPath:            'collections/'
};

module.exports = {ApiKey, CSApiV1Url, CSApiV1Path};
