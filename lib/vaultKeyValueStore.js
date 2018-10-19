/*
 Copyright 2018 Ramananda Panda All Rights Reserved.

 SPDX-License-Identifier: MIT

*/

var options = {
  apiVersion: 'v1', // default
  endpoint: 'http://127.0.0.1:8200', // default
  // token: '1234' // optional client token; can be fetched after valid initialization of the server
};

// get new instance of the client
var vault = require("node-vault")(options);

const debug = require('debug')('MongoKVS');
const mongodb = require('mongodb');

const {
  MongoClient
} = mongodb;

module.exports = class MongoKVS {
  constructor(options) {
    console.log('Enter Constructor, options are %j', options);
    if (!options.dbname) {
      throw new Error('Missing Required dbname in options');
    }
    if (!options.collectionName) {
      throw new Error('Missing Required collectionName in options');
    }
    if (!options.url) {
      throw new Error('Missing Required url in options');
    }
    if (options.auth) {
      this.auth = options.auth;
    }
    this.url = options.url;
    this.apiVersion = options.apiVersion;
    return Promise.resolve(this);
  }

  connect() {
    return vault.init({
        secret_shares: 1,
        secret_threshold: 1
      })
      .then((result) => {
        var keys = result.keys;
        // set token for all following requests
        this.token = result.root_token;
        // unseal vault server
        return vault.unseal({
          secret_shares: 1,
          key: keys[0]
        })
      })
      .catch(console.error);
    debug('Connect to %s', this.url);
    return new Promise((resolve, reject) => {
      MongoClient.connect(this.url, {
        useNewUrlParser: true
      }, (err, client) => {
        if (err) {
          reject(err);
        }
        this.client = client;
        this.db = client.db(this.dbname);
        this.collection = this.db.collection(this.collectionName);
        resolve();
      });
    });
  }

  // eslint-disable-next-line consistent-return
  close() {
    if (this.client.isConnected()) {
      this.collection = null;
      this.db = null;
      return this.client.close();
    }
  }

  async getValue(name) {
    debug('getValue with name %s', name);
    try {
      if (!this.client || !this.client.isConnected() || !this.collection) {
        await this.connect();
      }
      const res = await this.collection.findOne({
        _id: name
      });
      await this.close();

      debug('getValue find -> %j <- from db', res);
      if (!res) {
        return null;
      }
      return res.member;
    } catch (e) {
      debug('getValue error %s', e.message);
      throw e;
    }
  }

  async setValue(name, value) {
    try {
      let data = {};
      data[name] = value;
      await vault.write('secret/hello', data);
      console.log('setValue with name %s, value %j', name, value);
      if (!this.isConnected ) {
        await this.connect();
      }
    } catch (e) {
      console.log('setValue error %s', e.message);
      throw e;
    }
  }
};