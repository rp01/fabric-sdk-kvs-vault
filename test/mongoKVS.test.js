/*
 Copyright 2018 Zhao Chaoyi All Rights Reserved.

 SPDX-License-Identifier: Apache-2.0

*/

const MongoKVS = require('../index');
const assert = require('assert');

let kvs;
describe('Test MongoKVS', () => {
  it('Test constructor', async () => {
    kvs = new MongoKVS({
      url: 'mongodb://localhost:27017',
      dbname: 'fabric-ca',
      collectionName: 'kvs',
    });
  });

  it('Test setValue', async () => {
    await kvs.setValue('test', 'case');
    const res = await kvs.getValue('test');
    assert.equal(res, 'case');
  });
});
