'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};


exports.up = function(db,callback) {
  db.createTable('tb_users', {
    columns: {
      user_id: { type: 'int', notNull: true, primaryKey: true, autoIncrement: true, unsigned: true, length: 11},
      user_first_name: {type:'string'},
      user_last_name:  {type:'string' },
      user_full_name:{type:'string' },
      user_email: {type:'string',unique:true },
      password: { type: 'string', notNull:false },
      avatar:  {type:'string' },
      user_cover_image: {type:'string' },
      phone_number : {type:'char',length: 40 },
      user_group: {type:'int',length: 11 },
   

  
   },
    ifNotExists: true
}, callback);
};

exports.down = function(db,callback) {
  db.dropTable('tb_users', callback);
};

exports._meta = {
  "version": 1
};
