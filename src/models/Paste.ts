import { Model } from 'objection';
//import path from 'path';

class Paste extends Model {
  static tableName = 'pastes';

  static get relationMappings() {
    return {};
  }
}

module.exports = Paste;
