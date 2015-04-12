"use strict";


var _ = require('lodash'),
  debug = require('debug')('robe-db'),
  Class = require('class-extend'),
  Q = require('bluebird');

var Collection = require('./collection'),
  Oplog = require('./oplog');



/**
 * Represents a database connection.
 */
class Database {
  /**
   * Constructor.
   * @param  {Object} db Mongoskin db connection.
   */
  constructor (db) {
    this.db = db;
    this.oplog = new Oplog(this);
  }


  /**
   * Close this database connection.
   * @return {Promise}
   */
  close () {
    debug('close');

    if (2 === _.deepGet(this.db, 'driver._state')) {
      return Q.promisify(self.db.close, self.db)();
    } else {
      return Q.resolve();
    }
  }


  /**
   * Fetch a collection from the db.
   *
   * @param {Object} [options] Additional options.
   * @param {Object} [options.schema] Collection schema.
   * 
   * @return {Collection}
   */
  collection (name, options) {
    return new Collection(this.db.get(name), options);
  }

}

Database.extend = Class.extend;



module.exports = Database;
