import { Model } from 'objection';
//import path from 'path';

class Link extends Model {
  static tableName = 'links';

  static get relationMappings() {
    return {};
  }
}

module.exports = Link;
