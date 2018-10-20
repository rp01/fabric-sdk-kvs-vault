/*
 Copyright 2018 Ramananda Panda All Rights Reserved.

 SPDX-License-Identifier: MIT

*/
process.env.DEBUG = 'VaultKVS';

const VAULT_TOKEN = process.env.VAULT_TOKEN
const debug = require('debug')('VaultKVS');

module.exports = class VaultKVS {
  constructor(options) {
    debug('Enter Constructor, options are %j', options);
    if (!options.apiVersion) {
      throw new Error('Missing Required apiVersion in options');
    }
    if (!options.endpoint) {
      throw new Error('Missing Required endpoint in options');
    }
    this.endpoint = options.endpoint;
    // var options = {
    //   apiVersion: 'v1', // default
    //   endpoint: 'http://127.0.0.1:8200', // default
    //   token: VAULT_TOKEN // optional client token; can be fetched after valid initialization of the server
    // };
    options.token = (VAULT_TOKEN) ? VAULT_TOKEN : this.token;

    if (!options.token) {
      throw new Error('Missing Required token in options');
    }
    this.vault = require("node-vault")(options);
    return this;
  }

  async checkIsInitialized() {
    let {
      initialized
    } = await vault.initialized();
    if (initialized) {
      this.isInitialized = true
    }
    return initialized
  }

  connect() {
    debug('Connect to %s', this.url);
    // init vault server
    return this.vault.init({
        secret_shares: 1,
        secret_threshold: 1
      })
      .then((result) => {
        var keys = result.keys;
        // set token for all following requests
        this.vault.token = result.root_token;
        // unseal vault server
        return vault.unseal({
          secret_shares: 1,
          key: keys[0]
        })
      });
  }


  async getValue(name) {
    debug('getValue with name %s', name);
    try {
      let {
        initialized
      } = await this.vault.initialized()
      if (initialized) {
        debug("retrive data form the vault")
        let {
          data
        } = await this.vault.read(`secret/${name}`)
        return data.value
      } else {
        debug("Vault didn't initialized");
        await this.connect()
      }
    } catch (e) {
      debug('getValue error %s', e.message);
      throw e;
    }
  }

  async setValue(name, value) {
    debug('getValue with name %s', name);
    try {
      let {
        initialized
      } = await this.vault.initialized()
      if (initialized) {
        return this.vault.write(`secret/${name}`, {
          value: value
        })
      } else {
        debug("Vault didn't initialized");
        await this.connect()
      }
    } catch (e) {
      debug('setValue error %s', e.message);
      throw e;
    }
  }
};