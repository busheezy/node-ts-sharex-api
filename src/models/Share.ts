import { Model } from 'objection';
//import path from 'path';

class Share extends Model {
  static tableName = 'shares';

  static get relationMappings() {
    return {};
  }
}

module.exports = Share;
