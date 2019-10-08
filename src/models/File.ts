import { Model } from 'objection';
//import path from 'path';

class File extends Model {
  static tableName = 'files';

  static get relationMappings() {
    return {};
  }
}

module.exports = File;
