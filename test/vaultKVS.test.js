/*
 Copyright 2018 Zhao Chaoyi All Rights Reserved.

 SPDX-License-Identifier: Apache-2.0

*/

const VaultKVStore = require('../index');
const assert = require('assert');

let kvs;
describe('Test VaultKVStore', () => {
  it('Test constructor', async () => {
    kvs = new VaultKVStore({
      endpoint: "http://127.0.0.1:8200",
      apiVersion: "v1",

  });
  });

  it('Test setValue', async () => {
    await kvs.setValue('test', 'case');
    const res = await kvs.getValue('test');
    assert.equal(res, 'case');
  });
});
